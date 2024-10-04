import {
  ResourceBeautyType,
  ResourceUpdateProps,
  ResourceTypeRaw, ResourceState,
} from "./types";
import {beautifyNumber, delta, mapMultiply} from "./helpers";

type UpdateProps = Partial<ResourceTypeRaw>;

export class ResourceSingle<T extends string> {
  public readonly key: T;
  public readonly value: number;
  public readonly min: number;
  public readonly max: number;
  public readonly label: string;
  public readonly type: string;

  constructor(raw_resource: ResourceUpdateProps<T>) {
    const {
      min,
      max,
      value,
      label,
      type,
      key
    } = raw_resource;
    this.key = key;
    this.value = typeof value === 'number' ? value : 0;
    this.min = typeof min === 'number' ? min : 0;
    this.max = typeof max === 'number' ? max : Infinity;
    this.label = label || 'Label missing';
    this.type = type || 'type missing';
  }

  public readonly updateBy = (update: UpdateProps): ResourceState<T> => {
    // This is a little complex to update constraints first before updating the value
    // This respects that the new value might be different after e.g. the max value raised.
    const constraints = {
      min: this.min + (update.min || 0),
      max: this.max + (update.max || 0),
      value: this.value,
    }
    const newValue = (update.value || 0) + this.value;
    return new ResourceSingle({...this, ...constraints}).setValueTo(newValue);
  }

  public readonly updateValueBy = (value: number): ResourceTypeRaw => ({
    ...this.state,
    value: this.__respectConstraints(this.value + value)
  })

  public readonly setTo = (update: UpdateProps): ResourceTypeRaw => {
    const {
      value = this.value,
      ...constraints
    } = update;
    return new ResourceSingle({...this, ...constraints}).setValueTo(value);
  }

  public readonly setValueTo = (value: number): ResourceState<T> => ({
    ...this.state,
    value: this.__respectConstraints(value),
  });

  public readonly delta = (update: UpdateProps) => delta(
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

  get state(): ResourceState<T> {
    return {
      key: this.key,
      value: this.value,
      min: this.min,
      max: this.max,
      label: this.label,
      type: this.type,
    }
  }
}
