import {makeAutoObservable} from 'mobx'
import {Resource, ResourceState, ResourceUpdateProps} from "./index.ts";
import {ResourceTrade, Trade} from "./Trade.ts";
import {LevelUpdate, ResourceCostUpdate, TradeChange} from "./genericTypes.ts";
import {id} from "@/GameEngine/ResourceEngine/helpers/id.ts";
import {resourceTypes} from "@/GameEngine/ResourceEngine/generated/resourceTypes.ts";
import {resourceReferences} from "@/GameEngine/ResourceEngine/ResourceHandler/helpers/resourceReferences.ts";

export class ResourceEngine<K extends string, T extends string> {
  public id: string = id();
  public resources: Map<string, Resource<K, T>>;

  constructor(initialResources: ResourceUpdateProps<K, T>[], public caller = 'original') {
    this.resources = this._initializeResources(initialResources);
    makeAutoObservable(this);
  }

  public get = (id: string) => {
    return this.resources.get(id)!
  };

  public getByKey = (key: K) => {
    const {id} = this.allResources
      .find(resource => resource.key === key)!
    return this.get(id)
  };

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

  // public updateResources = (updates: (ResourceUpdateProps<K, T> & {id: string})[]) => {
  //   updates.forEach((update) => {
  //     const change = this.get(update.id)
  //     change.setTo(update as Partial<ResourceTypeRaw<K, T>>);
  //   })
  // }

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

  // Don't really like that
  public getTypes = (): T[] => {
    return resourceTypes as unknown as T[]
  }

  public getResourcesByType = () => {
    return this.getTypes().map(type => ({
      type,
      resources: this.getByType(type),
    }))
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
    const trade = this.getTradeChange(cost.give, cost.gain, amount)
    const canTrade = trade.isTradePossible() && trade.getMaxPossibleAmount() >= amount
    if (canTrade) {
      trade.executeTrade()
    }
  }

  public clone = (caller = 'clone') =>
    new ResourceEngine(this.allResources.map(resource => resource.clone()), caller)

  public getTradeChange = (
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

  public trade = (
    give: ResourceCostUpdate<K, T>['give'],
    gain: ResourceCostUpdate<K, T>['gain'],
    amount = 1
  ) =>
    this.getTradeChange(give, gain, amount).tradeIfPossible()

  public levelUp = (level: LevelUpdate<K, T>) => {
    const canLevelUp = this.hasEnough(level.give) && this.hasEnough(level.need)
    if (canLevelUp) {
      const {
        give = [],
        gain = [],
      } = level
      this.getTradeChange(this._levelToTradeConversion(give), this._levelToTradeConversion(gain)).enforceTrade()
    }
  }

  public hasEnough = (to_check?: LevelUpdate<K, T>['gain']) => {
    if (!to_check) {
      return true
    }
    return this.getTradeChange(this._levelToTradeConversion(to_check), []).getMaxPossibleAmount() >= 1
  }

  public getTypeSum = (type: T) => {
    const resources = this.getByType(type)
    return resources.reduce((sum, {value}) => (sum + value), 0)
  }

  public getTypeSessionSum = (type: T) => {
    const resources = this.getByType(type)
    return resources.reduce((sum, {sessionEarned}) => (sum + sessionEarned), 0)
  }

  public getCost = (
    cost?: ResourceCostUpdate<K, T> | null,
  ) => {
    if (!cost) {
      return null
    }
    const normalize = (entries?: typeof cost.give) =>
      entries?.map(({ key, value }) => {
        const res = this.getByKey(key)
        return {
          key,
          value,
          label: res.label,
          icon: res.icon,
        }
      }) ?? []

    return {
      give: normalize(cost.give),
      gain: normalize(cost.gain),
    }
  }

  private _initializeResources(resources: ResourceUpdateProps<K, T>[]) {
    const fullResources: [string, Resource<K, T>][] = resources.map((resource) => {
      const full = new Resource(resource);
      return [full.id, full]
    });
    return new Map(fullResources)
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

