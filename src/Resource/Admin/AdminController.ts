import {ResourceClass, ResourceKeys, ResourceState, ResourceStoreClass, ResourceTypes} from "@/Resource";
import {makeAutoObservable} from "mobx";
import {AdminResourceController} from "@/Resource/Admin/AdminResourceController.ts";
import {ResourceCloneProps} from "@/Resource/ResourceHandler/genericTypes.ts";
import {Resource} from "@/Resource/ResourceHandler";

export class AdminController {
  private static instance: AdminController;
  public cloneResourceStore: ResourceStoreClass;
  public editing: ResourceClass | null = null;
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
    const original = this.cloneResourceStore.get(this.editing!.reference_id)
    const dependencyUpdates = this.cloneResourceStore.replaceTradeKeys(original.key, this.editing!.key)
    original.setTo(this.editing!.state);
    dependencyUpdates.forEach((update) =>
      this.cloneResourceStore.get(update.id).setTo(update)
    )
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
