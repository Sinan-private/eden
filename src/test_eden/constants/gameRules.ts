import {ResourceClass} from "../../Resource";
import {STAMINA_DRAIN} from "./constants.ts";
import {randomResultFromChances} from "../helpers/randomResultFromChances.ts";

// Instead of fix values I want to take the randomResultFromChances

export function calculateManaConversionCoefficients(manaType: ResourceClass[]): number[] {
  const newList = manaType.map(mana => ({chance: mana.value, mana}))
  const x = randomResultFromChances(newList);
  // console.log(manaType)
  // console.log(newList, x)
  const typeValues = manaType.map(({value}) => value).sort((a, b) => a + b);
  const sum = typeValues.reduce((a, b) => a + b)
  return typeValues.map((value) => value / sum)
}

export const staminaDrain = (speed: number) => speed / 100 * 3 * STAMINA_DRAIN
