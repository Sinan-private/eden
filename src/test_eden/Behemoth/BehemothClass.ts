import {ResourceClass, ResourceStoreClass, ResourceTypes} from "../../Resource";
import {makeAutoObservable} from "mobx";
import {id} from "../../Resource/helpers/id.ts";

export class BehemothClass {
  id: string;
  public movement_requested: boolean;
  public digging_requested: boolean;
  public flushing_requested: boolean;
  public climb_height: ResourceClass;
  public climb_speed: ResourceClass;
  private _digging_depth: ResourceClass;
  private _flushing_depth: ResourceClass;
  private _drying_delay: ResourceClass;
  private _has_flushed: boolean;

  constructor(private _resourceStore: ResourceStoreClass) {
    this.id = id();
    this.climb_height = _resourceStore.get('behemoth_climb_height')
    this.climb_speed = _resourceStore.get('behemoth_climb_speed')
    this._digging_depth = _resourceStore.get('behemoth_digging_depth')
    this._flushing_depth = _resourceStore.get('behemoth_flushing_depth')
    this._drying_delay = _resourceStore.get('behemoth_drying_delay')
    this.movement_requested = false;
    this.digging_requested = false;
    this.flushing_requested = false;
    this._has_flushed = false;
    makeAutoObservable(this)
  }

  public startFlushing = () => {
    if (this.canFlush) {
      this.flushing_requested = true;
      this._has_flushed = true;
    }
  }
  public stopFlushing = () => {
    this.flushing_requested = false;
  }

  public startClimbing = () => {
    if (!this.digging_requested) {
      const {get} = this._resourceStore
      this._digging_depth.setValueTo(0)
      this.movement_requested = true;
      this._has_flushed = false;
      get('behemoth_drying_delay').setValueTo(10) // This needs to reset to a previous state
      get('liquid_mana_level_1').setValueTo(0)
      get('liquid_mana_level_2').setValueTo(0)
      get('liquid_mana_level_3').setValueTo(0)
      get('liquid_mana_level_4').setValueTo(0)
      get('liquid_mana_level_5').setValueTo(0)
      get('dirty_mana_level_1').setValueTo(0)
      get('dirty_mana_level_2').setValueTo(0)
      get('dirty_mana_level_3').setValueTo(0)
      get('dirty_mana_level_4').setValueTo(0)
      get('dirty_mana_level_5').setValueTo(0)
    }
  }
  public stopClimbing = () => {
    this.movement_requested = false;
  }
  public startDigging = () => {
    if (this.canDig) {
      this.digging_requested = true;
    }
  }
  public stopDigging = () => {
    this.digging_requested = false;
  }

  public turnUpdate = () => {
      const speed = this.climb_speed
      const height = this.climb_height
      const digging_depth = this._digging_depth
      const flushing_depth = this._flushing_depth
      const {get, produce, getByType} = this._resourceStore
    if (this.movement_requested) {
      speed.updateValueBy(0.2)
      height.updateValueBy(speed.value)
    } else {
      speed.updateValueBy(-1)
      height.updateValueBy(speed.value)
    }
    if (this.digging_requested) {
      digging_depth.updateValueBy(this._resourceStore.get('base_slave').value)
    }
    if (this.flushing_requested) {
      flushing_depth.updateValueBy(10)
      if (flushing_depth.value >= flushing_depth.max) {
        get('liquid_mana_level_1').updateValueBy(this.digging_depth);
        get('liquid_mana_level_2').updateValueBy(this.digging_depth / 20);
        get('liquid_mana_level_3').updateValueBy(this.digging_depth / 300);
        get('liquid_mana_level_4').updateValueBy(this.digging_depth / 4000);
        get('liquid_mana_level_5').updateValueBy(this.digging_depth / 50000);
      }
    } else {
      flushing_depth.updateValueBy(-1)
    }
    if (this.liquid_mana) {
        get('behemoth_drying_delay').updateValueBy(-1)
    }
  //   As long as there is liquid mana it dries
    const isDrying = !!this.liquid_mana && !this._drying_delay.value
    if (isDrying) {
      const dryingCoefficients = calculateDryingCoefficient(getByType('liquid_mana'))
      produce('dirty_mana_level_1', 10 * dryingCoefficients[0])
      produce('dirty_mana_level_2', 10 * dryingCoefficients[1])
      produce('dirty_mana_level_3', 10 * dryingCoefficients[2])
      produce('dirty_mana_level_4', 10 * dryingCoefficients[3])
      produce('dirty_mana_level_5', 10 * dryingCoefficients[4])
    }
    if (this.canHarvest) {
      const dryingCoefficients = calculateDryingCoefficient(getByType('dirty_mana'))
      const slaves = get('base_slave').value
      produce('raw_mana_level_1', slaves * dryingCoefficients[0])
      produce('raw_mana_level_2', slaves * dryingCoefficients[1])
      produce('raw_mana_level_3', slaves * dryingCoefficients[2])
      produce('raw_mana_level_4', slaves * dryingCoefficients[3])
      produce('raw_mana_level_5', slaves * dryingCoefficients[4])
    }
  }

  get decelerating() {
    return !this.movement_requested && !!this.climb_speed.value;
  }

  get accelerating() {
    return this.movement_requested && this.climb_speed.value < this.climb_speed.max;
  }

  get inMotion() {
    return !!this.climb_speed.value || this.movement_requested;
  }

  get digging_depth() {
    return Number(this._digging_depth.beautify.value)
  }

  get flushing_depth() {
    return Number(this._flushing_depth.beautify.value)
  }

  get canFlush() {
    return !this.inMotion && !this.digging_requested && !!this.digging_depth
  }

  get canDig() {
    return !this.inMotion && !this._has_flushed
  }

  get canClimb() {
    return !this.digging_requested && !this.flushing_requested
  }

  get canHarvest() {
    return !this.inMotion && !!this.dirty_mana
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

  get drying_delay() {
    return Number(this._drying_delay.beautify.value)
  }

  private _getTypeSum = (type: ResourceTypes) => {
    const resources = this._resourceStore.getByType(type)
    const sum = resources.reduce((sum, {value}) => (sum + Math.floor(value)), 0)
    return Number(Math.floor(sum).toFixed())
  }
}

function calculateDryingCoefficient(liquidMana: ResourceClass[]): number[] {
  const liquidValues = liquidMana.map(({value}) => value).sort((a, b) => a + b);
  const sum = liquidValues.reduce((a, b) => a + b)
  return liquidValues.map((value) => value / sum)
}