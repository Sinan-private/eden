import {ChangeEvent} from "react";
import {ResourceKeys, ResourceTypes} from "@/Resource";

export class AdminUserResource {
  constructor() {
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
}