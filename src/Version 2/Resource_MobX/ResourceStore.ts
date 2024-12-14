import { makeAutoObservable } from 'mobx'
import {ResourceBase, ResourceUpdateProps} from "./ResourceBase";

export class ResourceStore<K extends string, T extends string> {
  public resources: Map<K, ResourceBase<K, T>> = new Map();
  constructor(initialResources?: ResourceUpdateProps<K, T>[]) {
    if (initialResources) {
      this.initializeResources(initialResources);
    }
    makeAutoObservable(this);
  }

  // public getByType = (type?: T | '') => type && type.length
  //   ? [...this.resources].filter(([,resource]) => type === resource.type)
  //   : [...this.resources];

  public get = (key: K) => {
    return this.resources.get(key)
  };

  public initializeResources(resources: ResourceUpdateProps<K, T>[]) {
    resources.forEach((resource) => {
      this.resources.set(resource.key, new ResourceBase(resource));
    });
  }

  public addResource = (resource: ResourceUpdateProps<K, T>) => {
    this.resources.set(resource.key, new ResourceBase(resource));
  }

  // The nice thing now is that I can store all methods directly in the ResourceBase. Like the evaluation for trade. How often are you able to perform the given trade?

  // public updateResource(key: K, updates: ResourceUpdateProps<K, T>) {
  //   const resource = this.resources.get(key);
  //   if (resource) {
  //     //  Todo here the actual update logic should live
  //     Object.assign(resource, updates);
  //   }
  // }

  public removeResource = (key: K)=> {
    this.resources.delete(key);
  }

  public getByType = (type: T): ResourceBase<K, T>[] => {
    return this.allResources
      .filter(resource => resource.type === type)
  }

  public groupByType = (): ResourceBase<K, T>[][] => {
    return groupedByType(this.allResources);
  }

  get allResources() {
    return Array.from(this.resources.values());
  }

}

const groupedByType = <K extends string, T extends string>(resources: ResourceBase<K, T>[]): ResourceBase<K, T>[][] => Object.values(
  resources.reduce((acc, item) => {
    // Initialize the group if it doesn't exist
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    // Add the current item to the group
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, ResourceBase<K, T>[]>)
);
