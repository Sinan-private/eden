import {ResourceKeys, ResourceStoreClass} from "@/Resource";
import {makeAutoObservable} from "mobx";

// Todo: I need two clones in a way.
//  - I want to keep an original reference at least of the ids
//  - I want a cloned store that serves as the basis
//  - I want another clone to just go crazy with.
//  Use cases
//  - I want to edit a single resource and store the update -> (clone2 is edited, on save clone1 is overwritten and saved to file)
//  - I want to edit multiple resources at once (list view) -> (cloneStore2 stores the latest state, on save cloneStore1 is overwritten and saved to file
//  - I change a key -> (just use the reference id to find the resource to update)
//  I need a reference ID on the Resource. And an instance creator on the store and possibly the Resource itself

export class AdminUser {
  public cloneResourceStore: ResourceStoreClass;
  public editing: string = '';
  constructor(
    public readonly originalResourceStore: ResourceStoreClass
  ) {
    this.cloneResourceStore = originalResourceStore.clone();
    makeAutoObservable(this)
  }
  public createResource = () => {
    const newResource = this.cloneResourceStore.addResource({key: '' as ResourceKeys})
    this.editing = newResource.id
    return newResource
  }



}