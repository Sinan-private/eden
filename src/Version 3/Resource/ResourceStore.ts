import {makeAutoObservable} from 'mobx'
import {Resource, ResourceUpdateProps} from "./Single";
import {Trade} from "./Trade.ts";

export class ResourceStore<K extends string, T extends string> {
  public resources: Map<K, Resource<K, T>> = new Map();
  constructor(initialResources: ResourceUpdateProps<K, T>[]) {
    this.initializeResources(initialResources);
    makeAutoObservable(this);
    // console.log(this.resources, initialResources)
  }

  public get = (key: K) => {
    return this.resources.get(key)
  };

  public initializeResources(resources: ResourceUpdateProps<K, T>[]) {
    resources.forEach((resource) => {
      this.resources.set(resource.key, new Resource(resource));
    });
  }

  public addResource = (resource: ResourceUpdateProps<K, T>) => {
    this.resources.set(resource.key, new Resource(resource));
  }

  public removeResource = (key: K)=> {
    this.resources.delete(key);
  }

  public getByType = (type: T): Resource<K, T>[] => {
    return this.allResources
      .filter(resource => resource.type === type)
  }

  public groupByType = (): Resource<K, T>[][] => {
    return groupedByType(this.allResources);
  }

  public produce = (key: K, amount = 1) => {
    const resource = this.get(key)!;
    const cost = resource.cost;
    if (!cost) {
      return null;
    }
    const trade = new Trade(cost.give, cost.gain, this.allResources, amount)
    trade.stateUpdates.forEach(({key, value}) => {
      this.get(key)!.setValueTo(value)
    })
  }

  public trade = (
    give: ResourceUpdateProps<K, T>[],
    gain: ResourceUpdateProps<K, T>[],
    amount = 1
  ) => new Trade(give, gain, this.allResources, amount)

  get allResources() {
    return Array.from(this.resources.values());
  }

}

const groupedByType = <K extends string, T extends string>(resources: Resource<K, T>[]): Resource<K, T>[][] => Object.values(
  resources.reduce((acc, item) => {
    // Initialize the group if it doesn't exist
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    // Add the current item to the group
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, Resource<K, T>[]>)
);
