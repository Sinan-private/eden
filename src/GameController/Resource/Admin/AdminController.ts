import {makeAutoObservable} from "mobx";
import {areObjectsEqual} from "@/GameController/Resource/Admin/equalityChecks.ts";
import {updateResourceKeys, updateResources} from "@/GameController/Resource/server/api/apiService.ts";
import {ResourceClass, ResourceKeys, ResourceStoreClass, ResourceTypes} from "@/GameController/Resource";
import {AdminResourceController} from "@/GameController/Resource/Admin/AdminResourceController.ts";
import {ResourceCloneProps} from "@/GameController/Resource/ResourceHandler/genericTypes.ts";
import {Resource} from "@/GameController/Resource/ResourceHandler";

export type AdminControllerCreationProps = {
  show_debug_panel: boolean;
  show_debug_panel_beautified_values: boolean;
  show_context_menu: boolean;
  show_admin_panel: boolean;
}

declare global {
  interface Window {
    __adminController?: AdminController;
  }
}

export class AdminController {
  private static instance: AdminController;
  public cloneResourceStore: ResourceStoreClass;
  public editing: ResourceClass | null = null;
  public is_existing_resource: boolean = false;
  public show_admin_panel: boolean;
  public show_resource_edit: boolean = false;
  public show_debug_panel: boolean;
  public show_debug_panel_beautified_values: boolean;
  public show_context_menu: boolean;

  constructor(
    private originalResourceStore: ResourceStoreClass,
    public keys: ResourceKeys[],
    public types: ResourceTypes[],
    config?: AdminControllerCreationProps
  ) {
    this.cloneResourceStore = originalResourceStore.clone('admin');
    this.show_debug_panel = config?.show_debug_panel || false;
    this.show_debug_panel_beautified_values = config?.show_debug_panel_beautified_values || false
    this.show_context_menu = typeof config?.show_context_menu === "boolean" ? config.show_context_menu : true;
    this.show_admin_panel = typeof config?.show_admin_panel === "boolean" ? config.show_admin_panel : false;
    makeAutoObservable(this)
  }

  public addType = (type: string): void => {
    this.types.push(type as ResourceTypes);
  }

  public removeType = (type: string): void => {
    this.types = this.types.filter(_type => _type !== type);
  }

  get availableCostKeys() {
    const resourceKeys = this.cloneResourceStore.allResources.map(({key, label}) => ({key, label}))
    const costs = this.editing?.cost?.give.concat(this.editing?.cost?.gain) || []
    const keysInUse = costs.map(({key}) => key)
    return resourceKeys.filter(({key}) => !keysInUse.includes(key))
  }

  // Ensure singleton
  public static getInstance(
    originalResourceStore?: ResourceStoreClass,
    keys?: ResourceKeys[],
    types?: ResourceTypes[],
    config?: AdminControllerCreationProps
  ): AdminController {
    if (typeof window !== "undefined") {
      if (!window.__adminController) {
        if (!originalResourceStore) throw new Error("First call must provide resourceStore");
        window.__adminController = new AdminController(originalResourceStore, keys!, types!, config);
      }
      return window.__adminController;
    }
    // fallback (non-browser, SSR, etc.)
    if (!AdminController.instance) {
      if (!originalResourceStore) throw new Error("First call must provide resourceStore");
      AdminController.instance = new AdminController(originalResourceStore, keys!, types!, config);
    }
    return AdminController.instance;
  }

  public saveDisabled = () => {
    if (!this.editing) {
      return true
    }
    if (this.is_existing_resource) {
      return areObjectsEqual(this._editedResourceOrigin()!.state, this.editing.state) || this.keyAlreadyExists(this.editing.key);
    }
  }
  public onCloseAdminPanel = () => this.show_admin_panel = false;
  public onToggleAdminPanel = () => this.show_admin_panel = !this.show_admin_panel;
  public onToggleDebugPanel = () => {
    this.show_debug_panel = !this.show_debug_panel
  };
  public onToggleDebugPanelBeautifiedValues = () => {
    this.show_debug_panel_beautified_values = !this.show_debug_panel_beautified_values
  };
  public showContextMenu = () => this.show_context_menu = true
  public hideContextMenu = () => this.show_context_menu = false


  public cloneResource = (id: string) => {
    this.editing = new Resource(this.cloneResourceStore.get(id).state);
    this.is_existing_resource = false;
    this.show_resource_edit = true;
  }

  // When adding a new resource
  public createResource = (raw_resource?: ResourceCloneProps<ResourceKeys, ResourceTypes>) => {
    const _raw_resource = {
      key: '' as ResourceKeys,
      ...raw_resource,
    }
    this.show_resource_edit = true;
    this.is_existing_resource = false;
    this.editing = new Resource(_raw_resource)
  }
  // When altering an existing resource
  public editResource = (id: string) => {
    this.editing = this.cloneResourceStore.get(id).clone();
    this.is_existing_resource = true;
    this.show_resource_edit = true;
  }

  public getResourceForInput = () => {
    if (!this.editing) {
      throw new Error(`${this.editing} is empty`)
    }
    const resource = this.editing
    return new AdminResourceController(resource, this.is_existing_resource)
  }

  public resetEditableResource = () => {
    this.editing = null;
    this.is_existing_resource = false;
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

  private _editedResourceOrigin = () => this.editing
    ? this.cloneResourceStore.get(this.editing.reference_id)
    : undefined

  public resourceReferences = (key: ResourceKeys) => this.cloneResourceStore?.resourceReferences(key)

  public removeResource = (id: string) => {
    this.cloneResourceStore.removeResource(id)
    this.__updateResources()
  }

  public onSave = () => {
    const edited_resource = this.editing!.state
    if (this.is_existing_resource) {
      this._updateDependencies()
      this._editedResourceOrigin()!.setTo(edited_resource);
    }
    if (!this.is_existing_resource) {
      this.cloneResourceStore.addResource(edited_resource)
    }
    this.__updateResources()
    this.resetEditableResource()
  }

  private _updateDependencies = () => {
    const original = this._editedResourceOrigin()!
    const dependencyUpdates = this.cloneResourceStore.replaceTradeKeys(original.key, this.editing!.key)
    dependencyUpdates.forEach((update) =>
      this.cloneResourceStore.get(update.id).setTo(update)
    )
  }

  private __updateResources = () => {
    const update = this.cloneResourceStore.state
    const originallyUsedKeys = this.originalResourceStore.allResources.map(({key}) => key)
    const currentlyUsedKeys = this.cloneResourceStore.allResources.map(({key}) => key)
    const keysNeedUpdate = findMismatches(originallyUsedKeys, currentlyUsedKeys).hasMismatches
    updateResources(update)
    if (keysNeedUpdate) {
      updateResourceKeys(update)
    }
  }
}

function findMismatches(a: string[], b: string[]) {
  const setA = new Set(a);
  const setB = new Set(b);

  const onlyInA = a.filter(item => !setB.has(item));
  const onlyInB = b.filter(item => !setA.has(item));
  const hasMismatches = (onlyInA.length + onlyInB.length) > 0

  return { onlyInA, onlyInB, hasMismatches };
}