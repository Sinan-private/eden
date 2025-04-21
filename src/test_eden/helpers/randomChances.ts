import {getWinnerIndex} from "./mapMultiply";
import {ResourceClass, ResourceKeys} from "../../Game/Resource";

// Todo This needs to be cleaned. Possibly a class because I love classes

export type GetProbability<T> = {
  chance: number;
  // [rest: string]: any
} & T

// This is used to select an item out of a list with different possibilities. It doesn't matter how they are provided.
// const testing = [{chance: 10}, {chance: 100}, {chance: 1000}] will work perfectly fine and calculate an accoring chance
// This would ba about 1% for the first, 10% for the second and 89% for the last
export const randomChances = <T extends object>(
  list: GetProbability<T>[],
  random_value = Math.random(), // mainly here for testing purpose, or if some other script defines the random range
): T => {
  const chances = list.map(({chance}) => chance);
  const index = getWinnerIndex(chances, random_value);
  return list[index] as unknown as T
}

export const randomResourceByChance = (resources: ResourceClass[]) =>
  resources.map(resource => ({chance: resource.value, resource}))


export const randomResourceRaise = (
  resources: ResourceClass[],
  power: number
) => {
  // I need the
  // const x = resources.s
  const emptyList =  Array.from(Array(Math.ceil(power)))
  const chanceList = emptyList.map(() =>
    // creating a list of results where the current amount of the resource in the list becomes the chance
    randomChances(randomResourceByChance(resources))
      .resource
      .key
  )
  // console.log(resources, power)
  // console.log(chanceList)
  return countOccurrencesByLevel(chanceList)
}


type Levels = 'level_1' | 'level_2' | 'level_3' | 'level_4' | 'level_5'
function countOccurrencesByLevel(list: ResourceKeys[]): Record<Levels, number> {
  return list.reduce((acc, item) => {
    const levelKey = item.match(/level_\d+/)?.[0] || "unknown";
    acc[levelKey as Levels] = (acc[levelKey as Levels] || 0) + 0.25;
    return acc;
  }, {} as Record<Levels, number>);
}
