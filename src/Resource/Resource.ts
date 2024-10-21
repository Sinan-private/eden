import {ResourceBase} from "./ResourceBase.ts";
import {ResourceCost, ResourceCostUpdate, ResourceState, ResourceUpdateProps, TradeChange} from "./types.ts";
import icons from "../assets/icons/icons.ts";

// It is a strange thing to have a Resource which receives the state. But for now this is my best approach to
// offer the cost in a nice way so that cost.icon can be called instead of passing functions

export class Resource<K extends string, T extends string> extends ResourceBase<K, T> {
  // public readonly cost: ResourceCost<K> | null
  constructor(raw_resource: ResourceUpdateProps<K, T>, public readonly resourceStates: ResourceState<K, T>[]) {
    super(raw_resource);
    // this.cost = this.__getCost(raw_resource.cost || null)
    // this.cost = cost || null;
  }

  get icon(): string {
    return icons.find(icon => icon.name === this.iconName)?.src || ''
  }
  get cost(): ResourceCost<K> | null {
    return this.__getCost(this.__cost)
  }

  public readonly updateCost = (
    changeType: 'give' | 'gain',
    change: TradeChange<K>
  ) => {
    if (!this.__cost) {
      return null
    }
    console.log(change)
    const i = this.__cost[changeType].map(({key}) => key).indexOf(change.key)
    const newCost = {
      ...this.__cost,
      [changeType]: [
        ...this.__cost[changeType].slice(0, i),
        change,
        ...this.__cost[changeType].slice(i + 1),
      ]
    }
    return newCost
  }

  private readonly __getCost = (cost: ResourceCostUpdate<K> | null): ResourceCost<K> | null => {
    if (!cost) {
      return null
    }
    // I guess I only want the icon from here. But too tired to think about this
    const give = cost.give.map(give => {
      const _this = this.resourceStates.find(resource => resource.key === give.key)!;
      return new Resource({..._this, ...give}, this.resourceStates)
    })
    const gain = cost.gain.map(gain => {
      const _this = this.resourceStates.find(resource => resource.key === gain.key)!;
      return new Resource({..._this, ...gain}, this.resourceStates)
    })
    return {give, gain}
  }
}
