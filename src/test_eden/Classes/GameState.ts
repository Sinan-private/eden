import {HarvestRenderClass} from "@/test_eden/Gaja/Digging/HarvestRenderClass.ts";
import {makeAutoObservable} from "mobx";
import {id} from "@/Resource/helpers/id.ts";

export class GameState {
  public id: string = id()
  private _behemoth_climbing: boolean = false
  private _behemoth_digging: boolean = false
  private _mana_flushing: boolean = false
  private _mana_drying: boolean = false
  private _mana_harvesting: boolean = false
  currentHarvest: HarvestRenderClass | null = null;
  pastHarvests: HarvestRenderClass[] = [];
  constructor() {
    makeAutoObservable(this)
  }
  get behemoth_climbing() {
    return this._behemoth_climbing
  }
  set behemoth_climbing(value: boolean) {
    if (this._behemoth_climbing === value) return
    this._behemoth_climbing = value
  }
  get behemoth_digging() {
    return this._behemoth_digging
  }
  set behemoth_digging(value: boolean) {
    this._behemoth_digging = value
  }
  get mana_flushing() {
    return this._mana_flushing
  }
  set mana_flushing(value: boolean) {
    this._mana_flushing = value
  }
  get mana_drying() {
    return this._mana_drying
  }
  set mana_drying(value: boolean) {
    this._mana_drying = value
  }
  get mana_harvesting() {
    return this._mana_harvesting
  }
  set mana_harvesting(value: boolean) {
    this._mana_harvesting = value
  }
}