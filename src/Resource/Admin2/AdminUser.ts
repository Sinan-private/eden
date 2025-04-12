import {ResourceKeys, ResourceStoreClass, ResourceTypes} from "@/Resource";
import {makeAutoObservable} from "mobx";
import {AdminUserResource} from "@/Resource/Admin2/AdminUserResource.ts";
import {ResourceCloneProps} from "@/Resource/ResourceHandler/genericTypes.ts";

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
  public createResource = (raw_resource?: ResourceCloneProps<ResourceKeys, ResourceTypes>) => {
    const _raw_resource = {
      key: '' as ResourceKeys,
      ...raw_resource,
    }
    const newResource = this.cloneResourceStore.addResource(_raw_resource)
    this.editing = newResource.id
  }
  public editResource = (id: string) => {
    // Actually when a resource is edited I should also just create a new one with a reference to the old

    const newResource = this.cloneResourceStore.addResource(this.cloneResourceStore.get(id).clone())
    this.editing = newResource.id

  }

  public getEditableResource = () => {
    if (!this.editing.length) {
      throw new Error(`${this.editing} is empty`)
    }
    const resource = this.cloneResourceStore.get(this.editing)
    if (!resource) {
      throw new Error(`${resource} is empty`)
    }
    return new AdminUserResource(resource)
  }

}