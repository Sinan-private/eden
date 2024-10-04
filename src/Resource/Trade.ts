import {ResourceState, ResourceUpdateProps} from "./types.ts";
import {ResourceSingle} from "./ResourceSingle.ts";

// limiting resource multiplied until I have the right possibleTradingAmount

export class Trade<T extends string> {
  // public readonly giveApproach: ResourceUpdateType<T>[];
  // public readonly gainApproach: ResourceUpdateType<T>[];
  public readonly limitingResources: LimitingResource<T>[];
  // public readonly possibleFactor: number;
  public readonly isFullyPossible: boolean;
  public readonly isPartlyPossible: boolean;
  public readonly stateUpdates: ResourceState<T>[];
  public readonly newState: ResourceState<T>[];
  public readonly possibleTradingAmount: number; // 6 bakeries can still create a single bread

  constructor(
    private readonly __give: ResourceUpdateProps<T>[], // [{key: 'corn', value: 1}, {key: 'water', value: 2}]
    private readonly __gain: ResourceUpdateProps<T>[], // [{key: 'bread', value: 1}]
    private readonly __state: ResourceState<T>[],
    public readonly tradingAmount: number
  ) {
    this.possibleTradingAmount = this.__getPossibleTradingAmount();
    const changes = this.__getMergedChanges(this.possibleTradingAmount);
    this.limitingResources = getLimitingResources(changes);
    this.isFullyPossible = this.possibleTradingAmount === this.tradingAmount;
    this.isPartlyPossible = this.possibleTradingAmount > 0;
    this.stateUpdates = this.isPartlyPossible ? createChanges<T>(changes) : [];
    this.newState = __state.map(resource =>
      new Set(this.stateUpdates.map(({key}) => key)).has(resource.key)
        ? this.stateUpdates.find(({key}) => key === resource.key) as ResourceState<T>
        : resource
    )
  }

  private readonly __getMergedChanges = (tradingAmount = 1): ResourceUpdateType<T>[] => {
    // toNegative() is just done so that a loss of 10 can be passed while being processed as -10
    const giveApproach = mergeWithState<T>(toNegative(this.__give), this.__state, tradingAmount);
    const gainApproach = mergeWithState<T>(this.__gain, this.__state, tradingAmount);
    return giveApproach.concat(gainApproach)
  }

  private readonly __getPossibleTradingAmount = () => {
    const changes = this.__getMergedChanges(this.tradingAmount);
    const lowest = getLowestFactor<T>(getLimitingResources(changes));
    return Math.floor(lowest * this.tradingAmount)
  }
}

const createChanges = <T extends string>(
  mergedApproaches: ResourceUpdateType<T>[],
): ResourceState<T>[] => {
  return mergedApproaches.map((resource) =>
    new ResourceSingle(resource)
      .updateBy({value: resource.valueChangeApproach})
  );
}

type LimitingResource<T extends string> = { key: T, factor: number }

const getLimitingResources = <T extends string>(
  mergedApproaches: ResourceUpdateType<T>[],
): LimitingResource<T>[] => {
  const limiting = getFactors<T>(mergedApproaches)
    .filter(([, factor]) => factor < 1)
  return limiting.map(([key, value]) => ({key, factor: value}));
}


const getLowestFactor = <T extends string>(limitingResources: LimitingResource<T>[]) =>
  limitingResources.length
    ? calcLowestFactor(limitingResources)
    : 1

const calcLowestFactor = <T extends string>(limitingResources: LimitingResource<T>[]): number => {
  return limitingResources
    .map(({factor}) => factor)
    .sort((a, b) => a - b)[0]
}

const getFactors = <T extends string>(approach: ResourceUpdateType<T>[]) => {
  return approach.reduce((limiters, curr) => {
    const update = {
      min: curr.minChangeApproach,
      max: curr.maxChangeApproach,
      value: curr.valueChangeApproach,
    }
    const {key, factor} = new ResourceSingle(curr).delta(update);
    limiters.push([key, factor])
    return limiters;
  }, [] as [T, number][])
}

const mergeWithState = <T extends string>(
  change: ResourceUpdateProps<T>[],
  state: ResourceState<T>[],
  tradingAmount: number,
): ResourceUpdateType<T>[] => {
  return change.map(s => {
    const current = state.find(({key}) => s.key === key) as ResourceState<T>;
    // const {min, max, value, key} = state.find(({key}) => s.key === key) as ResourceProps;
    const val = (x?: number) => (x || 0) * tradingAmount;
    return {
      ...current,
      valueChangeApproach: val(s.value),
      minChangeApproach: val(s.min),
      maxChangeApproach: val(s.max),
    }
  })
}
const forceNegative = (val = 0) => -Math.abs(val)
const toNegative = <T extends string>(give: ResourceUpdateProps<T>[]): ResourceUpdateProps<T>[] => give
  .map(({key, min, max, value}) => ({
    key,
    min: forceNegative(min),
    max: forceNegative(max),
    value: forceNegative(value),
  }))

type ResourceUpdateType<T> = {
  valueChangeApproach: number;
  minChangeApproach: number;
  maxChangeApproach: number;
} & ResourceUpdateProps<T>;
