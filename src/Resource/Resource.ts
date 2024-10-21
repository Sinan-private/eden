import {ResourceBase} from "./ResourceBase.ts";
import {ResourceCostUpdate, ResourceUpdateProps, TradeChange} from "./types.ts";
import icons from "../assets/icons/icons.ts";

export class Resource<K extends string, T extends string> extends ResourceBase<K, T> {
  constructor(raw_resource: ResourceUpdateProps<K, T>) {
    super(raw_resource);
  }

  public readonly addCost = (
    changeKey: 'give' | 'gain' | '',
    change: TradeChange<K>
  ) => {
    if (!this.cost || !changeKey.length) {
      return
    }
    return {
      ...this.cost,
      [changeKey]: this.cost[changeKey as 'give']
        .concat(new Resource({...this.state, ...change}))
    }
  }

  public readonly removeCost = (
    changeKey: 'give' | 'gain' | '',
    resourceKey: K
  ) => {
    if (changeKey === '' || !this.cost) {
      return this.cost
    }
    const index = this.cost[changeKey].findIndex(({key}) => key === resourceKey)
    return {
      ...this.cost,
      [changeKey]: [
        ...this.cost[changeKey].slice(0, index),
        ...this.cost[changeKey].slice(index + 1),
      ]
    }
  }

  get icon(): string {
    return icons.find(icon => icon.name === this.iconName)?.src || ''
  }

  public readonly updateCost = (
    changeType: 'give' | 'gain',
    change: TradeChange<K>
  ) => mergeCostUpdate(changeType, change, this.cost)
}

const mergeCostUpdate = <K>(
  changeType: 'give' | 'gain',
  change: TradeChange<K>,
  cost: ResourceCostUpdate<K> | null
): ResourceCostUpdate<K> | null => {
  if (!cost) {
    return null
  }
  console.log(change)
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