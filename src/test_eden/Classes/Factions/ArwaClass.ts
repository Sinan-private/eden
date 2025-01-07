import image from '../../../assets/images/Faction4.png';
import {FactionClass} from "./FactionClass.ts";
import {Game, GameClasses} from "../../context/game.context.ts";
import {AUTO_COLLECT_MANA} from "../../constants/constants.ts";


export class ArwaClass extends FactionClass {
  public collecting_requested: boolean = AUTO_COLLECT_MANA;
  constructor(gameClasses: GameClasses) {
    super(gameClasses)
    const {get} = this.resources;
    this.image = image;
    this.visible = true;
    this.loyalty = get('deception_loyalty');
    this.influence = get('deception_influence');
    this.progress = get('deception_progress');
    this.level = get('deception_level');
  }

  get is_collecting() {
    return this.collecting_requested
      && !this.behemoth.is_flushing_mana
      && !!this.mana.getTypeSum('dirty_mana')
  }

  public turnUpdate = (game: Game) => {
    const {mana, slaves} = game
    if (this.is_collecting) {
      mana.produceRawMana(slaves.arwa)
    }
  }
}
