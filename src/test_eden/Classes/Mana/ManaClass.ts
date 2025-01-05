import {ResourceStoreClass, ResourceTypes} from "../../../Resource";
import {calculateManaConversionCoefficients} from "../../constants/gameRules.ts";
import {CRAFTING_SPEED, DRYING_SPEED, FLUSHING_SPEED, HARVEST_SPEED, MANA_FINDINGS} from "../../constants/constants.ts";

export class ManaClass {
  constructor(private _resourceStore: ResourceStoreClass) {
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
    get('liquid_mana_level_1').updateValueBy(digging_depth * FLUSHING_SPEED / MANA_FINDINGS[0])
    get('liquid_mana_level_2').updateValueBy(digging_depth * FLUSHING_SPEED / MANA_FINDINGS[1])
    get('liquid_mana_level_3').updateValueBy(digging_depth * FLUSHING_SPEED / MANA_FINDINGS[2])
    get('liquid_mana_level_4').updateValueBy(digging_depth * FLUSHING_SPEED / MANA_FINDINGS[3])
    get('liquid_mana_level_5').updateValueBy(digging_depth * FLUSHING_SPEED / MANA_FINDINGS[4])
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
    const dryingCoefficients = calculateManaConversionCoefficients(getByType('liquid_mana'))
    produce('raw_mana_level_1', slaves * HARVEST_SPEED * dryingCoefficients[0])
    produce('raw_mana_level_2', slaves * HARVEST_SPEED * dryingCoefficients[1])
    produce('raw_mana_level_3', slaves * HARVEST_SPEED * dryingCoefficients[2])
    produce('raw_mana_level_4', slaves * HARVEST_SPEED * dryingCoefficients[3])
    produce('raw_mana_level_5', slaves * HARVEST_SPEED * dryingCoefficients[4])
  }

  public produceCleanMana = (slaves: number) => {
    // const manaConversionCoefficients = calculateManaConversionCoefficients(getByType('raw_mana'))
    // const slave_blacksmiths = get('slave_blacksmiths').value
    // produce('clean_mana_level_1', slave_blacksmiths * manaConversionCoefficients[0] * CRAFTING_SPEED)
    // produce('clean_mana_level_2', slave_blacksmiths * manaConversionCoefficients[1] * CRAFTING_SPEED)
    // produce('clean_mana_level_3', slave_blacksmiths * manaConversionCoefficients[2] * CRAFTING_SPEED)
    // produce('clean_mana_level_4', slave_blacksmiths * manaConversionCoefficients[3] * CRAFTING_SPEED)
    // produce('clean_mana_level_5', slave_blacksmiths * manaConversionCoefficients[4] * CRAFTING_SPEED)
  }

  get mana_count() {
    return this.getTypeSum('mana')
  }
}