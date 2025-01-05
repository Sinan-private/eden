import {ResourceClass} from "../../Resource";
import {FLUSHING_SPEED, MANA_FINDINGS, STAMINA_DRAIN} from "./constants.ts";

export function calculateManaConversionCoefficients(manaType: ResourceClass[]): number[] {
  const typeValues = manaType.map(({value}) => value).sort((a, b) => a + b);
  const sum = typeValues.reduce((a, b) => a + b)
  return typeValues.map((value) => value / sum)
}

export const staminaDrain = (speed: number) => speed / 100 * 3 * STAMINA_DRAIN
export const flushMana = (
  liquid_mana: ResourceClass,
  digging_depth: number,
  i: number,
) =>
  liquid_mana.updateValueBy(digging_depth * FLUSHING_SPEED / MANA_FINDINGS[i])
