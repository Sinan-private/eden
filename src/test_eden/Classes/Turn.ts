import {useGame} from "../context/game.context.ts";
import {ResourceClass} from "../../Resource";

const FLUSHING_SPEED = 0.25;
const DRYING_SPEED = 2;
const HARVEST_SPEED = 0.25;
const CRAFTING_SPEED = 0.15;
const MANA_FINDINGS = [1, 20, 300, 4000, 50000];
const STAMINA_DRAIN = 1.5
const STAMINA_REGEN = 0.3
// const STAMINA_DRAIN = 200
// const STAMINA_REGEN = 1
const STAMINA_REGEN_ON_FLUSHING = 0.05
const SLAVE_CREATION = 1


const staminaDrain = (speed: number) => speed / 100 * 3 * STAMINA_DRAIN
const flushMana = (
  liquid_mana: ResourceClass,
  digging_depth: number,
  i: number,
) =>
  liquid_mana.updateValueBy(digging_depth * FLUSHING_SPEED / MANA_FINDINGS[i])

export class Turn {
  constructor(private _game: ReturnType<typeof useGame>) {
  }

  public maridTurnUpdate = () => {
    const {crafting_requested} = this._game.factions.factionMarid;
    const {get, produce, getByType} = this._game.resources

    if (crafting_requested) {
      const manaConversionCoefficients = calculateManaConversionCoefficients(getByType('raw_mana'))
      const slave_blacksmiths = get('slave_blacksmiths').value
      produce('clean_mana_level_1', slave_blacksmiths * manaConversionCoefficients[0] * CRAFTING_SPEED)
      produce('clean_mana_level_2', slave_blacksmiths * manaConversionCoefficients[1] * CRAFTING_SPEED)
      produce('clean_mana_level_3', slave_blacksmiths * manaConversionCoefficients[2] * CRAFTING_SPEED)
      produce('clean_mana_level_4', slave_blacksmiths * manaConversionCoefficients[3] * CRAFTING_SPEED)
      produce('clean_mana_level_5', slave_blacksmiths * manaConversionCoefficients[4] * CRAFTING_SPEED)
    }
    const progress = get('slave_hunter_progress')
    progress.updateValueBy(SLAVE_CREATION)
    if (progress.is_max && !this._game.slaves.is_max) {
      progress.setToMin()
      this._game.slaves.addSlave(1)
    }
  }

  public arwaTurnUpdate = () => {
    const {
      can_harvest,
    } = this._game.behemoth
    const {produce, getByType} = this._game.resources
    const slave_digger = this._game.slaves.owned_by_arwa
    if (can_harvest) {
      const dryingCoefficients = calculateManaConversionCoefficients(getByType('dirty_mana'))
      produce('raw_mana_level_1', slave_digger * HARVEST_SPEED * dryingCoefficients[0])
      produce('raw_mana_level_2', slave_digger * HARVEST_SPEED * dryingCoefficients[1])
      produce('raw_mana_level_3', slave_digger * HARVEST_SPEED * dryingCoefficients[2])
      produce('raw_mana_level_4', slave_digger * HARVEST_SPEED * dryingCoefficients[3])
      produce('raw_mana_level_5', slave_digger * HARVEST_SPEED * dryingCoefficients[4])
    }
  }

  public behemothTurnUpdate = () => {
    const {
      can_harvest,
      is_still,
      should_flush,
      climb_speed,
      climb_height,
      digging_depth,
      flushing_depth,
      drying_delay,
      stamina,
      acid,
      liquid_mana,
      should_move,
      should_stop_moving,
      should_dig,
      is_flushing_mana,
      stopClimbing,
    } = this._game.behemoth
    const {get, produce, getByType} = this._game.resources
    const speed = climb_speed
    const height = climb_height
    if (should_move) {
      speed.updateValueBy(0.2)
      height.updateValueBy(speed.value)
      stamina.updateValueBy(-staminaDrain(speed.value))
    }
    if (should_stop_moving) {
      stopClimbing()
      speed.updateValueBy(-1)
      height.updateValueBy(speed.value)
    }
    if (is_still) {
      stamina.updateValueBy(STAMINA_REGEN)
    }
    if (should_dig) {
      digging_depth.updateValueBy(get('slave_diggers').value)
    }
    if (should_flush) {
      stamina.updateValueBy(STAMINA_REGEN_ON_FLUSHING)
      flushing_depth.updateValueBy(10)
      acid.updateValueBy(-10)
      if (is_flushing_mana) {
        (getByType('liquid_mana')).forEach(
          (mana, i) =>
            flushMana(mana, digging_depth.value, i))
      }
    } else {
      flushing_depth.updateValueBy(-1)
    }
    if (liquid_mana) {
      get('behemoth_drying_delay').updateValueBy(-1)
    }
    //   As long as there is liquid mana it dries
    const isDrying = !!liquid_mana && !drying_delay.value
    const slave_digger = get('slave_diggers').value
    if (isDrying) {
      const dryingCoefficients = calculateManaConversionCoefficients(getByType('liquid_mana'))
      produce('dirty_mana_level_1', DRYING_SPEED * dryingCoefficients[0])
      produce('dirty_mana_level_2', DRYING_SPEED * dryingCoefficients[1])
      produce('dirty_mana_level_3', DRYING_SPEED * dryingCoefficients[2])
      produce('dirty_mana_level_4', DRYING_SPEED * dryingCoefficients[3])
      produce('dirty_mana_level_5', DRYING_SPEED * dryingCoefficients[4])
    }
  }
}

function calculateManaConversionCoefficients(liquidMana: ResourceClass[]): number[] {
  const liquidValues = liquidMana.map(({value}) => value).sort((a, b) => a + b);
  const sum = liquidValues.reduce((a, b) => a + b)
  return liquidValues.map((value) => value / sum)
}
