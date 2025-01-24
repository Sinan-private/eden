import image from '../../../assets/images/Faction3.png';
import {FactionClass} from "./FactionClass.ts";
import {GameBaseClasses} from "../../context/game.context.ts";


export class GhoulClass extends FactionClass {
  constructor(gameClasses: GameBaseClasses) {
    super(gameClasses)
    const {get} = this.resources;
    this.image = image;
    this.visible = true;
    this.faction = 'ghoul';
    this.loyalty = get('ghoul_loyalty');
    this.influence = get('ghoul_influence');
    this.progress = get('ghoul_progress');
    this.level = get('ghoul_level');
    this.skill_speed_primary = get('ghoul_speed_primary_skill');
    this.skill_speed_secondary = get('ghoul_speed_secondary_skill');
  }
}
