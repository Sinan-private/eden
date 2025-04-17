import {HarvestRenderClass} from "@/test_eden/Gaja/Digging/HarvestRenderClass.ts";
import {makeAutoObservable} from "mobx";
import {id} from "@/Resource/helpers/id.ts";
import {ResourceStoreClass} from "@/Resource";
import {AUTO_CLIMB, AUTO_COLLECT_MANA} from "@/test_eden/constants/constants.ts";

export class GameState {
  public id: string = id()
  private _behemoth_climbing: boolean = false
  private _mana_digging: boolean = false
  private _mana_flushing: boolean = false
  private _has_flushed: boolean = false
  private _mana_drying: boolean = false
  private _harvested_mana: number = 0
  // private _mana_harvesting: boolean = false
  public collecting_requested: boolean = AUTO_COLLECT_MANA;
  public movement_requested: boolean = AUTO_CLIMB; // move to GameState?
  currentHarvest: HarvestRenderClass | null = null;
  pastHarvests: HarvestRenderClass[] = [];

  constructor(private _resourceStore: ResourceStoreClass) {
    makeAutoObservable(this)
  }

  public renderHarvest = () => {
    const images = this.pastHarvests.flatMap(({getManaImages}) => getManaImages());
    if (!images.length) return []
    const [raw_first, ...rest] = images
    // console.log(this.mana_images.map(({value}) => value))
    // console.log(raw_first.value, this.harvested_mana)
    const first = new HarvestRenderClass(this._resourceStore, raw_first.value - this._harvested_mana).getManaImages()
    return [raw_first, ...rest]
  }

  public startClimbing = () => {
    if (!this.mana_digging && !this.movement_requested) {
      const {getByKey} = this._resourceStore
      this.movement_requested = true;
      this._has_flushed = false;
      getByKey('behemoth_digging_depth').setValueTo(0)
      getByKey('behemoth_flushing_depth').setValueTo(0) // This needs to reset to a previous state
      getByKey('behemoth_drying_delay').setValueTo(10) // This needs to reset to a previous state
      if (!this.pastHarvests.length) return;
      this.pastHarvests = [];
    }
  }
  public stopClimbing = () =>
    this.movement_requested = false;


  public startManaFlushing = () => {
    if (this._mana_flushing) return;
    this._mana_flushing = true
    this._has_flushed = true;
    // console.log('startFlushing')
    if (this.currentHarvest) return; // guard against double-start
    this.resetSessionDiggingMana()
    this.currentHarvest = new HarvestRenderClass(this._resourceStore);

  }

  public stopManaFlushing = () => {
    if (!this._mana_flushing) return;
    this._mana_flushing = false
    if (!this.currentHarvest) return;
    // console.log('stopFlushing')
    this.currentHarvest.stopFlushing()
    this.pastHarvests.push(this.currentHarvest);
    this.currentHarvest = null;
  }

  public resetSessionDiggingMana = () => {
    const {getByType} = this._resourceStore
    getByType('dirty_mana').forEach(mana => {
      mana.resetSession()
    })
  }

  get mana_drying() {
    return this._mana_drying
  }

  set mana_drying(value: boolean) {
    this._mana_drying = value
  }

  get mana_harvesting() {
    const notFlushing = !this.mana_flushing;
    const notMoving = !this.is_moving;
    const hasDirtyMana = !!this._resourceStore.getTypeSum('dirty_mana');

    return this.collecting_requested && notFlushing && notMoving && hasDirtyMana;
    // return this._mana_harvesting
  }

  get behemoth_climbing() {
    return this._behemoth_climbing
  }

  set behemoth_climbing(value: boolean) {
    if (this._behemoth_climbing === value) return
    this._behemoth_climbing = value
  }

  get mana_digging() {
    return this._mana_digging
  }

  // set mana_digging(value: boolean) {
  //   this._mana_digging = value
  // }
  public startManaDigging = () => {
    if (this.can_dig && !this._mana_digging) {
      this._mana_digging = true
    }
  }

  public stopManaDigging = () => {
    if (this._mana_digging) {
      this._mana_digging = false
    }
  }

  get mana_flushing() {
    return this._mana_flushing
  }

  get can_dig() {
    return !this.is_moving && !this._has_flushed && !this.mana_flushing
  }

  get is_moving() {
    return !!this._resourceStore.getByKey('behemoth_climb_speed').value // || this.movement_requested;
  }

}