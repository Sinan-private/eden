import {ResourceClass, ResourceStoreClass, ResourceTypes} from "../../../Resource";
import {makeAutoObservable} from "mobx";

const FLUSHING_SPEED = 0.25;
const DRYING_SPEED = 2;
const HARVEST_SPEED = 0.25;
const CRAFTING_SPEED = 0.15;
const MANA_FINDINGS = [1, 20, 300, 4000, 50000];

export class BehemothClass {
  public movement_requested: boolean;
  public digging_requested: boolean;
  public flushing_requested: boolean;
  public crafting_requested: boolean;
  public climb_height: ResourceClass;
  public climb_speed: ResourceClass;
  private _hp: ResourceClass;
  private _acid: ResourceClass;
  private _digging_depth: ResourceClass;
  private _flushing_depth: ResourceClass;
  private _drying_delay: ResourceClass;
  private _has_flushed: boolean;

  constructor(private _resourceStore: ResourceStoreClass) {
    this._hp = _resourceStore.get('behemoth_hp')
    this._acid = _resourceStore.get('behemoth_acid')
    this.climb_height = _resourceStore.get('behemoth_climb_height')
    this.climb_speed = _resourceStore.get('behemoth_climb_speed')
    this._digging_depth = _resourceStore.get('behemoth_digging_depth')
    this._flushing_depth = _resourceStore.get('behemoth_flushing_depth')
    this._drying_delay = _resourceStore.get('behemoth_drying_delay')
    this.movement_requested = false;
    this.digging_requested = false;
    this.flushing_requested = false;
    this.crafting_requested = true;
    this._has_flushed = false;
    makeAutoObservable(this)
  }

  public startCrafting = () => {
    this.crafting_requested = true;
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
      const {get, getByType} = this._resourceStore
      this._digging_depth.setValueTo(0)
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
    if (this.canDig) {
      this.digging_requested = true;
    }
  }
  public stopDigging = () => {
    this.digging_requested = false;
  }
  public manaToAcid = () => {
    console.log('do')
    const trade = this._resourceStore.trade([{key: 'clean_mana_level_1', value: 20}], [{key: 'behemoth_acid', value: 100}])
    console.log(trade.isTradePossible())
    if (trade.isTradePossible()) {
      trade.executeTrade()
    }
    // this._resourceStore.get('clean_mana_level_1').updateValueBy(-20)
    // this._acid.updateValueBy(100)
  }

  // public turnUpdate = turnUpdate.bind(this);

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
      digging_depth.updateValueBy(this._resourceStore.get('slave_diggers').value)
    }
    if (this.flushing_requested && this.acid) {
      flushing_depth.updateValueBy(10)
      this._acid.updateValueBy(-10)
      if (flushing_depth.value >= flushing_depth.max) {
        getByType('liquid_mana').forEach((liquid_mana, i) =>
          liquid_mana.updateValueBy(this.digging_depth * FLUSHING_SPEED / MANA_FINDINGS[i]))
      }
    } else {
      flushing_depth.updateValueBy(-1)
    }
    if (this.liquid_mana) {
        get('behemoth_drying_delay').updateValueBy(-1)
    }
  //   As long as there is liquid mana it dries
    const isDrying = !!this.liquid_mana && !this._drying_delay.value
    const slave_digger = get('slave_diggers').value
    const slave_blacksmiths = get('slave_blacksmiths').value
    if (isDrying) {
      const dryingCoefficients = calculateDryingCoefficient(getByType('liquid_mana'))
      produce('dirty_mana_level_1', DRYING_SPEED * dryingCoefficients[0])
      produce('dirty_mana_level_2', DRYING_SPEED * dryingCoefficients[1])
      produce('dirty_mana_level_3', DRYING_SPEED * dryingCoefficients[2])
      produce('dirty_mana_level_4', DRYING_SPEED * dryingCoefficients[3])
      produce('dirty_mana_level_5', DRYING_SPEED * dryingCoefficients[4])
    }
    if (this.canHarvest) {
      const dryingCoefficients = calculateDryingCoefficient(getByType('dirty_mana'))
      produce('raw_mana_level_1', slave_digger * HARVEST_SPEED * dryingCoefficients[0])
      produce('raw_mana_level_2', slave_digger * HARVEST_SPEED * dryingCoefficients[1])
      produce('raw_mana_level_3', slave_digger * HARVEST_SPEED * dryingCoefficients[2])
      produce('raw_mana_level_4', slave_digger * HARVEST_SPEED * dryingCoefficients[3])
      produce('raw_mana_level_5', slave_digger * HARVEST_SPEED * dryingCoefficients[4])
    }
    if (this.crafting_requested) {
      const dryingCoefficients = calculateDryingCoefficient(getByType('raw_mana'))
      produce('clean_mana_level_1', slave_blacksmiths * dryingCoefficients[0] * CRAFTING_SPEED)
      produce('clean_mana_level_2', slave_blacksmiths * dryingCoefficients[1] * CRAFTING_SPEED)
      produce('clean_mana_level_3', slave_blacksmiths * dryingCoefficients[2] * CRAFTING_SPEED)
      produce('clean_mana_level_4', slave_blacksmiths * dryingCoefficients[3] * CRAFTING_SPEED)
      produce('clean_mana_level_5', slave_blacksmiths * dryingCoefficients[4] * CRAFTING_SPEED)

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

  get hp() {
    return Math.floor(this._hp.value)
  }

  get acid() {
    return Math.floor(this._acid.value)
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
