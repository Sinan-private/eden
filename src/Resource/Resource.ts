import {ResourceBase} from "./ResourceBase.ts";
import {ResourceCostUpdate, ResourceUpdateProps, TradeChange} from "./types.ts";
import icons from "../assets/icons/icons.ts";

export class Resource<K extends string, T extends string> extends ResourceBase<K, T> {
  constructor(raw_resource: ResourceUpdateProps<K, T>) {
    super(raw_resource);
  }

  public readonly addCost = (
    changeKey: 'give' | 'gain' | '',
    change: TradeChange<K>,
    cost = this.cost,
  ): ResourceCostUpdate<K> | null => {
    console.log(changeKey, cost);
    if (!cost || !changeKey.length) {
      return cost
    }
    const addedCost = {
      key: change.key,
      value: new Resource({...this.state, ...change}).value
    }
    return {
      ...this.cost,
      [changeKey]: cost[changeKey as 'give' | 'gain']
        .concat(addedCost)
    } as ResourceCostUpdate<K>
  }

  public readonly createCost = (change: TradeChange<K>): ResourceCostUpdate<K> => {
    return {
      give: [change],
      gain: [{key: this.key, value: 1}]
    }
  }

  public readonly removeCost = (
    changeKey: 'give' | 'gain' | '',
    resourceKey: K,
    cost = this.cost,
  ) => {
    if (changeKey === '' || !cost) {
      return cost
    }
    const index = cost[changeKey].findIndex(({key}) => key === resourceKey)
    if (index === -1) {
      return cost
    }
    return {
      ...cost,
      [changeKey]: [
        ...cost[changeKey].slice(0, index),
        ...cost[changeKey].slice(index + 1),
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