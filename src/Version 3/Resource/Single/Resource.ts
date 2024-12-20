import {
  ResourceBeautyType,
  ResourceUpdateProps,
  ResourceTypeRaw,
  ResourceCostUpdate,
} from "./genericTypes.ts";
import {beautifyNumber, mapMultiply} from "./helpers";
import {makeAutoObservable} from "mobx";
import icons from "../../../Resource/assets/icons/icons.ts";
import {id} from "./helpers/id.ts";

type UpdateProps<K, T> = Partial<ResourceTypeRaw<K, T>>;

export class Resource<K extends string, T extends string> {
  public id: string;
  public key: K;
  public value: number;
  public min: number;
  public max: number;
  public label: string;
  public type: T;
  public cost: ResourceCostUpdate<K> | null;
  public revealedAt: ResourceCostUpdate<K> | null;
  public iconName: string;

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

    this.id = id();
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

  public readonly updateValueBy = (value: number): Resource<K, T> => {
    this.value = this.respectConstraints(this.value + value)
    return this;
  }

  public readonly setTo = (update: UpdateProps<K, T>): Resource<K, T> => {
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

  get percentage() {
    return Math.floor(mapMultiply(this.value, this.max) * 100);
  }

  get beautify(): ResourceBeautyType {
    return {
      value: beautifyNumber(this.value),
      min: beautifyNumber(this.min),
      max: beautifyNumber(this.max),
      fillPercentage: this.value / this.max * 100
    }
  }

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
