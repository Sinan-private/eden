import image from '../../../assets/images/Faction2.png';
import {FactionClass} from "./FactionClass.ts";
import {Game, GameBaseClasses} from "../../context/game.context.ts";
import {AUTO_CRAFT, AUTO_SLAVE_HUNT, SLAVE_CREATION} from "../../constants/constants.ts";

// aka the slave hunters and craftsmen
export class MaridClass extends FactionClass {
  public crafting_requested: boolean = AUTO_CRAFT;
  public hunting_requested: boolean = AUTO_SLAVE_HUNT;
  constructor(gameClasses: GameBaseClasses) {
    super(gameClasses)
    const {get} = this.resources;

    this.image = image;
    this.active = true;
    this.visible = true;
    this.loyalty = get('marid_loyalty');
    this.influence = get('marid_influence');
    this.progress = get('marid_progress');
    this.level = get('marid_level');
    this.skill_speed_primary = get('marid_speed_primary_skill');
    this.skill_speed_secondary = get('marid_speed_secondary_skill');
  }

  get is_hunting(): boolean {
    return this.hunting_requested
  }

  get has_slave_caught() {
    const progress_done = this.resources.get('marid_progress').is_max
    const can_enslave = this.slaves.can_enslave;
    return progress_done && can_enslave;
  }


  public turnUpdate = (game: Game) => {

    if (this.crafting_requested && game.mana.hasRawMana()) {
      game.mana.produceCleanMana(game.slaves.marid)
    }
    if (this.is_hunting) {
      this.progress.updateValueBy(SLAVE_CREATION)
    }
    if (this.has_slave_caught) {
      this.progress.setToMin()
      game.slaves.enslave()
    }
  }
}
