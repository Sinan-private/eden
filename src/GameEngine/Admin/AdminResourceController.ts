import {ChangeEvent} from "react";
import {makeAutoObservable} from "mobx";
import {ResourceClass, ResourceKeys, ResourceTypes} from "src/GameEngine/ResourceEngine";

type Event = ChangeEvent<HTMLInputElement>;

export class AdminResourceController {
  public useMax: boolean;
  public useMin: boolean;
  public min: number;
  public max: number;
  public keyIsPristine: boolean;

  constructor(
    public resource: ResourceClass,
    isExistingResource: boolean,
  ) {
    this.keyIsPristine = !isExistingResource;
    this.useMax = typeof resource.max === 'number' && resource.max !== Infinity;
    this.useMin = typeof resource.max === 'number' && resource.min !== -Infinity;
    this.min = resource.min;
    this.max = resource.max;
    makeAutoObservable(this);
  }

  public addCost = () => this.resource.addCost('gain', {key: this.resource.key, value: 1})

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
    this.keyIsPristine = false
    this.resource?.setTo({key: e.target.value as ResourceKeys})
  }

  public setType = (type: string) =>
    this.resource?.setTo({type: type as ResourceTypes})

  public setValue = (e: Event) =>
    this.resource?.setTo({value: Number(e.target.value)})

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

  public onInputMax = (e: Event) => this.max = Number(e.target.value)
  public onInputMin = (e: Event) => this.min = Number(e.target.value)
  public setMax = () => this.resource?.setTo({max: this.max})
  public setMin = () => this.resource?.setTo({min: this.min})
}
