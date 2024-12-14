import {mapMultiply} from "./mapMultiply.ts";
import {ResourceTypeRaw} from "../genericTypes.ts";

type DeltaType = 'INCREMENT' | 'DECREMENT';
export type DeltaResponse<K extends string, T extends string> = Increment<K, T> | Decrement<K, T>

export type Delta<K extends string> = {
  to: number;
  by: number;
  cut: number;
  factor: number;
  isFullyPossible: boolean;
  isPartlyPossible: boolean;
  current: number;
  updateApproach: number;
  min: number;
  max: number;
  key: K;
  type: DeltaType
}

class Increment<K extends string, T extends string> implements Delta<K> {
  public readonly key: K;
  public readonly to: number;
  public readonly by: number;
  public readonly cut: number;
  public readonly factor: number;
  public readonly isFullyPossible: boolean;
  public readonly isPartlyPossible: boolean;
  public readonly type: DeltaType;
  public readonly current: number;
  public readonly min: number;
  public readonly max: number;
  constructor(
    public readonly prevState: ResourceTypeRaw<K, T> & {key: K},
    public readonly updateApproach: number,
  ) {
    const {
      key,
      value: current,
      min,
      max,
    } = prevState;
    this.key = key;
    this.current = current;
    this.min = min;
    this.max = max;
    this.to = round(current + updateApproach < max ? current + updateApproach : max);
    this.by = round(this.to - current);
    this.cut = round(Math.abs(this.by - updateApproach));
    this.factor = mapMultiply(this.to, current + updateApproach, current);
    this.isFullyPossible = !this.cut;
    this.isPartlyPossible = current !== this.to;
    this.type = 'INCREMENT';
  }
}

class Decrement<K extends string, T extends string> implements Delta<K>{
  public readonly key: K;
  public readonly to: number;
  public readonly by: number;
  public readonly cut: number;
  public readonly factor: number;
  public readonly isFullyPossible: boolean;
  public readonly isPartlyPossible: boolean;
  public readonly type: DeltaType;
  public readonly current: number;
  public readonly min: number;
  public readonly max: number;
  constructor(
    public readonly prevState: ResourceTypeRaw<K, T> & {key: K},
    public readonly updateApproach: number,
  ) {
    const {
      key,
      value: current,
      min,
      max,
    } = prevState;
    this.key = key;
    this.current = current;
    this.min = min;
    this.max = max;
    this.to = round(current + updateApproach > min ? current + updateApproach : min);
    this.by = -round(current - this.to);
    this.cut = round(Math.abs(updateApproach - this.by));
    this.factor = -mapMultiply(this.to, current - updateApproach, current);
    this.isFullyPossible = !this.cut;
    this.isPartlyPossible = current !== this.to
    this.type = 'DECREMENT';
  }
}

const round = (n: number) => Math.round(n * 100) / 100;

export const delta = <K extends string, T extends string>(
  current: ResourceTypeRaw<K, T> & {key: K},
  updateBy: number,
) =>
  updateBy >= 0
    ? new Increment(current, updateBy)
    : new Decrement(current, updateBy);
