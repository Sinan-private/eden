import {ResourceState, ResourceUpdateProps} from "../../Resource";
import {TradeLimitingResource, TradeResourceUpdateType} from "./ResourceBase/genericTypes.ts";
import {
  createChanges,
  getLimitingResources,
  getLowestFactor,
  mergeWithState,
  toNegative
} from "./ResourceBase/helpers/trade.ts";


export class Trade<K extends string, T extends string> {
  public readonly limitingResources: TradeLimitingResource<K>[];
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
  private readonly __getMergedChanges = (tradingAmount = 1): TradeResourceUpdateType<K, T>[] => {
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
