import {ResourceBase} from "./ResourceBase.ts";
import {ResourceCost, ResourceState, ResourceUpdateProps} from "./types.ts";

// It is a strange thing to have a Resource which receives the state. But for now this is my best approach to
// offer the cost in a nice way so that cost.icon can be called instead of passing functions

export class Resource<K extends string, T extends string> extends ResourceBase<K, T> {
  public readonly cost: ResourceCost<K> | null
  constructor(raw_resource: ResourceUpdateProps<K, T>, state: ResourceState<K, T>[]) {
    super(raw_resource);
    const getCost = () => {
      if (!raw_resource.cost) {
        return null
      }
      const give = raw_resource.cost.give.map(give => {
        const _this = state.find(resource => resource.key === give.key);
        return new ResourceBase(_this!)
      })
      const gain = raw_resource.cost.gain.map(gain => {
        const _this = state.find(resource => resource.key === gain.key);
        return new ResourceBase(_this!)
      })
      return {give, gain}
    }

    this.cost = getCost()
    // this.cost = raw_resource.cost || null;
  }
}
