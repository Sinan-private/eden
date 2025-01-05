import {ResourceStoreClass} from "../../../Resource";
import image from '../../../assets/images/Faction4.png';
import {FactionClass} from "./FactionClass.ts";
import {SlaveClass} from "../Slaves/SlaveClass.ts";
import {Game} from "../../context/game.context.ts";
import {calculateManaConversionCoefficients} from "../../constants/gameRules.ts";
import {HARVEST_SPEED} from "../../constants/constants.ts";


export class ArwaClass extends FactionClass {
  constructor(_resourceStore: ResourceStoreClass, _slaves: SlaveClass) {
    const {get} = _resourceStore;
    super(_resourceStore, _slaves)
    this.image = image;
    this.visible = true;
    this._loyalty = get('deception_loyalty');
    this._influence = get('deception_influence');
    this._progress = get('deception_progress');
    this._level = get('deception_level');
  }

  public turnUpdate = (game: Game) => {
    const {behemoth, resources, slaves} = game
    const {can_harvest} = behemoth
    const {produce, getByType} = resources
    const slave_digger = slaves.owned_by_arwa
    if (can_harvest) {
      const dryingCoefficients = calculateManaConversionCoefficients(getByType('dirty_mana'))
      produce('raw_mana_level_1', slave_digger * HARVEST_SPEED * dryingCoefficients[0])
      produce('raw_mana_level_2', slave_digger * HARVEST_SPEED * dryingCoefficients[1])
      produce('raw_mana_level_3', slave_digger * HARVEST_SPEED * dryingCoefficients[2])
      produce('raw_mana_level_4', slave_digger * HARVEST_SPEED * dryingCoefficients[3])
      produce('raw_mana_level_5', slave_digger * HARVEST_SPEED * dryingCoefficients[4])
    }
  }
}
