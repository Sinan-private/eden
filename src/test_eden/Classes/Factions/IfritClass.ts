import image from '../../../assets/images/Faction1.png';
import {FactionClass} from "./FactionClass.ts";
import {GameClasses} from "../../context/game.context.ts";

// This is the one with the demon image
export class IfritClass extends FactionClass {
  constructor(gameClasses: GameClasses) {
    super(gameClasses)
    const {get} = this._resourceStore;
    this.image = image;
    this.loyalty = get('demon_loyalty');
    this.influence = get('demon_influence');
    this.progress = get('demon_progress');
    this.level = get('demon_level');
  }
}
