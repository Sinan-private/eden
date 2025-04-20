import {makeAutoObservable} from 'mobx'
import {Resource, ResourceState, ResourceUpdateProps} from "./index.ts";
import {ResourceTrade, Trade} from "./Trade.ts";
import {LevelUpdate, ResourceCostUpdate, ResourceTypeRaw, TradeChange} from "./genericTypes.ts";
import {id} from "@/Resource/helpers/id.ts";
import {unique} from "@/Resource/helpers/array.ts";

export class ResourceStore<K extends string, T extends string> {
  public id: string = id();
  public resources: Map<string, Resource<K, T>>;

  constructor(initialResources: ResourceUpdateProps<K, T>[], public caller = 'original') {
    this.resources = this.initializeResources(initialResources);
    makeAutoObservable(this);
  }

  public clone = (caller = 'clone') =>
    new ResourceStore(this.allResources.map(resource => resource.clone()), caller)

  public get = (id: string) => {
    return this.resources.get(id)!
  };

  public getByKey = (key: K) => {
    return Array.from(this.resources.values())
      .find(resource => resource.key === key)!;
  };

  public percentageOf = (value: number, max: number) => {
    const percentage = value / (max || 1) * 100
    return percentage <= 100
      ? percentage
      : 100;
  }

  public initializeResources(resources: ResourceUpdateProps<K, T>[]) {
    const fullResources: [string, Resource<K, T>][] = resources.map((resource) => {
      const full = new Resource(resource);
      return [full.id, full]
      // this.resources.set(initialResource.id, initialResource);
    });
    return new Map(fullResources)
  }


  public addResource = (resource: ResourceUpdateProps<K, T>) => {
    const _resource = new Resource(resource);
    this.resources.set(_resource.id, _resource);
    return _resource;
  }

  public removeResource = (id: string) => {
    const key = this.get(id).key
    if (!this.isResourceReferenced(key)) {
      this.resources.delete(id);
    }
  }

  public updateResources = (updates: (ResourceUpdateProps<K, T> & {id: string})[]) => {
    updates.forEach((update) => {
      const change = this.get(update.id)
      change.setTo(update as Partial<ResourceTypeRaw<K, T>>);
    })
  }

  public resourceReferences = (key: K) => resourceReferences(key, this.allResources)

  public isResourceReferenced = (key: K): boolean => {
    return !!this.resourceReferences(key).length
  };

  public replaceTradeKeys = (key: K, newKey: string): (ResourceState<K, T> & {id: string})[] => {
    if (key === newKey) {
      return []
    }
    const toUpdate = this.resourceReferences(key);
    return toUpdate.map(k => {
      const resource = this.getByKey(k);
      return this.__replaceTradeKey(resource, key, newKey);
    });
  }

  private __replaceTradeKey = (resource: Resource<K, T>, key: K, newKey: string): Resource<K, T>['state'] & {id: string} => {
    const replace = (toChange: TradeChange<K, T>[]): TradeChange<K, T>[] =>
      toChange.map(change => change.key === key
          ? {...change, key: newKey as K}
          : {...change}
      )
    return {
      id: resource.id,
      ...resource.state,
      cost: {
        give: replace(resource.cost!.give),
        gain: replace(resource.cost!.gain),
      }
    }
  }

  public getByType = (type?: T): Resource<K, T>[] => {
    if (!type?.length) {
      return this.allResources
    }
    return this.allResources
      .filter(resource => resource.type === type)
  }

  public getTypes = (): T[] => {
    return this.allResources.map(({type}) => type)
      .filter(unique)
      .filter(type => !!type.length)
  }

  public getResourcesByType = () => {
    return this.getTypes().map(type => ({
      type,
      resources: this.getByType(type),
    }))
  }

  public groupByType = () => {
    return groupedByType(this.allResources).map(resourceGroup => ({
      type: resourceGroup[0].type,
      resources: resourceGroup
    }));
  }

  public produce = (key: K, amount?: number) => {
    if (!amount) {
      return
    }
    const resource = this.getByKey(key)!;
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

  // Todo For a long time this needed to be reworked
  //  internally I want to be able to use this with missing value props. This will just be 0 then
  //  From an outside the value should be enforced
  //  But most importantly the stupid trade().tradeIfPossible() should be replaced by simple trade()
  //  In addition there can be some kind of check that is available to evaluate the trade
  public trade = (
    give: ResourceCostUpdate<K, T>['give'],
    gain: ResourceCostUpdate<K, T>['gain'],
    amount = 1
  ) => {
    const _give: ResourceTrade<K, T>[] = give.map(({key, ...update}) => ({
      resource: this.getByKey(key)!,
      ...update
    }))
    const _gain: ResourceTrade<K, T>[] = gain.map(({key, ...update}) => ({
      resource: this.getByKey(key)!,
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
      this.trade(this._levelToTradeConversion(give), this._levelToTradeConversion(gain)).enforceTrade()
    }
  }

  public hasEnough = (to_check?: LevelUpdate<K, T>['gain']) => {
    if (!to_check) {
      return true
    }
    return this.trade(this._levelToTradeConversion(to_check), []).getMaxPossibleAmount() >= 1
  }

  public getTypeSum = (type: T) => {
    const resources = this.getByType(type)
    return resources.reduce((sum, {value}) => (sum + value), 0)
  }

  public getTypeSessionSum = (type: T) => {
    const resources = this.getByType(type)
    return resources.reduce((sum, {sessionEarned}) => (sum + sessionEarned), 0)
  }

  private _levelToTradeConversion = (to_check: LevelUpdate<K, T>['gain']): TradeChange<K, T>[] =>
    to_check!.map(({value = 0, ...check}) => ({
      value,
      ...check
    } as TradeChange<K, T>))

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

const resourceReferences = <K extends string, T extends string>(
  key: K,
  allResources: Resource<K, T>[]
): K[] => {
  const dependencyKeys: (keyof Resource<K, T>)[] = ["cost", "revealedAt"];

  return allResources
    .filter(resource => {
      if (resource.key === key) return false; // Exclude self-reference

      return dependencyKeys.some(depKey => {
        const dependency = resource[depKey] as ResourceCostUpdate<K, T> | null;
        if (!dependency) return false;

        const isReferencedInGive = dependency.give.some(item => item.key === key);
        const isReferencedInGain = dependency.gain.some(item => item.key === key);

        return isReferencedInGive || isReferencedInGain;
      });
    })
    .map(resource => resource.key);
}
