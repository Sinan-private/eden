import { makeAutoObservable } from 'mobx'
import {ResourceBase, ResourceUpdateProps} from "./ResourceBase";

export class ResourceStore<K extends string, T extends string> {
  public resources: Map<K, ResourceBase<K, T>> = new Map();
  constructor(initialResources?: ResourceUpdateProps<K, T>[]) {
    makeAutoObservable(this);
    if (initialResources) {
      this.initializeResources(initialResources);
    }
  }

  public get(key: K) {
    return this.resources.get(key)
  };

  public initializeResources(resources: ResourceUpdateProps<K, T>[]) {
    resources.forEach((resource) => {
      this.resources.set(resource.key, new ResourceBase(resource));
    });
  }

  public addResource(resource: ResourceUpdateProps<K, T>) {
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

  public removeResource(key: K) {
    this.resources.delete(key);
  }

  get allResources() {
    return Array.from(this.resources.values());
  }
}
