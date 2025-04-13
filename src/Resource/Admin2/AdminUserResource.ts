import {ChangeEvent} from "react";
import {ResourceClass, ResourceKeys, ResourceTypes} from "@/Resource";

type Event = ChangeEvent<HTMLInputElement>;

export class AdminUserResource {
  public useMax: boolean;
  public useMin: boolean;
  public min: number;
  public max: number;

  constructor(
    public resource: ResourceClass,
    public keyIsPristine: boolean = true,
  ) {
    this.useMax = !!(resource.max) && resource.max !== Infinity;
    this.useMin = !!(resource.min) && resource.min !== -Infinity;
    this.min = resource.min;
    this.max = resource.max;
  }

  public setLabel = (e: Event) => {
    const label = e.target.value
    const resource = this.resource!
    resource.setTo({label})
    if (this.keyIsPristine) {
      const generatedKey = e.target.value.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase() as ResourceKeys
      resource.setTo({key: generatedKey})
    }
  }

  public setKey = (e: Event) => {
    this.resource?.setTo({key: e.target.value as ResourceKeys})
    this.keyIsPristine = false
  }

  public setType = (type: string) =>
    this.resource?.setTo({type: type as ResourceTypes})

  public setValue = (e: Event) => {
    this.resource?.setTo({value: Number(e.target.value)})
  }

  public toggleUseMax = () => {
    this.useMax = !this.useMax;
    if (!this.useMax) {
      this.max = Infinity;
      this.resource?.setTo({max: Infinity})
    }
  }

  public toggleUseMin = () => {
    this.useMin = !this.useMin;
    if (!this.useMin) {
      this.min = -Infinity;
      this.resource?.setTo({min: -Infinity})
    }
  }

  public onInputMax = (e: Event) => {
    this.max = Number(e.target.value)
  }

  public onInputMin = (e: Event) => {
    this.min = Number(e.target.value)
  }

  public setMax = () => {
    this.resource?.setTo({max: this.max})
  }

  public setMin = () => {
    this.resource?.setTo({min: this.min})
  }
}