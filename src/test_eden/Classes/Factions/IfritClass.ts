import image from '../../../assets/images/Faction1.png';
import {FactionClass} from "./FactionClass.ts";
import {GameBaseClasses} from "../../context/game.context.ts";

// This is the one with the demon image
export class IfritClass extends FactionClass {
  constructor(gameClasses: GameBaseClasses) {
    super(gameClasses)
    const {get} = this.resources;
    this.image = image;
    this.faction = 'ifrit';
    this.loyalty = get('ifrit_loyalty');
    this.influence = get('ifrit_influence');
    this.progress = get('ifrit_progress');
    this.level = get('ifrit_level');
    this.skill_speed_primary = get('ifrit_speed_primary_skill');
    this.skill_speed_secondary = get('ifrit_speed_secondary_skill');
  }
}
