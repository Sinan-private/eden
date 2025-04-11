import {ResourceClass, ResourceKeys, ResourceState, ResourceStoreClass, ResourceTypes} from "@/Resource";
import {Update} from "@/Resource/context/admin.context.ts";
import {Resource} from "@/Resource/ResourceHandler";
import {ChangeEvent} from "react";
import {makeAutoObservable} from "mobx";
import {ResourceStore} from "@/Resource/ResourceHandler/ResourceStore.ts";

// Todo - Why am I starting version 3.000? I still don't like my setup and now I need to check if a key already
//  exists (overwrite or create new), I need to check if the resource is pristine (disabled buttons)
//  and I want to prepare the resource so that it checks against the ID and overwrites even if the key was changed

export class Editable {
  public resourceStore: ResourceStoreClass;
  private origin: ResourceClass | null = null;
  private update: ResourceClass | null = null;
  private keyIsDirty: boolean = true;
  // Why all this extra complication. I don't want the max value to destroy the value on input.
  // The value should only check for the threshold after the input is done
  public useMax: boolean = false;
  public useMin: boolean = false;
  private max: number = Infinity;
  private min: number = -Infinity;
  constructor(
    public readonly originalResourceStore: ResourceStoreClass
  ) {
    this.resourceStore = new ResourceStore(originalResourceStore.state, 'admin');
    makeAutoObservable(this)
  }

  public readonly createResource = (resource: Update) => {
    this.update = new Resource(resource as ResourceClass)
    this.keyIsDirty = false;
    this.origin = null;
    // console.log(this.update)
  }

  public readonly editResource = (cloneId: string) => {
    const resource = this.resourceStore?.get(cloneId) as ResourceClass
    const {min, max, state, key} = resource
    this.useMax = typeof max === "number" && max !== Infinity
    this.useMin = typeof max === "number" && max !== -Infinity
    this.min = min;
    this.max = max;
    this.origin = this.originalResourceStore.getByKey(key)
    this.update = new Resource(state)
    console.log('clone id editResource', cloneId)
    console.log('original id editResource', this.origin.id)
    // console.log('editResource resource', this.originalResourceStore.get(cloneId))
    // console.log('editResource resource', this.resourceStore.get(cloneId))
  }

  public writeUpdates = () => {
    const original = this.originalResourceStore;
    const updatedDependencies = original.replaceTradeKeys(this.origin!.key, this.update!.key);
    const origin = original.get(this.origin!.id);
    const newState = {
      ...this.update!.state,
      id: this.origin!.id,
    }
    const changes = updatedDependencies.concat(newState);
    console.log(newState, updatedDependencies)
    // console.log(this.update, updatedDependencies)
    console.log('origin', origin.id)
    original.updateResources(changes)
    return changes
    // resourceToUpdate.setTo(this.update!.state)
  }

  public setLabel = (e: ChangeEvent<HTMLInputElement>) => {
    const label = e.target.value
    const resource = this.update!
    resource.setTo({label})
    if (this.isKeyPristine) {
      const generatedKey = e.target.value.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase() as ResourceKeys
      resource.setTo({key: generatedKey})
    }
  }

  public setKey = (e: ChangeEvent<HTMLInputElement>)=> {
    this.update?.setTo({key: e.target.value as ResourceKeys})
    this.keyIsDirty = true
  }

  public setType = (type: string) =>
    this.update?.setTo({type: type as ResourceTypes})

  public setValue = (e: ChangeEvent<HTMLInputElement>)=> {
    this.update?.setTo({value: Number(e.target.value)})
  }

  public toggleUseMax = () => {
    this.useMax = !this.useMax;
    if (!this.useMax) {
      this.max = Infinity;
      this.update?.setTo({max: Infinity})
    }
  }

  public toggleUseMin = () => {
    this.useMin = !this.useMin;
    if (!this.useMin) {
      this.min = -Infinity;
      this.update?.setTo({min: -Infinity})
    }
  }

  public onInputMax = (e: ChangeEvent<HTMLInputElement>) => {
    this.max = Number(e.target.value)
  }

  public onInputMin = (e: ChangeEvent<HTMLInputElement>) => {
    this.min = Number(e.target.value)
  }

  public setMax = () => {
    this.update?.setTo({max: this.max})
  }

  public setMin = () => {
    this.update?.setTo({min: this.min})
  }

  public save = (): ResourceState => {
    return this.resource
  }

  get resource() {
    return {
      ...this.update!.state,
      id: this.update!.id,
      min: this.useMin ? this.min : Infinity,
      max: this.useMax ? this.max : Infinity,
      icon: this.update!.icon,
    }
  }
  get isKeyPristine() {
    console.log(this.update?.key, this.origin?.key)
    return !this.keyIsDirty
    // return this.update?.key === this.origin?.key;
  }

  get isUpdate() {
    return true
    // return !!(this.update && this.origin)
  }

  get isCreation() {
    return !!(this.update && !this.origin)
  }

}