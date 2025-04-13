import {ResourceClass, ResourceKeys, ResourceStoreClass, ResourceTypes} from "@/Resource";
import {makeAutoObservable} from "mobx";
import {AdminUserResource} from "@/Resource/Admin2/AdminUserResource.ts";
import {ResourceCloneProps} from "@/Resource/ResourceHandler/genericTypes.ts";
import {Resource} from "@/Resource/ResourceHandler";

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
  private editing: ResourceClass | null = null;
  public keyIsPristine: boolean = true;
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
    this.editing = new Resource(_raw_resource)
  }
  public editResource = (id: string) => {
    this.editing = this.cloneResourceStore.get(id).clone();
    this.keyIsPristine = false;
  }

  // public getEditableResource = () => this.cloneResourceStore.get(this.editing)

  public getEditableForInput = () => {
    if (!this.editing) {
      throw new Error(`${this.editing} is empty`)
    }
    const resource = this.editing
    return new AdminUserResource(resource, this.keyIsPristine)
  }

  public resetEditableResource = () => {
    // this.cloneResourceStore.removeResource(this.editing.id)
    this.editing = null;
    this.keyIsPristine = true;
  }

}