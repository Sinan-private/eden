import {ResourceStoreClass, ResourceTypes} from "../../../Resource";
import {calculateManaConversionCoefficients} from "../../constants/gameRules.ts";
import {CRAFTING_SPEED, DRYING_SPEED, FLUSHING_SPEED, HARVEST_SPEED} from "../../constants/constants.ts";


export class ManaClass {
  private _finding_chance_level_1: number = 1
  private _finding_chance_level_2: number = 0.2
  private _finding_chance_level_3: number = 0.03
  private _finding_chance_level_4: number = 0.004
  private _finding_chance_level_5: number = 0.0005
  constructor(private _resourceStore: ResourceStoreClass) {
  }

  // Todo I want to use this for every time mana is randomly generated. For now only flushing
  private getRandomMultiplier = (chance: number) => {
    // The lower the amount the higher the range of possible results can be
    const random = Math.random() * (1 / chance)
    // I want the multipler to be 1 if it is within the finding chance and 0 if not. So randomness should be possible
    // for each single request
    return random <= 1 ? 1 : 0 as number
  }
  private getRandomAmount = (chance: number, amount: number) => {
    return Array.from(Array(Math.round(amount)).keys())
      .map(() => this.getRandomMultiplier(chance))
      .reduce((a, b) => a + b, 0);
  }

  public getTypeSum = (type: ResourceTypes) => {
    const resources = this._resourceStore.getByType(type)
    const sum = resources.reduce((sum, {value}) => (sum + Math.floor(value)), 0)
    return Math.floor(Math.floor(sum))
  }

  // This comes from flushing. Nothing more is needed to do than just flushing
  public produceLiquidMana = () => {
    const {get} = this._resourceStore
    const digging_depth = this._resourceStore.get("behemoth_digging_depth").value;
    const power = digging_depth * FLUSHING_SPEED
    console.log(power)
    // const randomMana = this._createLiquidFindings(power);
    // randomMana.forEach(([key, value]) => {
    //   get(key).updateValueBy(value)
    // })
    get('liquid_mana_level_1').updateValueBy(this.getRandomAmount(this._finding_chance_level_1, power))
    get('liquid_mana_level_2').updateValueBy(this.getRandomAmount(this._finding_chance_level_2, power))
    get('liquid_mana_level_3').updateValueBy(this.getRandomAmount(this._finding_chance_level_3, power))
    get('liquid_mana_level_4').updateValueBy(this.getRandomAmount(this._finding_chance_level_4, power))
    get('liquid_mana_level_5').updateValueBy(this.getRandomAmount(this._finding_chance_level_5, power))
  }

  // This comes from liquid mana. It doesn't need any interaction. Just time to dry
  public produceDirtyMana = () => {
    const {produce, getByType} = this._resourceStore

    const dryingCoefficients = calculateManaConversionCoefficients(getByType('liquid_mana'))
    produce('dirty_mana_level_1', DRYING_SPEED * dryingCoefficients[0])
    produce('dirty_mana_level_2', DRYING_SPEED * dryingCoefficients[1])
    produce('dirty_mana_level_3', DRYING_SPEED * dryingCoefficients[2])
    produce('dirty_mana_level_4', DRYING_SPEED * dryingCoefficients[3])
    produce('dirty_mana_level_5', DRYING_SPEED * dryingCoefficients[4])
  }

  public produceRawMana = (slaves: number) => {
    const {produce, getByType} = this._resourceStore
    const collectingCoefficients = calculateManaConversionCoefficients(getByType('liquid_mana'))
    produce('raw_mana_level_1', slaves * HARVEST_SPEED * collectingCoefficients[0])
    produce('raw_mana_level_2', slaves * HARVEST_SPEED * collectingCoefficients[1])
    produce('raw_mana_level_3', slaves * HARVEST_SPEED * collectingCoefficients[2])
    produce('raw_mana_level_4', slaves * HARVEST_SPEED * collectingCoefficients[3])
    produce('raw_mana_level_5', slaves * HARVEST_SPEED * collectingCoefficients[4])
  }

  public produceCleanMana = (slaves: number) => {
    const {produce, getByType} = this._resourceStore
    const manaConversionCoefficients = calculateManaConversionCoefficients(getByType('raw_mana'))
    produce('clean_mana_level_1', slaves * manaConversionCoefficients[0] * CRAFTING_SPEED)
    produce('clean_mana_level_2', slaves * manaConversionCoefficients[1] * CRAFTING_SPEED)
    produce('clean_mana_level_3', slaves * manaConversionCoefficients[2] * CRAFTING_SPEED)
    produce('clean_mana_level_4', slaves * manaConversionCoefficients[3] * CRAFTING_SPEED)
    produce('clean_mana_level_5', slaves * manaConversionCoefficients[4] * CRAFTING_SPEED)
  }

  get mana_count() {
    return this.getTypeSum('mana')
  }
}
