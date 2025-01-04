import {makeAutoObservable} from "mobx";
import {ResourceClass, ResourceStoreClass, ResourceTypes} from "../../../Resource";
import {AUTO_CLIMB} from "../../constants/constants.ts";

export class BehemothClass {
  public movement_requested: boolean = AUTO_CLIMB;
  public digging_requested: boolean = false;
  public flushing_requested: boolean = false;
  public crafting_requested: boolean = true;
  private _has_flushed: boolean = false;
  public climb_height: ResourceClass;
  public climb_speed: ResourceClass;
  public hp: ResourceClass;
  public acid: ResourceClass;
  public digging_depth: ResourceClass;
  public flushing_depth: ResourceClass;
  public stamina: ResourceClass;
  public drying_delay: ResourceClass;

  constructor(private _resourceStore: ResourceStoreClass) {
    this.hp = _resourceStore.get('behemoth_hp')
    this.acid = _resourceStore.get('behemoth_acid')
    this.climb_height = _resourceStore.get('behemoth_climb_height')
    this.climb_speed = _resourceStore.get('behemoth_climb_speed')
    this.digging_depth = _resourceStore.get('behemoth_digging_depth')
    this.flushing_depth = _resourceStore.get('behemoth_flushing_depth')
    this.stamina = _resourceStore.get('behemoth_stamina')
    this.drying_delay = _resourceStore.get('behemoth_drying_delay')
    makeAutoObservable(this)
  }

  public startCrafting = () => {
    this.crafting_requested = true;
  }

  public startFlushing = () => {
    if (this.can_flush) {
      this.flushing_requested = true;
      this._has_flushed = true;
    }
  }
  public stopFlushing = () => {
    this.flushing_requested = false;
  }

  public startClimbing = () => {
    if (!this.digging_requested) {
      const {get, getByType} = this._resourceStore
      this.digging_depth.setValueTo(0)
      this.movement_requested = true;
      this._has_flushed = false;
      get('behemoth_flushing_depth').setValueTo(0) // This needs to reset to a previous state
      get('behemoth_drying_delay').setValueTo(10) // This needs to reset to a previous state
      getByType('liquid_mana').forEach(liquid_mana => liquid_mana.setValueTo(0))
      getByType('dirty_mana').forEach(dirty_mana => dirty_mana.setValueTo(0))
    }
  }
  public stopClimbing = () => {
    this.movement_requested = false;
  }
  public startDigging = () => {
    if (this.can_dig) {
      this.digging_requested = true;
    }
  }
  public stopDigging = () => {
    this.digging_requested = false;
  }
  public manaToAcid = () => {
    this._resourceStore
      .trade([{key: 'clean_mana_level_1', value: 1}], [{key: 'behemoth_acid', value: 5}], 20)
      .tradeIfPossible()
  }

  get decelerating() {
    return !this.movement_requested && !!this.climb_speed.value;
  }

  get accelerating() {
    return this.movement_requested && this.climb_speed.value < this.climb_speed.max;
  }

  get is_moving() {
    return !!this.climb_speed.value || this.movement_requested;
  }

  get should_move() {
    return this.movement_requested && !this.should_stop_moving
  }

  get should_stop_moving() {
    return this.stamina.value < 1 || !this.movement_requested;
  }

  get can_start_moving() {
    return !this.digging_requested && !this.flushing_requested && this.stamina.value >= 30
  }

  get should_dig() {
    return this.digging_requested
  }

  get can_flush() {
    return !this.is_moving && !this.digging_requested && !!this.digging_depth
  }

  get can_dig() {
    return !this.is_moving && !this._has_flushed && !this.should_flush
  }

  get can_harvest() {
    return !this.is_moving && !!this.dirty_mana  && !this.should_flush
  }

  get liquid_mana() {
    return this._getTypeSum('liquid_mana')
  }
  get dirty_mana() {
    return this._getTypeSum('dirty_mana')
  }
  get raw_mana() {
    return this._getTypeSum('raw_mana')
  }

  get should_flush() {
    return this.flushing_requested && this.acid.value >= 1
  }
  get is_flushing_mana() {
    return this.flushing_depth.value >= this.flushing_depth.max
  }

  get is_still() {
    return !this.is_moving && !this.should_flush
  }

  private _getTypeSum = (type: ResourceTypes) => {
    const resources = this._resourceStore.getByType(type)
    const sum = resources.reduce((sum, {value}) => (sum + Math.floor(value)), 0)
    return Number(Math.floor(sum).toFixed())
  }

}
