import {ResourceStoreClass, ResourceTypes} from "../../../Resource";
import {CRAFTING_SPEED, DRYING_SPEED, FLUSHING_SPEED, HARVEST_SPEED} from "../../constants/constants.ts";
import {RandomResourceUpdate} from "../RandomResourceUpdate.ts";

export class ManaClass {
  private _finding_chance_level_1: number = 1
  private _finding_chance_level_2: number = 1/20
  private _finding_chance_level_3: number = 1/300
  private _finding_chance_level_4: number = 1/4000
  private _finding_chance_level_5: number = 1/50000
  private random: RandomResourceUpdate;
  constructor(private _resourceStore: ResourceStoreClass) {
    this.random = new RandomResourceUpdate(_resourceStore);
  }

  // This comes from flushing. Nothing more is needed to do than just flushing
  public produceLiquidMana = () => {
    const {getByKey} = this._resourceStore
    const digging_depth = this._resourceStore.getByKey("behemoth_digging_depth").value;
    const power = (digging_depth / 10) * FLUSHING_SPEED
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
    const power = (slaves / 4) * HARVEST_SPEED
    const randomLevel = this.random.levelConversion('dirty_mana', 'raw_mana').key
    this._resourceStore.produce(randomLevel, power)
  }

  public produceCleanMana = (slaves: number) => {
    const power = CRAFTING_SPEED * (slaves / 6)
    const randomLevel = this.random.levelConversion('raw_mana', 'mana').key
    this._resourceStore.produce(randomLevel, power)
  }

  public hasRawMana = () => {
    return this._resourceStore.getTypeSum('raw_mana')
  }

  public getManaCount = (type: Extract<ResourceTypes, 'liquid_mana' | 'dirty_mana' | 'raw_mana' | 'mana'>) => {
    return this._resourceStore.getTypeSum(type)
  }

  private _diggingMana = () => {
    const {getByType} = this._resourceStore
    return getByType('liquid_mana').concat(getByType('dirty_mana'))
  }

  public resetSessionDiggingMana = () => {
    const {getByType} = this._resourceStore
    console.log('me stopping')
    const toClear = getByType('liquid_mana')
    toClear.forEach(mana => {
      mana.resetSession()
    })
  }

  public resetDiggingMana = () => {
    const {getByType} = this._resourceStore
    const toClear = getByType('liquid_mana').concat(getByType('dirty_mana'))
    toClear.forEach(mana => {
      mana.setValueTo(0)
      mana.resetSession()
    })
  }

  get mana_count() {
    return this._resourceStore.getTypeSum('mana')
  }

  get flushed_mana_sum() {
    return 10
  }
}
