import {makeAutoObservable} from 'mobx'
import {Resource, ResourceUpdateProps} from "./index.ts";
import {ResourceTrade, Trade} from "./Trade.ts";
import {LevelUpdate, ResourceCostUpdate, TradeChange} from "./genericTypes.ts";

export class ResourceStore<K extends string, T extends string> {
  public resources: Map<K, Resource<K, T>> = new Map();
  // This is the one that gets edited when the user wants to add a new resource
  public newResource: Resource<K, T>;

  constructor(initialResources: ResourceUpdateProps<K, T>[], public caller: string) {
    this.initializeResources(initialResources);
    this.newResource = new Resource({key: '' as K})
    makeAutoObservable(this);
  }

  public get = (key: K) => {
    return this.resources.get(key)!
  };

  public getById = (id: string): Resource<K, T> | undefined => {
    for (const resource of this.resources.values()) {
      if (resource.id === id) {
        return resource;
      }
    }
    return undefined; // Return undefined if no resource matches the id
  };

  public initializeResources(resources: ResourceUpdateProps<K, T>[]) {
    resources.forEach((resource) => {
      this.resources.set(resource.key, new Resource(resource));
    });
  }

  public addEditableResource = () => {
    console.log(this.resources)
    this.resources.set(this.newResource.key, this.newResource);
    console.log(this.resources)
    this.newResource = new Resource({key: '' as K})
  }

  public addResource = (resource: ResourceUpdateProps<K, T>) => {
    this.resources.set(resource.key, new Resource(resource));
  }

  public removeResource = (key: K) => {
    if (!this.isResourceReferenced(key)) {
      this.resources.delete(key);
    }
  }

  public isResourceReferenced = (key: K): boolean => {
    const dependencyKeys: (keyof Resource<K, T>)[] = ["cost", "revealedAt"]; // Everything with a structure like cost

    return this.allResources.some(resource => {
      if (resource.key === key) return false; // Exclude self-reference

      return dependencyKeys.some(depKey => {
        const dependency = resource[depKey] as ResourceCostUpdate<K, T> | null;
        if (!dependency) return false;

        const isReferencedInGive = dependency.give.some(item => item.key === key);
        const isReferencedInGain = dependency.gain.some(item => item.key === key);

        return isReferencedInGive || isReferencedInGain;
      });
    });
  };


  public getByType = (type?: T): Resource<K, T>[] => {
    if (!type?.length) {
      return this.allResources
    }
    return this.allResources
      .filter(resource => resource.type === type)
  }

  public groupByType = () => {
    return groupedByType(this.allResources).map(resourceGroup => ({type: resourceGroup[0].type, resources: resourceGroup}));
  }

  public produce = (key: K, amount?: number) => {
    if (!amount) {
      return
    }
    const resource = this.get(key)!;
    const cost = resource.cost;
    if (!cost) {
      resource.updateValueBy(amount || 0)
      return null;
    }
    const trade = this.trade(cost.give, cost.gain, amount)
    if (trade.isTradePossible()) {
      trade.executeTrade()
    }
  }

  public trade = (
    give: ResourceCostUpdate<K, T>['give'],
    gain: ResourceCostUpdate<K, T>['gain'],
    amount = 1
  ) => {
    const _give: ResourceTrade<K, T>[] = give.map(({key, ...update}) => ({
      resource: this.get(key)!,
      ...update
    }))
    const _gain: ResourceTrade<K, T>[] = gain.map(({key, ...update}) => ({
      resource: this.get(key)!,
      ...update,
    }))
    return new Trade(_give, _gain, amount)
  }

  public levelUp = (level: LevelUpdate<K, T>) => {
    const canLevelUp = this.hasEnough(level.give) && this.hasEnough(level.need)
    if (canLevelUp) {
      const {
        give = [],
        gain = [],
      } = level
      this.trade(give, gain).enforceTrade()
    }
  }

  public hasEnough = (to_check?: TradeChange<K, T>[]) => {
    return !to_check
      ? true
      : this.trade(to_check, []).isTradePossible()
  }

  public getTypeSum = (type: T) => {
    const resources = this.getByType(type)
    return  resources.reduce((sum, {value}) => (sum + value), 0)
  }

  get allResources() {
    return Array.from(this.resources.values());
  }

  get state() {
    return this.allResources.map(({state}) => state)
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
