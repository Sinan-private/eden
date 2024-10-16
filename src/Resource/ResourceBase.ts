import {
  ResourceBeautyType,
  ResourceUpdateProps,
  ResourceTypeRaw,
  ResourceState, ResourceCost, ResourceCostUpdate,
} from "./types";
import {beautifyNumber, delta, mapMultiply} from "./helpers";
import {icons} from "../gameRules/icons.ts";

type UpdateProps<K, T> = Partial<ResourceTypeRaw<K, T>>;

export class ResourceBase<K extends string, T extends string> {
  public readonly key: K;
  public readonly value: number;
  public readonly min: number;
  public readonly max: number;
  public readonly label: string;
  public readonly type: T;
  public readonly cost: ResourceCost<K> | null;
  public readonly icon: string;

  constructor(raw_resource: ResourceUpdateProps<K, T>) {
    const {
      min,
      max,
      value,
      label,
      type,
      key,
      cost,
      icon,
    } = raw_resource;
    this.key = key;
    this.value = typeof value === 'number' ? value : 0;
    this.min = typeof min === 'number' ? min : 0;
    this.max = typeof max === 'number' ? max : Infinity;
    this.label = label || key ? labelFromKey(key) : 'No label';
    this.type = type || '' as T;
    this.cost = this.__createCost(cost);
    // @ts-ignore
    this.icon = icon || icons[key];
  }

  private readonly __createCost = (cost?: ResourceCostUpdate<K> | null): ResourceCost<K> | null => {
    if (!cost) {
      return null
    }
    // Here I want to iterate over each Resource and enrich it with the relevant stuff for it
    const give = cost.give.map(resource => ({
      ...resource,
        icon: new ResourceBase(resource).icon,
    }));
    const gain = cost.gain.map(resource => ({
      ...resource,
      icon: new ResourceBase(resource).icon,
    }))
    return {give, gain}
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
    const {
      value = this.value,
      ...constraints
    } = update;
    return new ResourceBase({...this, ...constraints}).setValueTo(value);
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
      cost: this.cost,
    }
  }
}

const labelFromKey = (key: string) =>
  key
    .charAt(0)
    .toUpperCase() + key.slice(1)
    .split('_')
    .join(' ')
