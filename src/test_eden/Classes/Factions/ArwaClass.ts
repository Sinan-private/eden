import {ResourceStoreClass} from "../../../Resource";
import image from '../../../assets/images/Faction4.png';
import {FactionClass} from "./FactionClass.ts";
import {SlaveClass} from "../Slaves/SlaveClass.ts";
import {Game} from "../../context/game.context.ts";


export class ArwaClass extends FactionClass {
  public collecting_requested: boolean = false;
  constructor(_resourceStore: ResourceStoreClass, _slaves: SlaveClass) {
    const {get} = _resourceStore;
    super(_resourceStore, _slaves)
    this.image = image;
    this.visible = true;
    this.loyalty = get('deception_loyalty');
    this.influence = get('deception_influence');
    this.progress = get('deception_progress');
    this.level = get('deception_level');
  }

  // get is_collecting() {
  //   return this.collecting_requested && game.behemoth.is_flushing_mana
  // }

  public turnUpdate = (game: Game) => {
    const {behemoth, slaves} = game
    if (!behemoth.is_flushing_mana) {
      game.mana.produceRawMana(slaves.arwa)
    }
  }
}
