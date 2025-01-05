import {ResourceStoreClass} from "../../../Resource";
import image from '../../../assets/images/Faction2.png';
import {FactionClass} from "./FactionClass.ts";
import {SlaveClass} from "../Slaves/SlaveClass.ts";
import {Game} from "../../context/game.context.ts";
import {calculateManaConversionCoefficients} from "../../constants/gameRules.ts";
import {CRAFTING_SPEED, SLAVE_CREATION} from "../../constants/constants.ts";

// aka the slave hunters and craftsmen
export class MaridClass extends FactionClass {
  public crafting_requested: boolean = true;
  constructor(_resourceStore: ResourceStoreClass, _slaves: SlaveClass) {
    super(_resourceStore, _slaves)
    const {get} = _resourceStore;

    this.image = image;
    this.active = true;
    this.visible = true;
    this._loyalty = get('slave_hunter_loyalty');
    this._influence = get('slave_hunter_influence');
    this._progress = get('slave_hunter_progress');
    this._level = get('slave_hunter_level');
  }

  get has_slave_caught() {
    const progress_done = this._resourceStore.get('slave_hunter_progress').is_max
    const can_enslave = this._slaves.can_enslave;
    return progress_done && can_enslave;
  }

  public turnUpdate = (game: Game) => {
    const {get, produce, getByType} = game.resources

    if (this.crafting_requested) {
      game.mana.produceCleanMana(game.slaves.marid)
      // const manaConversionCoefficients = calculateManaConversionCoefficients(getByType('raw_mana'))
      // const slave_blacksmiths = this._slaves.marid
      // produce('clean_mana_level_1', slave_blacksmiths * manaConversionCoefficients[0] * CRAFTING_SPEED)
      // produce('clean_mana_level_2', slave_blacksmiths * manaConversionCoefficients[1] * CRAFTING_SPEED)
      // produce('clean_mana_level_3', slave_blacksmiths * manaConversionCoefficients[2] * CRAFTING_SPEED)
      // produce('clean_mana_level_4', slave_blacksmiths * manaConversionCoefficients[3] * CRAFTING_SPEED)
      // produce('clean_mana_level_5', slave_blacksmiths * manaConversionCoefficients[4] * CRAFTING_SPEED)
    }
    const progress = get('slave_hunter_progress')
    progress.updateValueBy(SLAVE_CREATION)
    if (this.has_slave_caught) {
      progress.setToMin()
      game.slaves.enslave(1)
      // game.slaves.addSlave(1)
    }
  }
}
