import {
  ResourceBeautyType,
  ResourceUpdateProps,
  ResourceTypeRaw,
  ResourceCostUpdate,
} from "./genericTypes.ts";
import {beautifyNumber, mapMultiply} from "./helpers";
import {makeAutoObservable} from "mobx";
import icons from "../../../Resource/assets/icons/icons.ts";
import {delta} from "./helpers";

type UpdateProps<K, T> = Partial<ResourceTypeRaw<K, T>>;

export class ResourceBase<K extends string, T extends string> {
  public key: K;
  public value: number;
  public min: number;
  public max: number;
  public label: string;
  public type: T;
  public cost: ResourceCostUpdate<K> | null;
  public revealedAt: ResourceCostUpdate<K> | null;
  public iconName: string;

  // I want to create the cost for the frontend to easily render
  // And for the storage to save in a clean way
  // So I need the internal storage to be smart. Offering all basics and methods to get what I need
  // - stateToStorage

  constructor(raw_resource: ResourceUpdateProps<K, T>) {
    const defaultResource = {
      key: '' as K,
      value: 1,
      min: 0,
      max: Infinity,
      label: '',
      type: '' as T,
      cost: null,
      revealedAt: null,
      iconName: 'empty',
    }
    const {
      min,
      max,
      value,
      label,
      type,
      key,
      cost,
      revealedAt,
      iconName,
    } = {
      ...defaultResource,
      ...raw_resource
    };

    this.key = key;
    this.value = value;
    this.min = typeof min === 'number' ? min : 0;
    this.max = typeof max === 'number' ? max : Infinity;
    this.label = label ? label : key ? labelFromKey(key) : '';
    this.type = typeof type === 'string' ? type : '' as T;
    this.cost = cost || null;
    this.revealedAt = revealedAt || null;
    this.iconName = iconName || 'empty';
    makeAutoObservable(this)
  }

  public readonly updateBy = (update: UpdateProps<K, T>): ResourceBase<K, T> => {
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

  public readonly updateValueBy = (value: number): ResourceBase<K, T> => {
    console.log('my new value', value + this.value)
    this.value = this.__respectConstraints(this.value + value)
    return this;
  }

  public readonly setTo = (update: UpdateProps<K, T>): ResourceBase<K, T> => {
    // I want to be able to set every value here
    const {
      value = this.value,
      ...rest
    } = update;
    return Object.assign(this, rest).setValueTo(value);
  }

  public readonly setValueTo = (value: number): ResourceBase<K, T> => {
    this.value = this.__respectConstraints(value)
    return this
  };

  public readonly delta = (update: UpdateProps<K, T>) => delta(
    {...this},
    update.value || 0
  );

  private readonly __respectConstraints = (value: number): number =>
    value > this.max
      ? this.max
      : value < this.min
        ? this.min
        : value

  // private readonly __simplifyCost = (val: ResourceCostUpdate<K> | null) => {
  //   if (!val) {
  //     return null
  //   }
  //   const give = val.give.map(({key, value}) => ({key, value}))
  //   const gain = val.gain.map(({key, value}) => ({key, value}))
  //   return {give, gain}
  // }

  get percentage() {
    return Math.floor(mapMultiply(this.value, this.max) * 100);
  }

  get beautify(): ResourceBeautyType {
    return {
      // ...this.state,
      value: beautifyNumber(this.value),
      min: beautifyNumber(this.min),
      max: beautifyNumber(this.max),
      fillPercentage: this.value / this.max * 100
    }
  }

  // get state(): ResourceState<K, T> {
  //   return {
  //     key: this.key,
  //     value: this.value,
  //     min: this.min,
  //     max: this.max,
  //     label: this.label,
  //     type: this.type,
  //     cost: this.__simplifyCost(this.cost),
  //     revealedAt: this.__simplifyCost(this.revealedAt),
  //     iconName: this.iconName,
  //   }
  // }
  get icon(): string {
    return icons.find(icon => icon.name === this.iconName)?.src || ''
  }
}

const labelFromKey = (key: string) =>
  key
    .charAt(0)
    .toUpperCase() + key.slice(1)
    .split('_')
    .join(' ')
