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
import {ResourceKeys} from "src/GameEngine/ResourceEngine";

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
  private recentChanges = new RingBuffer(100);
  public lifetimeEarned = 0;
  public lifetimeSpent = 0;
  public sessionEarned = 0;
  public sessionSpent = 0;

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
    this.type = typeof type === 'string' && type.length ? type : 'empty' as T;
    this.cost = cost || null;
    this.revealedAt = revealedAt || null;
    this.iconName = iconName || 'empty';
    makeAutoObservable(this)
  }

  public readonly updateBy = (update: UpdateProps<K, T>) => {
    // This is a little complex to update constraints first before updating the value
    // This respects that the new value might be different after e.g. the max value raised.
    const constraints = {
      min: this.min + (update.min || 0),
      max: this.max + (update.max || 0),
      value: this.value,
    }
    const newValue = (update.value || 0) + this.value;
    Object.assign(this, constraints).setValueTo(newValue);
  }

  public readonly setToMin = () => this.setValueTo(this.min)

  public readonly updateValueBy = (value: number): boolean =>
    this.setValueTo(this.value + value)

  public readonly setTo = (update: UpdateProps<K, T> & { key?: K }): void => {
    // I want to be able to set every value here
    const {
      value = this.value,
      ...rest
    } = update;
    Object.assign(this, rest).setValueTo(value);
  }

  public readonly setValueTo = (value: number): boolean => {
    const newValue = this.respectConstraints(value);
    const delta = newValue - this.value;
    if (delta === 0) {
      return false
    }
    if (delta < 0) {
      this.lifetimeSpent += delta;
      this.sessionSpent += delta;
    } else {
      this.lifetimeEarned += delta;
      this.sessionEarned += delta;
    }
    this.recentChanges.push(delta);
    this.value = this.respectConstraints(value)
    return true
  };

  public readonly respectConstraints = (value: number): number =>
    value > this.max
      ? this.max
      : value < this.min
        ? this.min
        : value

  public updateCost = (changeKey: 'give' | 'gain', {key, value}: TradeChange<K, T>): void => {
    if (!this.cost) {
      return
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

  public addCost = (changeKey: 'give' | 'gain', extraCost: TradeChange<K, T>): void => {
    const cost = this.cost || {give: [], gain: []};
    this.setTo({
      cost: {
        ...cost,
        [changeKey]: cost[changeKey].concat(extraCost)
      }
    })
  }

  public removeCost = (changeKey: 'give' | 'gain', resourceKey: ResourceKeys): void => {
    if (!this.cost) {
      return
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

  public resetSession = ()=> {
    this.sessionEarned  =0;
    this.sessionSpent = 0;
  }

  get getChangePerTick(): number {
    return this.recentChanges.average();
  }

  get percentage() {
    return this.value / this.max * 100
  }

  get beautify(): ResourceBeautyType {
    return {
      value: beautifyNumber(Math.floor(this.value)),
      min: beautifyNumber(this.min),
      max: beautifyNumber(this.max),
      percentage: this.percentage
    }
  }

  get icon(): string {
    return icons.find(icon => icon.name === this.iconName)?.src || ''
  }

  get state() {
    return {
      key: this.key,
      value: this.value,
      min: this.min,
      max: this.max,
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

  get progress() {
    return (this.value - Math.floor(this.value)) * 100
  }
}

const labelFromKey = (key: string) =>
  key
    .charAt(0)
    .toUpperCase() + key.slice(1)
    .split('_')
    .join(' ')


// This only exists as a stabilisation for the array holding the most recent updates.
// I am using this to estimate the changes of a resource per second.
// This is also the decision, why the class is living in here since it is not relevant anywhere else

class RingBuffer {
  private buffer: number[];
  private index = 0;
  private filled = false;

  constructor(private size: number) {
    this.buffer = new Array(size).fill(0);
    makeAutoObservable(this)
  }

  public push(value: number) {
    this.buffer[this.index] = value;
    this.index = (this.index + 1) % this.size;
    if (this.index === 0) this.filled = true;
  }

  public average(): number {
    const len = this.filled ? this.size : this.index;
    const sum = this.buffer.slice(0, len).reduce((acc, v) => acc + v, 0);
    return len > 0 ? sum / len : 0;
  }
}
