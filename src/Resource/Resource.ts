import {ResourceBase} from "./ResourceBase.ts";
import {ResourceCostUpdate, ResourceUpdateProps, TradeChange} from "./types.ts";
import icons from "../assets/icons/icons.ts";

// It is a strange thing to have a Resource which receives the state. But for now this is my best approach to
// offer the cost in a nice way so that cost.icon can be called instead of passing functions

export class Resource<K extends string, T extends string> extends ResourceBase<K, T> {
  // public readonly cost: ResourceCost<K> | null
  constructor(raw_resource: ResourceUpdateProps<K, T>) {
    super(raw_resource);
    // this.cost = this.__getCost(raw_resource.cost || null)
    // this.cost = cost || null;
  }

  public readonly onAddCost = (
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