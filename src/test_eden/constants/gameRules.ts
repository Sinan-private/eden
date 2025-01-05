import {ResourceClass} from "../../Resource";
import {STAMINA_DRAIN} from "./constants.ts";

export function calculateManaConversionCoefficients(manaType: ResourceClass[]): number[] {
  const typeValues = manaType.map(({value}) => value).sort((a, b) => a + b);
  const sum = typeValues.reduce((a, b) => a + b)
  return typeValues.map((value) => value / sum)
}

export const staminaDrain = (speed: number) => speed / 100 * 3 * STAMINA_DRAIN
