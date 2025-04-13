import {ResourceClass, ResourceKeys, ResourceState, ResourceStoreClass, ResourceTypes} from "@/Resource";
import {makeAutoObservable} from "mobx";
import {AdminResourceController} from "@/Resource/Admin2/AdminResourceController.ts";
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


export class AdminController {
  private static instance: AdminController;
  public cloneResourceStore: ResourceStoreClass;
  private editing: ResourceClass | null = null;
  // public keyIsPristine: boolean = true;
  public isExistingResource: boolean = false;
  public showAdminPanel: boolean = false;
  public showResourceEdit: boolean = false;
  constructor(
    originalResourceStore: ResourceStoreClass
  ) {
    this.cloneResourceStore = originalResourceStore.clone();
    makeAutoObservable(this)
  }
  // Ensure singleton
  public static getInstance(originalResourceStore?: ResourceStoreClass): AdminController {
    if (!AdminController.instance) {
      if (!originalResourceStore) throw new Error("First call must provide config");
      AdminController.instance = new AdminController(originalResourceStore);
    }
    return AdminController.instance;
  }

  public onCloseAdminPanel = () => this.showAdminPanel = false;
  public onShowAdminPanel = () => this.showAdminPanel = true;
  public onToggleAdminPanel = () => this.showAdminPanel = !this.showAdminPanel;

  // When adding a new resource
  public createResource = (raw_resource?: ResourceCloneProps<ResourceKeys, ResourceTypes>) => {
    const _raw_resource = {
      key: '' as ResourceKeys,
      ...raw_resource,
    }
    this.showResourceEdit = true;
    this.isExistingResource = false;
    this.editing = new Resource(_raw_resource)
  }
  // When altering an existing resource
  public editResource = (id: string) => {
    this.editing = this.cloneResourceStore.get(id).clone();
    // this.keyIsPristine = false;
    this.isExistingResource = true;
    this.showResourceEdit = true;
  }

  public getEditableForInput = () => {
    if (!this.editing) {
      throw new Error(`${this.editing} is empty`)
    }
    const resource = this.editing
    return new AdminResourceController(resource, this.isExistingResource)
  }

  public resetEditableResource = () => {
    this.editing = null;
    this.isExistingResource = false;
    // this.keyIsPristine = true;
  }

  public keyAlreadyExists = (input: string): boolean => {
    const clean = this.cloneResourceStore.allResources
      .filter(({id}) => id !== this.editing?.reference_id)
      .map(({key}) => key)
    return clean.includes(input as ResourceKeys)
  }

  get canEdit() {
    return !!this.editing
  }

  public onSave = () => {
    this._updateResources(this.cloneResourceStore.state)
  }

  private _updateResources = async (newResources?: ResourceState[]) => {
    if (!newResources) return;
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResources),
      });
      const result = await response.json();

      console.log(result.message);  // Success message
    } catch (error) {
      console.error('Error updating resources:', error);
    }
  };
}
