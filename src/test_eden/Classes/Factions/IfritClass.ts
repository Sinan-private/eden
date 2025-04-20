import image from '../../../assets/images/Faction1.png';
import {FactionClass} from "./FactionClass.ts";

import {GameBaseClasses} from "@/test_eden/Classes/Game/gameTypes.ts";

// This is the one with the demon image
export class IfritClass extends FactionClass {
  constructor(gameClasses: GameBaseClasses) {
    super(gameClasses)
    const {getByKey} = this.resources;
    this.image = image;
    this.faction = 'ifrit';
    this.loyalty = getByKey('ifrit_loyalty');
    this.influence = getByKey('ifrit_influence');
    this.progress = getByKey('ifrit_progress');
    this.level = getByKey('ifrit_level');
    this.skill_speed_primary = getByKey('ifrit_speed_primary_skill');
    this.skill_speed_secondary = getByKey('ifrit_speed_secondary_skill');
  }
}
