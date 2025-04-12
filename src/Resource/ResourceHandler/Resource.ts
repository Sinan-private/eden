import {
  ResourceBeautyType,
  ResourceUpdateProps,
  ResourceTypeRaw,
  ResourceCostUpdate, TradeChange,
} from "./genericTypes.ts";
import {beautifyNumber} from "../helpers";
import {makeAutoObservable, toJS} from "mobx";
import icons from "../assets/icons/icons.ts";
import {id} from "../helpers/id.ts";
import {ResourceKeys} from "@/Resource";

type UpdateProps<K, T> = Partial<ResourceTypeRaw<K, T>>;

export class Resource<K extends string, T extends string> {
  public id: string = id();
  public reference_id: string;
  public key: K;
  public value: number = 1;
  public min: number = 0;
  public max: number = Infinity;
  public label: string;
  public type: T;
  public cost: ResourceCostUpdate<K, T> | null;
  public revealedAt: ResourceCostUpdate<K, T> | null;
  public iconName: string = 'empty';

  constructor(
    {
      min,
      max,
      value,
      label,
      type,
      key,
      cost,
      revealedAt,
      iconName,
      reference_id,
    }: ResourceUpdateProps<K, T>) {

    this.reference_id = reference_id || '';
    this.key = key;
    this.value = typeof value === 'number' ? value : 1;
    this.min = typeof min === 'number' ? min : 0;
    this.max = typeof max === 'number' ? max : Infinity;
    this.label = label ? label : key ? labelFromKey(key) : '';
    this.type = typeof type === 'string' ? type : '' as T;
    this.cost = cost || null;
    this.revealedAt = revealedAt || null;
    this.iconName = iconName || 'empty';
    makeAutoObservable(this)
  }

  public readonly updateBy = (update: UpdateProps<K, T>): Resource<K, T> => {
    // This is a little complex to update constraints first before updating the value
    // This respects that the new value might be different after e.g. the max value raised.
    const constraints = {
      min: this.min + (update.min || 0),
      max: this.max + (update.max || 0),
      value: this.value,
    }
    const newValue = (update.value || 0) + this.value;
    return Object.assign(this, constraints).setValueTo(newValue);
  }

  public readonly setToMin = () => this.setValueTo(this.min)

  public readonly updateValueBy = (value: number): Resource<K, T> => {
    this.value = this.respectConstraints(this.value + value)
    return this;
  }

  public readonly setTo = (update: UpdateProps<K, T> & { key?: K }): Resource<K, T> => {
    // I want to be able to set every value here
    const {
      value = this.value,
      ...rest
    } = update;
    return Object.assign(this, rest).setValueTo(value);
  }

  public readonly setValueTo = (value: number): Resource<K, T> => {
    this.value = this.respectConstraints(value)
    return this
  };

  public readonly respectConstraints = (value: number): number =>
    value > this.max
      ? this.max
      : value < this.min
        ? this.min
        : value

  public updateCost = (changeKey: 'give' | 'gain', {key, value}: TradeChange<K, T>) => {
    if (!this.cost) {
      return null
    }
    const updatedCost = toJS(this.cost)[changeKey].map(resource => resource.key === key
      ? ({...resource, value})
      : resource
    )
    this.setTo({
      cost: {
        ...this.cost,
        [changeKey]: updatedCost
      }
    })
  }

  public addCost = (changeKey: 'give' | 'gain', extraCost: TradeChange<K, T>) => {
    const cost = this.cost || {give: [], gain: []};
    this.setTo({
      cost: {
        ...cost,
        [changeKey]: cost[changeKey].concat(extraCost)
      }
    })
  }

  public removeCost = (changeKey: 'give' | 'gain', resourceKey: ResourceKeys) => {
    if (!this.cost) {
      return null
    }
    const updatedCost = toJS(this.cost)[changeKey].filter(({key}) => key !== resourceKey)
    this.setTo({
      cost: {
        ...this.cost,
        [changeKey]: updatedCost
      }
    })
  }

  public hasEnough = (value: number): boolean =>
    this.value - value >= this.min

  public clone = () => new Resource({
    ...this.state,
    reference_id: this.id,
  })

  get percentage() {
    return this.value / this.max * 100
  }

  get beautify(): ResourceBeautyType {
    return {
      // value: this.value.toLocaleString(),
      value: beautifyNumber(this.value),
      min: beautifyNumber(this.min),
      max: beautifyNumber(this.max),
      fillPercentage: this.value / this.max * 100
    }
  }

  get icon(): string {
    return icons.find(icon => icon.name === this.iconName)?.src || ''
  }

  get state() {
    return {
      key: this.key,
      value: Math.floor(this.value),
      min: Math.floor(this.min),
      max: Math.floor(this.max),
      label: this.label,
      type: this.type,
      iconName: this.iconName,
      cost: toJS(this.cost),
      revealedAt: toJS(this.revealedAt),
    }
  }

  get is_max() {
    return this.value >= this.max
  }

  get is_min() {
    return this.value <= this.min
  }
}

const labelFromKey = (key: string) =>
  key
    .charAt(0)
    .toUpperCase() + key.slice(1)
    .split('_')
    .join(' ')
