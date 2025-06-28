import {HarvestRenderClass} from "@/Game/RenderEngine/HarvestRenderClass.ts";
import {makeAutoObservable} from "mobx";
import {AUTO_CLIMB, AUTO_COLLECT_MANA} from "@/Game/constants/constants.ts";
import {SegmentedPower} from "@/Game/Classes/SegmentedPower.ts";
import {ResourceKeys, ResourceEngineClass} from "@/GameEngine";
import {id} from "@/GameEngine/ResourceEngine/helpers/id.ts";

// This setup sucks. And it seems to create the buggy behavior of my HarvestRenderClass


const harvestRender = new HarvestRenderClass();

export class GameState {
  public id: string = id()
  private _behemoth_climbing: boolean = false
  private _mana_digging: boolean = false
  private _mana_flushing: boolean = false
  private _has_flushed: boolean = false
  private _mana_drying: boolean = false
  private _rendered_mana: number = 0
  private _session_raw_mana: number = 0;
  // private _mana_harvesting: boolean = false
  public collecting_requested: boolean = AUTO_COLLECT_MANA;
  public movement_requested: boolean = AUTO_CLIMB; // move to GameState?
  public influence: SegmentedPower;
  currentHarvest: HarvestRenderClass = harvestRender;
  // pastHarvests: HarvestRenderClass[] = [];

  constructor(private _resourceStore: ResourceEngineClass) {
    this.influence = this._getSegmentedPower('human_influence', 3)
    makeAutoObservable(this)
  }

  private _getSegmentedPower = (key: ResourceKeys, segments: number) => {
    const resource = this._resourceStore.getByKey(key)
    return new SegmentedPower(resource, segments)
  }

  public produceRawMana = () => {
    const raw_mana = this._resourceStore.getTypeSessionSum('raw_mana')
    this.currentHarvest.harvestMana(raw_mana - this._session_raw_mana)
    this._session_raw_mana = raw_mana;
  }

  public renderHarvest = () => {
    // Todo seems here lies the issue with mana not rendering on the second harvest
    // console.log("renderHarvest", this.currentHarvest?.mana_images);
    return this.currentHarvest?.mana_images || []
  }

  public startClimbing = () => {
    if (!this.mana_digging && !this.movement_requested) {
      const {getByKey} = this._resourceStore
      this.movement_requested = true;
      this._has_flushed = false;
      getByKey('behemoth_digging_depth').setValueTo(0)
      getByKey('behemoth_flushing_depth').setValueTo(0) // This needs to reset to a previous state
      getByKey('behemoth_drying_delay').setValueTo(10) // This needs to reset to a previous state
      this.resetDiggingMana()
    }
  }
  public stopClimbing = () =>
    this.movement_requested = false;


  public startManaFlushing = () => {
    if (this._mana_flushing) return;
    console.log('startFlushing')
    this._mana_flushing = true
    this._has_flushed = true;
    if (this.currentHarvest) return; // guard against double-start
    this.resetSessionDiggingMana()
  }

  public stopManaFlushing = () => {
    if (!this._mana_flushing) return;
    console.log('stopFlushing')
    this._mana_flushing = false
    if (!this.currentHarvest) return;
    const mana_sum = this._resourceStore.getTypeSessionSum('liquid_mana') //+ this._resourceStore.getTypeSum('liquid_mana')
    const images = mana_sum - this._rendered_mana
    this.currentHarvest.createImages(images)
    this._rendered_mana = mana_sum
  }

  public resetSessionDiggingMana = () => {
    const {getByType} = this._resourceStore
    getByType('dirty_mana').forEach(mana => {
      mana.resetSession()
    })
  }

  public resetDiggingMana = () => {
    const {getByType} = this._resourceStore
    this.currentHarvest.reset()
    this._rendered_mana = 0
    this._session_raw_mana = 0
    const toClear = getByType('liquid_mana').concat(getByType('dirty_mana'))
    toClear.forEach(mana => {
      mana.setValueTo(0)
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