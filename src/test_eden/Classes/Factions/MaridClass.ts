import image from '../../../assets/images/Faction2.png';
import {FactionClass} from "./FactionClass.ts";
import {Game, GameClasses} from "../../context/game.context.ts";
import {SLAVE_CREATION} from "../../constants/constants.ts";

// aka the slave hunters and craftsmen
export class MaridClass extends FactionClass {
  public crafting_requested: boolean = true;
  public hunting_requested: boolean = true;
  constructor(gameClasses: GameClasses) {
    super(gameClasses)
    const {get} = this._resourceStore;

    this.image = image;
    this.active = true;
    this.visible = true;
    this.loyalty = get('slave_hunter_loyalty');
    this.influence = get('slave_hunter_influence');
    this.progress = get('slave_hunter_progress');
    this.level = get('slave_hunter_level');
  }

  get is_hunting(): boolean {
    return this.hunting_requested
  }

  get has_slave_caught() {
    const progress_done = this._resourceStore.get('slave_hunter_progress').is_max
    const can_enslave = this._slaves.can_enslave;
    return progress_done && can_enslave;
  }


  public turnUpdate = (game: Game) => {

    if (this.crafting_requested) {
      game.mana.produceCleanMana(game.slaves.marid)
    }
    if (this.is_hunting) {
      this.progress.updateValueBy(SLAVE_CREATION)
    }
    if (this.has_slave_caught) {
      this.progress.setToMin()
      game.slaves.enslave(1)
    }
  }
}
