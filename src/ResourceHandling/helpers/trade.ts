import {ResourceState, ResourceUpdateProps, TradeLimitingResource, TradeResourceUpdateType} from "../Resource/genericTypes.ts";
import {Resource} from "../Resource/Resource.ts";

export const createChanges = <K extends string, T extends string>(
  mergedApproaches: TradeResourceUpdateType<K, T>[],

  ): ResourceState<K, T>[] => {
  return mergedApproaches.map((resource) =>
    new Resource(resource)
      .updateBy({value: resource.valueChangeApproach})
  );
}


export const getLimitingResources = <K extends string, T extends string>(
  mergedApproaches: TradeResourceUpdateType<K, T>[],
): TradeLimitingResource<K>[] => {
  const limiting = getFactors<K, T>(mergedApproaches)
    .filter(([, factor]) => factor < 1)
  if (mergedApproaches.find(({key}) => key === 'windmill')) {
    console.log(mergedApproaches, limiting)
  }
  return limiting.map(([key, value]) => ({key, factor: value}));
}


export const getLowestFactor = <K extends string>(limitingResources: TradeLimitingResource<K>[]) =>
  limitingResources.length
    ? calcLowestFactor(limitingResources)
    : 1

const calcLowestFactor = <K extends string>(limitingResources: TradeLimitingResource<K>[]): number => {
  return limitingResources
    .map(({factor}) => factor)
    .sort((a, b) => a - b)[0]
}

const getFactors = <K extends string, T extends string>(approach: TradeResourceUpdateType<K, T>[]) => {
  return approach.reduce((limiters, curr) => {
    const update = {
      min: curr.minChangeApproach,
      max: curr.maxChangeApproach,
      value: curr.valueChangeApproach,
    }
    const {key, factor} = new Resource(curr).delta(update);
    limiters.push([key, factor])
    return limiters;
  }, [] as [K, number][])
}

export const mergeWithState = <K extends string, T extends string>(
  change: ResourceUpdateProps<K, T>[],
  state: ResourceState<K, T>[],
  tradingAmount: number,
): TradeResourceUpdateType<K, T>[] => {
  return change.map(s => {
    const current = state.find(({key}) => s.key === key) as ResourceState<K, T>;
    // const {min, max, value, key} = state.find(({key}) => s.key === key) as ResourceProps;
    const val = (x?: number | null) => (x || 0) * tradingAmount;
    return {
      ...current,
      valueChangeApproach: val(s.value),
      minChangeApproach: val(s.min),
      maxChangeApproach: val(s.max),
    }
  })
}
const forceNegative = (val: number | null = 0) => -Math.abs(Number(val))
export const toNegative = <K extends string, T extends string>(give: ResourceUpdateProps<K, T>[]): ResourceUpdateProps<K, T>[] => give
  .map(({key, min, max, value}) => ({
    key,
    min: forceNegative(min),
    max: forceNegative(max),
    value: forceNegative(value),
  }))

