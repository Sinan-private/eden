import {makeAutoObservable} from "mobx";
import {ResourceClass, ResourceStoreClass} from "../../../Resource";
import {
  AUTO_CLIMB, BEHEMOTH_STAMINA_PER_SLAVE,
  BEHEMOTH_STAMINA_PER_WASTED_SLAVE,
  STAMINA_REGEN,
  STAMINA_REGEN_ON_FLUSHING
} from "../../constants/constants.ts";
import {staminaDrain} from "../../constants/gameRules.ts";
import {Game} from "../../context/game.context.ts";
import {LevelClass} from "../LevelClass.ts";
import {levels} from "./levels.ts";

export class BehemothClass {
  public level: LevelClass;
  public movement_requested: boolean = AUTO_CLIMB;
  public digging_requested: boolean = false;
  public flushing_requested: boolean = false;
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
    this.level = new LevelClass(_resourceStore, levels)
    this.hp = _resourceStore.getByKey('behemoth_hp')
    this.acid = _resourceStore.getByKey('behemoth_acid')
    this.climb_height = _resourceStore.getByKey('behemoth_climb_height')
    this.climb_speed = _resourceStore.getByKey('behemoth_climb_speed')
    this.digging_depth = _resourceStore.getByKey('behemoth_digging_depth')
    this.flushing_depth = _resourceStore.getByKey('behemoth_flushing_depth')
    this.stamina = _resourceStore.getByKey('behemoth_stamina')
    this.drying_delay = _resourceStore.getByKey('behemoth_drying_delay')
    makeAutoObservable(this)
  }

  public startFlushing = () => {
    if (this.can_flush) {
      this.flushing_requested = true;
      this._has_flushed = true;
    }
  }
  public stopFlushing = () =>
    this.flushing_requested = false;

  public startClimbing = () => {
    if (!this.digging_requested) {
      const {getByKey, getByType} = this._resourceStore
      this.digging_depth.setValueTo(0)
      this.movement_requested = true;
      this._has_flushed = false;
      getByKey('behemoth_flushing_depth').setValueTo(0) // This needs to reset to a previous state
      getByKey('behemoth_drying_delay').setValueTo(10) // This needs to reset to a previous state
      getByType('liquid_mana').forEach(liquid_mana => liquid_mana.setValueTo(0))
      getByType('dirty_mana').forEach(dirty_mana => dirty_mana.setValueTo(0))
    }
  }
  public stopClimbing = () =>
    this.movement_requested = false;

  public startDigging = () => {
    if (this.can_dig) {
      this.digging_requested = true;
    }
  }
  public stopDigging = () =>
    this.digging_requested = false;

  public manaToAcid = () =>
    this._resourceStore
      .trade([{key: 'clean_mana_level_1', value: 1}], [{key: 'behemoth_acid', value: 5}], 20)
      .tradeIfPossible()
  public consumeWastedSlave = () => {
      this._resourceStore
        .trade([{key: 'slaves_wasted', value: 1}], [{key: 'behemoth_stamina', value: BEHEMOTH_STAMINA_PER_WASTED_SLAVE}])
        .tradeIfPossible()
  }

  public consumeSlave = () => {
    this._resourceStore
      .trade([{key: 'slaves_enslaved', value: 1}], [{key: 'behemoth_stamina', value: BEHEMOTH_STAMINA_PER_SLAVE}])
      .tradeIfPossible()
  }

  get decelerating() {
    return !this.movement_requested && !!this.climb_speed.value;
  }

  get accelerating() {
    return this.should_move && this.climb_speed.value < this.climb_speed.max;
  }

  get is_moving() {
    return !!this.climb_speed.value // || this.movement_requested;
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
    return !this.is_moving && !this._has_flushed && !this.is_flushing
  }

  get can_harvest() {
    return !this.is_moving && !!this.dirty_mana_sum && !this.is_flushing
  }

  get liquid_mana_sum() {
    return this._resourceStore.getTypeSum('liquid_mana')
  }

  get dirty_mana_sum() {
    return this._resourceStore.getTypeSum('dirty_mana')
  }

  get raw_mana_sum() {
    return this._resourceStore.getTypeSum('raw_mana')
  }

  get is_flushing() {
    return this.flushing_requested && this.acid.value >= 1
  }

  get is_flushing_mana() {
    return this.is_flushing && this.flushing_depth.value >= this.flushing_depth.max
  }

  get stopped_flushing_mana() {
    return !this.is_flushing && !!this.flushing_depth.value
  }

  get is_mana_starting_to_dry() {
    return !!this.liquid_mana_sum
  }

  get is_mana_drying() {
    return !!this.liquid_mana_sum && !this.drying_delay.value
  }

  get is_still() {
    return !this.is_moving && !this.is_flushing
  }

  public turnUpdate = (game: Game) => {
    const {
      is_flushing,
      stopped_flushing_mana,
      is_moving,
      should_dig,
      is_still,
      is_flushing_mana,
      is_mana_starting_to_dry,
      is_mana_drying,
      accelerating,
      decelerating,
      should_stop_moving,
      climb_speed,
      climb_height,
      digging_depth,
      flushing_depth,
      stamina,
      acid,
      stopClimbing,
    } = this
    const {getByKey} = this._resourceStore
    if (accelerating) {
      climb_speed.updateValueBy(0.2)
    }
    if (is_moving) {
      climb_height.updateValueBy(climb_speed.value)
      stamina.updateValueBy(-staminaDrain(climb_speed.value))
    }
    if (should_stop_moving) {
      stopClimbing()
    }
    if (decelerating) {
      climb_speed.updateValueBy(-1)
    }
    if (is_still) {
      stamina.updateValueBy(STAMINA_REGEN)
    }
    if (should_dig) {
      digging_depth.updateValueBy(game.slaves.arwa / 2)
    }
    if (is_flushing) {
      stamina.updateValueBy(STAMINA_REGEN_ON_FLUSHING)
      flushing_depth.updateValueBy(10)
      acid.updateValueBy(-10)
    }
    if (is_flushing_mana) {
      game.mana.produceLiquidMana()
      this._resourceStore.getByKey('upstream_height').updateValueBy(10)
    }
    if (stopped_flushing_mana) {
      flushing_depth.updateValueBy(-1)
    }
    if (is_mana_starting_to_dry) {
      getByKey('behemoth_drying_delay').updateValueBy(-1)
    }
    if (is_mana_drying) {
      game.mana.produceDirtyMana()
    }
  }
}
