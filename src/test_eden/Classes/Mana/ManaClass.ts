import {ResourceStoreClass, ResourceTypes} from "../../../Resource";
import {CRAFTING_SPEED, DRYING_SPEED, FLUSHING_SPEED, HARVEST_SPEED} from "../../constants/constants.ts";
import {RandomResourceUpdate} from "../RandomResourceUpdate.ts";

export class ManaClass {
  private _finding_chance_level_1: number = 1
  private _finding_chance_level_2: number = 1/20
  private _finding_chance_level_3: number = 1/300
  private _finding_chance_level_4: number = 1/4000
  private _finding_chance_level_5: number = 1/50000
  private _session_digging_mana: number = 0
  private random: RandomResourceUpdate;
  constructor(private _resourceStore: ResourceStoreClass) {
    this.random = new RandomResourceUpdate(_resourceStore);
  }

  // This comes from flushing. Nothing more is needed to do than just flushing
  public produceLiquidMana = () => {
    const {getByKey} = this._resourceStore
    const digging_depth = this._resourceStore.getByKey("behemoth_digging_depth").value;
    const power = (digging_depth / 10) * FLUSHING_SPEED
    const level1_raise = this.random.chance(this._finding_chance_level_1, power);
    const level2_raise = this.random.chance(this._finding_chance_level_2, power);
    this._session_digging_mana += (level1_raise + level2_raise);
    getByKey('liquid_mana_level_1').updateValueBy(this.random.chance(this._finding_chance_level_1, power))
    getByKey('liquid_mana_level_2').updateValueBy(this.random.chance(this._finding_chance_level_2, power))
    getByKey('liquid_mana_level_3').updateValueBy(this.random.chance(this._finding_chance_level_3, power))
    getByKey('liquid_mana_level_4').updateValueBy(this.random.chance(this._finding_chance_level_4, power))
    getByKey('liquid_mana_level_5').updateValueBy(this.random.chance(this._finding_chance_level_5, power))
  }

  // This comes from liquid mana. It doesn't need any interaction. Just time to dry
  public produceDirtyMana = () => {
    const randomLevel = this.random.levelConversion('liquid_mana', 'dirty_mana').key
    this._resourceStore.produce(randomLevel, DRYING_SPEED)
  }

  public produceRawMana = (slaves: number) => {
    const power = (slaves / 2) * HARVEST_SPEED
    const randomLevel = this.random.levelConversion('dirty_mana', 'raw_mana').key
    this._resourceStore.produce(randomLevel, power)
  }

  public produceCleanMana = (slaves: number) => {
    const power = CRAFTING_SPEED * (slaves / 3)
    const randomLevel = this.random.levelConversion('raw_mana', 'mana').key
    this._resourceStore.produce(randomLevel, power)
  }

  public hasRawMana = () => {
    return this._resourceStore.getTypeSum('raw_mana')
  }

  public getManaCount = (type: Extract<ResourceTypes, 'liquid_mana' | 'dirty_mana' | 'raw_mana' | 'mana'>) => {
    return this._resourceStore.getTypeSum(type)
  }

  public resetSessionDiggingMana = () =>
    this._session_digging_mana = 0

  get mana_count() {
    return this._resourceStore.getTypeSum('mana')
  }

  get flushed_mana_sum() {
    return this._session_digging_mana
  }
}
