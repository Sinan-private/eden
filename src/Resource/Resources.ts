import {ResourceState, ResourceTypeRaw, ResourceUpdateProps} from "./types.ts";
import {ResourceSingle} from "./ResourceSingle.ts";
import {Trade} from "./Trade.ts";
import {updateResourceState} from "./helpers/updateResourcesState.ts";
import {isTradeFormat, ResourceUpdate, ResourceUpdateList} from "./updateFormat.ts";

export class Resources<T extends string> {
  public readonly state: ResourceState<T>[];

  constructor(state: ResourceUpdateProps<T>[]) {
    this.state = state.map(singleState => new ResourceSingle(singleState).state);
  }

  public readonly get = (key: T, state = this.state): ResourceSingle<T> => new ResourceSingle(
    state.find(resource => resource.key === key) as ResourceState<T>
  );

  public readonly trade = (give: ResourceUpdateProps<T>[], gain: ResourceUpdateProps<T>[], multiplier = 1) =>
    new Trade<T>(give, gain, this.state, multiplier)

  public readonly update = (update: ResourceUpdateProps<T> | ResourceUpdateProps<T>[], state = this.state) => {
    if (Array.isArray(update)) {
      return this.__updateList(update, state)
    }
    return this.__updateSingle(update, state)
  }

  private readonly __updateSingle = (update: ResourceUpdateProps<T>, state = this.state) => {
    const index = this.state.findIndex(resource => resource.key === update.key);
    // console.log(this.__updateList([update]))
    return [
      ...state.slice(0, index),
      this.get(update.key).updateBy(update),
      ...state.slice(index + 1),
    ]
  }

  private readonly __updateList = (update: ResourceUpdateProps<T>[], state = this.state) => {
    const newState = updateResourceState(state, update);
    console.log('state', state)
    console.log('update', update)
    console.log('newState', newState)
    return newState
  }

  public readonly __stackedUpdates = (update: ResourceUpdateList<T>) => {
    // console.log(update)
    let newState = [...this.state];
    update.forEach(change => {
      // console.log(newState)
      const a = this.__singleChange(change, newState);
      newState = this.update(a, newState)
      // console.log(a, newState)
    })
    // console.log('newState', newState)
    return newState
  }

  private readonly __singleChange = (
    update: ResourceUpdate<T>,
    state: ResourceState<T>[],
  ): (ResourceState<T> | ResourceUpdateProps<T>)[] => {
    const change = this.__singleChangeCreation(update, state);
    if (isTradeFormat(update)) {
      return change as ResourceState<T>[]
    }
    return [change as ResourceState<T>]
  }

  private readonly __singleChangeCreation = (
    {
      type,
      update
    }: ResourceUpdate<T>,
    state: ResourceState<T>[]
  ): ResourceState<T>[] | ResourceTypeRaw => {
    switch (type) {
      case "increment":
        return new ResourceSingle(this.get(update.key, state)).updateValueBy(update.value);
      case "decrement":
        return new ResourceSingle(this.get(update.key, state)).updateValueBy(-update.value);
      case "update":
        return new ResourceSingle(this.get(update.key, state)).updateBy(update);
      case "set":
        return new ResourceSingle(this.get(update.key, state)).setTo(update);
      case "trade":
        return this.trade(update.give, update.gain, update.multiplier).stateUpdates
      default:
        return []
    }
  }

  //
  // private readonly __updateListX = (update: ResourceUpdateProps<T>[]) => {
  //   return this.state.map(resource => {
  //     const _update = update.find((change) => resource.key === change.key);
  //     if (_update) {
  //       return {
  //         ...this.get(_update.key).state,
  //         ..._update
  //       }
  //     }
  //     return resource
  //   })
  // }

  // private readonly __setState = (key: T, callback: (key: T, index: number) => ResourceState<T>) => {
  //   const index = this.state.findIndex(resource => resource.key === key);
  //   return [
  //     ...this.state.slice(0, index),
  //     callback(key, index),
  //     ...this.state.slice(index + 1),
  //   ]
  // }
}
