import {ResourceClass, ResourceKeys, ResourceState, ResourceStoreClass, ResourceTypes} from "@/Resource";
import {makeAutoObservable} from "mobx";
import {AdminResourceController} from "@/Resource/Admin/AdminResourceController.ts";
import {ResourceCloneProps} from "@/Resource/ResourceHandler/genericTypes.ts";
import {Resource} from "@/Resource/ResourceHandler";
import {areObjectsEqual} from "@/Resource/context/admin/equalityChecks.ts";
import {DEBUG} from "@/test_eden/constants/constants.ts";

declare global {
  interface Window {
    __adminController?: AdminController;
  }
}

export class AdminController {
  private static instance: AdminController;
  public cloneResourceStore: ResourceStoreClass;
  public editing: ResourceClass | null = null;
  public isExistingResource: boolean = false;
  public showAdminPanel: boolean = false;
  public showResourceEdit: boolean = false;
  public showDebugPanel: boolean = DEBUG;
  public showDebugPanelBeautifiedValues: boolean = false;

  constructor(
    originalResourceStore: ResourceStoreClass
  ) {
    this.cloneResourceStore = originalResourceStore.clone('admin');
    makeAutoObservable(this)
  }

  get availableCostKeys () {
    const resourceKeys = this.cloneResourceStore.allResources.map(({key, label}) => ({key, label}))
    const costs = this.editing?.cost?.give.concat(this.editing?.cost?.gain) || []
    const keysInUse = costs.map(({key}) => key)
    return resourceKeys.filter(({key}) => !keysInUse.includes(key))
  }

  // Ensure singleton
  public static getInstance(originalResourceStore?: ResourceStoreClass): AdminController {
    if (typeof window !== "undefined") {
      if (!window.__adminController) {
        if (!originalResourceStore) throw new Error("First call must provide resourceStore");
        window.__adminController = new AdminController(originalResourceStore);
      }
      return window.__adminController;
    }
    // fallback (non-browser, SSR, etc.)
    if (!AdminController.instance) {
      if (!originalResourceStore) throw new Error("First call must provide resourceStore");
      AdminController.instance = new AdminController(originalResourceStore);
    }
    return AdminController.instance;
  }

  public saveDisabled = () => {
    if (!this.editing) {
      return true
    }
    if (this.isExistingResource) {
      return areObjectsEqual(this._getOriginal()!.state, this.editing.state) || this.keyAlreadyExists(this.editing.key);
    }
  }
  public onCloseAdminPanel = () => this.showAdminPanel = false;
  public onToggleAdminPanel = () => this.showAdminPanel = !this.showAdminPanel;
  public onToggleDebugPanel = () => {this.showDebugPanel = !this.showDebugPanel};
  public onToggleDebugPanelBeautifiedValues = () => {this.showDebugPanelBeautifiedValues = !this.showDebugPanelBeautifiedValues};

  public cloneResource = (id: string) => {
    this.editing = new Resource(this.cloneResourceStore.get(id).state);
    this.isExistingResource = false;
    this.showResourceEdit = true;
  }

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

  public getResourceForInput = () => {
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

  private _getOriginal = () => this.editing
    ? this.cloneResourceStore.get(this.editing.reference_id)
    : undefined

  public resourceReferences = (key: ResourceKeys) => this.cloneResourceStore?.resourceReferences(key)

  public removeResource = (id: string) => {
    this.cloneResourceStore.removeResource(id)
    this._updateResources(this.cloneResourceStore.state)
  }

  public onSave = () => {
    if (this.isExistingResource) {
      const original = this._getOriginal()!
      const dependencyUpdates = this.cloneResourceStore.replaceTradeKeys(original.key, this.editing!.key)
      original.setTo(this.editing!.state);
      dependencyUpdates.forEach((update) =>
        this.cloneResourceStore.get(update.id).setTo(update)
      )
    } else {
      this.cloneResourceStore.addResource(this.editing!.state)
    }
    this._updateResources(this.cloneResourceStore.state)
  }

  private _updateResources = _updateResources
}

const _updateResources = async (newResources?: ResourceState[]) => {
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