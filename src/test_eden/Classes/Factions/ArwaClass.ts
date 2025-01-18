import image from '../../../assets/images/Faction4.png';
import {FactionClass} from "./FactionClass.ts";
import {Game, GameBaseClasses} from "../../context/game.context.ts";
import {AUTO_COLLECT_MANA} from "../../constants/constants.ts";


export class ArwaClass extends FactionClass {
  public collecting_requested: boolean = AUTO_COLLECT_MANA;
  constructor(gameClasses: GameBaseClasses) {
    super(gameClasses)
    const {get} = this.resources;
    this.image = image;
    this.visible = true;
    this.loyalty = get('arwa_loyalty');
    this.influence = get('arwa_influence');
    this.progress = get('arwa_progress');
    this.level = get('arwa_level');
    this.skill_speed_primary = get('arwa_speed_primary_skill');
    this.skill_speed_secondary = get('arwa_speed_secondary_skill');
  }

  get is_collecting() {
    return this.collecting_requested
      && !this.behemoth.is_flushing_mana
      && !this.behemoth.is_moving
      && !!this.resources.getTypeSum('dirty_mana')
  }

  public turnUpdate = (game: Game) => {
    const {mana, slaves} = game
    if (this.is_collecting) {
      mana.produceRawMana(slaves.arwa)
    }
  }
}
