import {ResourceStoreClass, ResourceTypes} from "../../../Resource";
import {CRAFTING_SPEED, DRYING_SPEED, FLUSHING_SPEED, HARVEST_SPEED} from "../../constants/constants.ts";
import {RandomResourceUpdate} from "../RandomResourceUpdate.ts";


export class ManaClass {
  private _finding_chance_level_1: number = 1
  private _finding_chance_level_2: number = 1/20
  private _finding_chance_level_3: number = 1/300
  private _finding_chance_level_4: number = 1/4000
  private _finding_chance_level_5: number = 1/50000
  constructor(private _resourceStore: ResourceStoreClass) {
  }

  // I want to use this for every time mana is randomly generated. For now only flushing
  private getRandomMultiplier = (chance: number) => {
    // The lower the amount the higher the range of possible results can be
    const random = Math.random() * (1 / chance)
    // I want the multipler to be 1 if it is within the finding chance and 0 if not. So randomness should be possible
    // for each single request
    return random <= 1 ? 1 : 0 as number
  }
  private getRandomAmount = (chance: number, amount: number) => {
    return Array.from(Array(Math.round(amount)))
      .map(() => this.getRandomMultiplier(chance))
      .reduce((a, b) => a + b, 0);
  }

  // This can be replaced by the resource store one
  public getTypeSum = (type: ResourceTypes) =>
    this._resourceStore.getTypeSum(type)

  // This comes from flushing. Nothing more is needed to do than just flushing
  public produceLiquidMana = () => {
    const {get} = this._resourceStore
    const digging_depth = this._resourceStore.get("behemoth_digging_depth").value;
    const power = (digging_depth / 10) * FLUSHING_SPEED
    const getRaise = (chance: number) =>
      this.getRandomAmount(chance, power)
    get('liquid_mana_level_1').updateValueBy(getRaise(this._finding_chance_level_1))
    get('liquid_mana_level_2').updateValueBy(getRaise(this._finding_chance_level_2))
    get('liquid_mana_level_3').updateValueBy(getRaise(this._finding_chance_level_3))
    get('liquid_mana_level_4').updateValueBy(getRaise(this._finding_chance_level_4))
    get('liquid_mana_level_5').updateValueBy(getRaise(this._finding_chance_level_5))
  }

  // This comes from liquid mana. It doesn't need any interaction. Just time to dry
  public produceDirtyMana = () => {
    const {produce, getByType} = this._resourceStore
    const random_conversion = new RandomResourceUpdate().resourceConversion(
      getByType('liquid_mana'),
      getByType('dirty_mana'),
    )
    console.log(random_conversion.conversion_to.key, DRYING_SPEED)
    produce(random_conversion.conversion_to.key, DRYING_SPEED)

    // const raise = randomResourceRaise(getByType('liquid_mana'), DRYING_SPEED)
    // produce('dirty_mana_level_1', raise.level_1)
    // produce('dirty_mana_level_2', raise.level_2)
    // produce('dirty_mana_level_3', raise.level_3)
    // produce('dirty_mana_level_4', raise.level_4)
    // produce('dirty_mana_level_5', raise.level_5)
  }

  public produceRawMana = (slaves: number) => {
    const {produce, getByType} = this._resourceStore
    const power = (slaves / 2) * HARVEST_SPEED
    // const raise = randomResourceRaise(getByType('dirty_mana'), power)
    const random_conversion = new RandomResourceUpdate().resourceConversion(
      getByType('dirty_mana'),
      getByType('raw_mana'),
    )
    console.log(random_conversion.conversion_to.key, power)
    produce(random_conversion.conversion_to.key, power)
    // console.log(power, random_conversion.conversion_from.value)
    // console.log(raise,random_conversion)


    // produce('raw_mana_level_1', raise.level_1)
    // produce('raw_mana_level_2', raise.level_2)
    // produce('raw_mana_level_3', raise.level_3)
    // produce('raw_mana_level_4', raise.level_4)
    // produce('raw_mana_level_5', raise.level_5)
  }

  public produceCleanMana = (slaves: number) => {
    const {produce, getByType} = this._resourceStore
    const power = CRAFTING_SPEED * (slaves / 3)
    const random_conversion = new RandomResourceUpdate().resourceConversion(
      getByType('raw_mana'),
      getByType('mana'),
    )
    produce(random_conversion.conversion_to.key, power)
  }

  public hasRawMana = () => {
    return this._resourceStore.getTypeSum('raw_mana')
  }

  get mana_count() {
    return this.getTypeSum('mana')
  }
}
