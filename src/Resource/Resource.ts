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

  public readonly addCost = (
    changeKey: 'give' | 'gain' | '',
    change: TradeChange<K>,
    cost = this.cost,
  ) => addTrade(changeKey, change, cost)

  public readonly addRevealedAt = (
    changeKey: 'give' | 'gain' | '',
    change: TradeChange<K>,
    revealedAt = this.revealedAt,
  ) => addTrade(changeKey, change, revealedAt)

  public readonly removeCost = (
    changeKey: 'give' | 'gain' | '',
    resourceKey: K,
    cost = this.cost,
  ) => removeTrade(changeKey, resourceKey, cost)

  public readonly removeRevealedAt = (
    changeKey: 'give' | 'gain' | '',
    resourceKey: K,
    revealedAt = this.revealedAt,
  ) => removeTrade(changeKey, resourceKey, revealedAt)

  public readonly updateCost = (
    changeType: 'give' | 'gain',
    change: TradeChange<K>,
    cost = this.cost,
  ) => mergeCostUpdate(changeType, change, cost)

  public readonly updateRevealedAt = (
    changeType: 'give' | 'gain',
    change: TradeChange<K>,
    revealedAt = this.revealedAt
  ) => mergeCostUpdate(changeType, change, revealedAt)

  get icon(): string {
    return icons.find(icon => icon.name === this.iconName)?.src || ''
  }
}

const addTrade = <K>(
  changeKey: 'give' | 'gain' | '',
  change: TradeChange<K>,
  trade?: ResourceCostUpdate<K> | null,
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

const mergeCostUpdate = <K>(
  changeType: 'give' | 'gain',
  change: TradeChange<K>,
  cost: ResourceCostUpdate<K> | null
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

const removeTrade = <K>(
  changeKey: 'give' | 'gain' | '',
  resourceKey: K,
  trade?: ResourceCostUpdate<K> | null,
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
