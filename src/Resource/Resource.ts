import {ResourceBase} from "./ResourceBase.ts";
import {ResourceCost, ResourceCostUpdate, ResourceState, ResourceUpdateProps, TradeChange} from "./types.ts";
import icons from "../assets/icons/icons.ts";

// It is a strange thing to have a EditResource which receives the state. But for now this is my best approach to
// offer the cost in a nice way so that cost.icon can be called instead of passing functions

export class Resource<K extends string, T extends string> extends ResourceBase<K, T> {
  public readonly cost: ResourceCost<K> | null
  constructor(raw_resource: ResourceUpdateProps<K, T>, public readonly resourceStates: ResourceState<K, T>[]) {
    super(raw_resource);
    this.cost = this.__getCost(raw_resource.cost || null)
    // this.cost = cost || null;
  }

  get icon(): string {
    return icons.find(icon => icon.name === this.iconName)?.src || ''
  }
  public readonly updateCost = (
    changeType: 'give' | 'gain',
    change: TradeChange<K>
  ) => {
    if (!this.cost) {
      return null
    }
    const i = this.cost[changeType].map(({key}) => key).indexOf(change.key)
    const newCost = {
      ...this.cost,
      [changeType]: [
        ...this.cost[changeType].slice(0, i),
        change,
        ...this.cost[changeType].slice(i + 1),
      ]
    }
    console.log(newCost)
    return this.__getCost(newCost)
  }

  private readonly __getCost = (cost: ResourceCostUpdate<K> | null) => {
    if (!cost) {
      return null
    }
    // I guess I only want the icon from here. But too tired to think about this
    const give = cost.give.map(give => {
      const _this = this.resourceStates.find(resource => resource.key === give.key)!;
      return new ResourceBase({..._this, ...give})
    })
    const gain = cost.gain.map(gain => {
      const _this = this.resourceStates.find(resource => resource.key === gain.key)!;
      return new ResourceBase({..._this, ...gain})
    })
    return {give, gain}
  }
}
