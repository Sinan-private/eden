import {getWinnerIndex} from "./mapMultiply";

export type GetProbability<T> = {
  chance: number;
  // [rest: string]: any
} & T

// This is used to select an item out of a list with different possibilities. It doesn't matter how they are provided.
// const testing = [{chance: 10}, {chance: 100}, {chance: 1000}] will work perfectly fine and calculate an accoring chance
// This would ba about 1% for the first, 10% for the second and 89% for the last
export const randomResultFromChances = <T extends object>(
  list: GetProbability<T>[],
  random_value = Math.random(), // mainly here for testing purpose, or if some other script defines the random range
): T => {
  const chances = list.map(({chance}) => chance);
  const index = getWinnerIndex(chances, random_value);
  return list[index] as unknown as T
}
