import {makeAutoObservable} from 'mobx'
import {Resource, ResourceUpdateProps} from "./Single";
import {ResourceTrade, Trade} from "./Trade.ts";
import {ResourceCostUpdate} from "./Single/genericTypes.ts";

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

  public produce = (key: K, amount?: number) => {
    const resource = this.get(key)!;
    const cost = resource.cost;
    if (!cost) {
      return null;
    }
    const trade = this.trade(cost.give, cost.gain, amount)
    if (trade.isTradePossible()) {
      trade.executeTrade()
    }
  }

  public trade = (
    give: ResourceCostUpdate<K>['give'],
    gain: ResourceCostUpdate<K>['gain'],
    amount = 1
  ) => {
    const _give: ResourceTrade<K, T>[] = give.map(({key, value}) => ({
      resource: this.get(key)!,
      amount: value,
    }))
    const _gain: ResourceTrade<K, T>[] = gain.map(({key, value}) => ({
      resource: this.get(key)!,
      amount: value,
    }))
    return new Trade(_give, _gain, amount)
  }

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
