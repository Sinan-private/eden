import image from '../../../assets/images/Faction2.png';
import {FactionClass} from "./FactionClass.ts";
import {AUTO_CRAFT, AUTO_SLAVE_HUNT, SLAVE_CREATION} from "../../constants/constants.ts";
import {GameBaseClasses} from "@/Game/Classes/Game/gameTypes.ts";
import {GameClass} from "@/Game/Classes/GameClass.ts";


// aka the slave hunters and craftsmen
export class MaridClass extends FactionClass {
  public crafting_requested: boolean = AUTO_CRAFT;
  public hunting_requested: boolean = AUTO_SLAVE_HUNT;
  constructor(private gameClasses: GameBaseClasses) {
    super(gameClasses)
    const {getByKey} = this.resources;
    this.faction = 'marid';
    this.image = image;
    this.active = true;
    this.visible = true;
    this.loyalty = getByKey('marid_loyalty');
    this.influence = getByKey('marid_influence');
    this.progress = getByKey('marid_progress');
    this.level = getByKey('marid_level');
    this.skill_speed_primary = getByKey('marid_speed_primary_skill');
    this.skill_speed_secondary = getByKey('marid_speed_secondary_skill');
  }

  get is_hunting(): boolean {
    const slaves_roaming = this.gameClasses.resources.getByKey('slaves_roaming').value >= 1
    return this.hunting_requested
      && slaves_roaming
  }

  get has_slave_caught() {
    const progress_done = this.resources.getByKey('marid_progress').is_max
    const can_enslave = !!this.resources.getByKey('slaves_roaming').value
    return progress_done && can_enslave;
  }


  public turnUpdate = (game: GameClass) => {

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
