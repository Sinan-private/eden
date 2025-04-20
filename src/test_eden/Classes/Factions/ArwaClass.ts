import image from '../../../assets/images/Faction4.png';
import {FactionClass} from "./FactionClass.ts";
import {AUTO_COLLECT_MANA} from "../../constants/constants.ts";
import {GameBaseClasses} from "@/test_eden/Classes/Game/gameTypes.ts";
import {GameClass} from "@/test_eden/Classes/Game/GameClass.ts";


export class ArwaClass extends FactionClass {
  public collecting_requested: boolean = AUTO_COLLECT_MANA;
  constructor(private gameClasses: GameBaseClasses) {
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

  get mana_harvesting() {
    return this.gameClasses.gameState.mana_harvesting
  }

  get is_influencing() {
    return true
  }

  public turnUpdate = (game: GameClass) => {
    const {mana, slaves} = game
    if (this.mana_harvesting && this.collecting_requested) {
      mana.produceRawMana(slaves.arwa)
      this.gameClasses.gameState.produceRawMana()
    }
    if (this.is_influencing) {
      this.resources.getByKey('human_influence').updateValueBy(0.1)
    }
  }
}
