import image from '../../../assets/images/Faction4.png';
import {FactionClass} from "./FactionClass.ts";
import {Game, GameBaseClasses} from "../../context/game.context.ts";
import {AUTO_COLLECT_MANA} from "../../constants/constants.ts";


export class ArwaClass extends FactionClass {
  public collecting_requested: boolean = AUTO_COLLECT_MANA;
  constructor(gameClasses: GameBaseClasses) {
    super(gameClasses)
    const {getByKey} = this.resources;
    this.image = image;
    this.visible = true;
    this.faction = 'arwa';
    this.active = true;
    this.visible = true;
    this.loyalty = getByKey('arwa_loyalty');
    this.influence = getByKey('arwa_influence');
    this.progress = getByKey('arwa_progress');
    this.level = getByKey('arwa_level');
    this.skill_speed_primary = getByKey('arwa_speed_primary_skill');
    this.skill_speed_secondary = getByKey('arwa_speed_secondary_skill');
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
