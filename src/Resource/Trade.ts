import {ResourceState, ResourceUpdateProps} from "./genericTypes.ts";
import {ResourceBase} from "./ResourceBase.ts";

// limiting resource multiplied until I have the right possibleTradingAmount

export class Trade<K extends string, T extends string> {
  // public readonly giveApproach: ResourceUpdateProps<K, T>[];
  // public readonly gainApproach: ResourceUpdateProps<K, T>[];
  public readonly limitingResources: LimitingResource<K>[];
  // public readonly possibleFactor: number;
  public readonly isFullyPossible: boolean;
  public readonly isPartlyPossible: boolean;
  public readonly stateUpdates: ResourceState<K, T>[];
  public readonly newState: ResourceState<K, T>[];
  public readonly possibleTradingAmount: number; // 6 bakeries can still create a single bread

  constructor(
    private readonly __give: ResourceUpdateProps<K, T>[], // [{key: 'corn', value: 1}, {key: 'water', value: 2}]
    private readonly __gain: ResourceUpdateProps<K, T>[], // [{key: 'bread', value: 1}]
    private readonly __state: ResourceState<K, T>[],
    public readonly tradingAmount: number
  ) {
    this.possibleTradingAmount = this.__getPossibleTradingAmount();
    const changes = this.__getMergedChanges(this.possibleTradingAmount);
    this.limitingResources = getLimitingResources(changes);
    this.isFullyPossible = this.possibleTradingAmount === this.tradingAmount;
    this.isPartlyPossible = this.possibleTradingAmount > 0;
    this.stateUpdates = this.isPartlyPossible ? createChanges<K, T>(changes) : [];
    this.newState = __state.map(resource =>
      new Set(this.stateUpdates.map(({key}) => key)).has(resource.key)
        ? this.stateUpdates.find(({key}) => key === resource.key) as ResourceState<K, T>
        : resource
    )
  }

  private readonly __getMergedChanges = (tradingAmount = 1): ResourceUpdateType<K, T>[] => {
    // toNegative() is just done so that a loss of 10 can be passed while being processed as -10
    const giveApproach = mergeWithState<K, T>(toNegative(this.__give), this.__state, tradingAmount);
    const gainApproach = mergeWithState<K, T>(this.__gain, this.__state, tradingAmount);
    return giveApproach.concat(gainApproach)
  }

  private readonly __getPossibleTradingAmount = () => {
    const changes = this.__getMergedChanges(this.tradingAmount);
    const lowest = getLowestFactor<K>(getLimitingResources(changes));
    return Math.floor(lowest * this.tradingAmount)
  }
}

const createChanges = <K extends string, T extends string>(
  mergedApproaches: ResourceUpdateType<K, T>[],
): ResourceState<K, T>[] => {
  return mergedApproaches.map((resource) =>
    new ResourceBase(resource)
      .updateBy({value: resource.valueChangeApproach})
  );
}

type LimitingResource<K extends string> = { key: K, factor: number }

const getLimitingResources = <K extends string, T extends string>(
  mergedApproaches: ResourceUpdateType<K, T>[],
): LimitingResource<K>[] => {
  const limiting = getFactors<K, T>(mergedApproaches)
    .filter(([, factor]) => factor < 1)
  if (mergedApproaches.find(({key}) => key === 'windmill')) {
    console.log(mergedApproaches, limiting)
  }
  return limiting.map(([key, value]) => ({key, factor: value}));
}


const getLowestFactor = <K extends string>(limitingResources: LimitingResource<K>[]) =>
  limitingResources.length
    ? calcLowestFactor(limitingResources)
    : 1

const calcLowestFactor = <K extends string>(limitingResources: LimitingResource<K>[]): number => {
  return limitingResources
    .map(({factor}) => factor)
    .sort((a, b) => a - b)[0]
}

const getFactors = <K extends string, T extends string>(approach: ResourceUpdateType<K, T>[]) => {
  return approach.reduce((limiters, curr) => {
    const update = {
      min: curr.minChangeApproach,
      max: curr.maxChangeApproach,
      value: curr.valueChangeApproach,
    }
    const {key, factor} = new ResourceBase(curr).delta(update);
    limiters.push([key, factor])
    return limiters;
  }, [] as [K, number][])
}

const mergeWithState = <K extends string, T extends string>(
  change: ResourceUpdateProps<K, T>[],
  state: ResourceState<K, T>[],
  tradingAmount: number,
): ResourceUpdateType<K, T>[] => {
  return change.map(s => {
    const current = state.find(({key}) => s.key === key) as ResourceState<K, T>;
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
const toNegative = <K extends string, T extends string>(give: ResourceUpdateProps<K, T>[]): ResourceUpdateProps<K, T>[] => give
  .map(({key, min, max, value}) => ({
    key,
    min: forceNegative(min),
    max: forceNegative(max),
    value: forceNegative(value),
  }))

type ResourceUpdateType<K, T> = {
  valueChangeApproach: number;
  minChangeApproach: number;
  maxChangeApproach: number;
} & ResourceUpdateProps<K, T>;
