import {ResourceBase} from "./ResourceBase.ts";
import {ResourceCostUpdate, ResourceUpdateProps, TradeChange} from "./genericTypes.ts";
import icons from "./assets/icons/icons.ts";

export class Resource<K extends string, T extends string> extends ResourceBase<K, T> {
  constructor(raw_resource: ResourceUpdateProps<K, T>) {
    super(raw_resource);
  }

  public readonly createTrade = (change: TradeChange<K>): ResourceCostUpdate<K> => {
    return {
      give: [change],
      gain: [{key: this.key, value: 1}]
    }
  }

  public readonly addCost = addTrade(this.cost);
  public readonly addRevealedAt = addTrade(this.revealedAt);
  public readonly removeCost = removeTrade(this.cost);
  public readonly removeRevealedAt = removeTrade(this.revealedAt);
  public readonly updateCost = mergeCostUpdate(this.cost);
  public readonly updateRevealedAt = mergeCostUpdate(this.revealedAt);

  get icon(): string {
    return icons.find(icon => icon.name === this.iconName)?.src || ''
  }
}

const addTrade = <K>(tradeOriginalState: ResourceCostUpdate<K> | null) => (
  changeKey: 'give' | 'gain' | '',
  change: TradeChange<K>,
  trade = tradeOriginalState
): ResourceCostUpdate<K> | null => {
  if (!trade || !changeKey.length) {
    return null
  }
  return {
    ...trade,
    [changeKey]: trade[changeKey as 'give' | 'gain']
      .concat(change)
  } as ResourceCostUpdate<K>
}

const mergeCostUpdate = <K>(tradeOriginalState: ResourceCostUpdate<K> | null) => (
  changeType: 'give' | 'gain',
  change: TradeChange<K>,
  cost = tradeOriginalState
): ResourceCostUpdate<K> | null => {
  if (!cost) {
    return null
  }
  const i = cost[changeType].map(({key}) => key).indexOf(change.key)
  return {
    ...cost,
    [changeType]: [
      ...cost[changeType].slice(0, i),
      change,
      ...cost[changeType].slice(i + 1),
    ]
  }
}

const removeTrade = <K>(tradeOriginalState: ResourceCostUpdate<K> | null) => (
  changeKey: 'give' | 'gain' | '',
  resourceKey: K,
  trade = tradeOriginalState
) => {
  if (changeKey === '' || !trade) {
    return null
  }
  const index = trade[changeKey].findIndex(({key}) => key === resourceKey)
  if (index === -1) {
    return trade
  }
  return {
    ...trade,
    [changeKey]: [
      ...trade[changeKey].slice(0, index),
      ...trade[changeKey].slice(index + 1),
    ]
  }
}
