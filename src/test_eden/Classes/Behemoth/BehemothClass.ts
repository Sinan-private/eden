import {makeAutoObservable} from "mobx";
import {ResourceClass, ResourceStoreClass, ResourceTypes} from "../../../Resource";
import {AUTO_CLIMB} from "../../constants/constants.ts";

const FLUSHING_SPEED = 0.25;
const DRYING_SPEED = 2;
const HARVEST_SPEED = 0.25;
const CRAFTING_SPEED = 0.15;
const MANA_FINDINGS = [1, 20, 300, 4000, 50000];

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
  private _drying_delay: ResourceClass;

  constructor(private _resourceStore: ResourceStoreClass) {
    this.hp = _resourceStore.get('behemoth_hp')
    this.acid = _resourceStore.get('behemoth_acid')
    this.climb_height = _resourceStore.get('behemoth_climb_height')
    this.climb_speed = _resourceStore.get('behemoth_climb_speed')
    this.digging_depth = _resourceStore.get('behemoth_digging_depth')
    this.flushing_depth = _resourceStore.get('behemoth_flushing_depth')
    this._drying_delay = _resourceStore.get('behemoth_drying_delay')
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
    if (this.canDig) {
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

  get inMotion() {
    return !!this.climb_speed.value || this.movement_requested;
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
  public turnUpdate = () => {
    const speed = this.climb_speed
    const height = this.climb_height
    const digging_depth = this.digging_depth
    const flushing_depth = this.flushing_depth
    const {get, produce, getByType} = this._resourceStore
    if (this.movement_requested) {
      speed.updateValueBy(0.2)
      height.updateValueBy(speed.value)
    } else {
      speed.updateValueBy(-1)
      height.updateValueBy(speed.value)
    }
    if (this.digging_requested) {
      console.log('dig')
      digging_depth.updateValueBy(this._resourceStore.get('slave_diggers').value)
    }
    if (this.flushing_requested && this.acid.value >= 1) {
      flushing_depth.updateValueBy(10)
      this.acid.updateValueBy(-10)
      if (flushing_depth.value >= flushing_depth.max) {
        getByType('liquid_mana').forEach((liquid_mana, i) =>
          liquid_mana.updateValueBy(this.digging_depth.value * FLUSHING_SPEED / MANA_FINDINGS[i]))
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

}

function calculateDryingCoefficient(liquidMana: ResourceClass[]): number[] {
  const liquidValues = liquidMana.map(({value}) => value).sort((a, b) => a + b);
  const sum = liquidValues.reduce((a, b) => a + b)
  return liquidValues.map((value) => value / sum)
}
