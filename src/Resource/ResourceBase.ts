import {
  ResourceBeautyType,
  ResourceUpdateProps,
  ResourceTypeRaw,
  ResourceState,
  ResourceCostUpdate,
} from "./types";
import {beautifyNumber, delta, mapMultiply} from "./helpers";

type UpdateProps<K, T> = Partial<ResourceTypeRaw<K, T>>;

export class ResourceBase<K extends string, T extends string> {
  public readonly key: K;
  public readonly value: number;
  public readonly min: number;
  public readonly max: number;
  public readonly label: string;
  public readonly type: T;
  public readonly cost: ResourceCostUpdate<K> | null;
  public readonly iconName: string;

  // I want to create the cost for the frontend to easily render
  // And for the storage to save in a clean way
  // So I need the internal storage to be smart. Offering all basics and methods to get what I need
  // - stateToStorage

  constructor(raw_resource: ResourceUpdateProps<K, T>) {
    const {
      min,
      max,
      value,
      label,
      type,
      key,
      cost,
      iconName,
    } = raw_resource;

    this.key = key;
    this.value = typeof value === 'number' ? value : 0;
    this.min = typeof min === 'number' ? min : 0;
    this.max = typeof max === 'number' ? max : Infinity;
    this.label = label ? label : key ? labelFromKey(key) : 'No label';
    this.type = typeof type === 'string' ? type : '' as T;
    this.cost = cost || null;
    this.iconName = iconName || 'empty';
  }

  public readonly updateBy = (update: UpdateProps<K, T>): ResourceState<K, T> => {
    // This is a little complex to update constraints first before updating the value
    // This respects that the new value might be different after e.g. the max value raised.
    const constraints = {
      min: this.min + (update.min || 0),
      max: this.max + (update.max || 0),
      value: this.value,
    }
    const newValue = (update.value || 0) + this.value;
    return new ResourceBase({...this, ...constraints}).setValueTo(newValue);
  }

  public readonly updateValueBy = (value: number): ResourceState<K, T> => ({
    ...this.state,
    value: this.__respectConstraints(this.value + value)
  })

  public readonly setTo = (update: UpdateProps<K, T>): ResourceState<K, T> => {
    // I want to be able to set every value here
    const {
      value = this.value,
      ...rest
    } = update;
    console.log(update)
    return new ResourceBase({...this, ...rest}).setValueTo(value);
  }

  public readonly setValueTo = (value: number): ResourceState<K, T> => ({
    ...this.state,
    value: this.__respectConstraints(value),
  });

  public readonly delta = (update: UpdateProps<K, T>) => delta(
    {...this.state},
    update.value || 0
  )

  public readonly __respectConstraints = (value: number): number =>
    value > this.max
      ? this.max
      : value < this.min
        ? this.min
        : value

  private readonly __simplifyCost = () => {
    if (!this.cost) {
      return null
    }
    const give = this.cost.give.map(({key, value}) => ({key, value}))
    const gain = this.cost.gain.map(({key, value}) => ({key, value}))
    return {give, gain}
  }

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

  get state(): ResourceState<K, T> {
    return {
      key: this.key,
      value: this.value,
      min: this.min,
      max: this.max,
      label: this.label,
      type: this.type,
      cost: this.__simplifyCost(),
      iconName: this.iconName,
    }
  }
}

const labelFromKey = (key: string) =>
  key
    .charAt(0)
    .toUpperCase() + key.slice(1)
    .split('_')
    .join(' ')
