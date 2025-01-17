import {ResourceStoreClass, ResourceTypes} from "../../Resource";

export class RandomResourceUpdate {
  constructor(
    private _resourceStore: ResourceStoreClass
  ) {

  }
  // I want to use this for every time something could be randomly generated. Checks against a chance and returns 0 or 1
  private _single_chance = (chance: number) => {
    // The lower the amount the higher the range of possible results can be
    const random = Math.random() * (1 / chance)
    // I want the multipler to be 1 if it is within the finding chance and 0 if not. So randomness should be possible
    // for each single request
    return random <= 1 ? 1 : 0 as number
  }
  // A chance of 0.5 and an amount of 10 is expected to be around 5.
  // The evaluation will run 10 times with a 50% chance
  public chance = (chance: number, amount = 1) => {
    return Array.from(Array(Math.round(amount)))
      .map(() => this._single_chance(chance))
      .reduce((a, b) => a + b, 0);
  }

  public levelConversion = (from_type: ResourceTypes, to_type: ResourceTypes) => {
    const {getByType} = this._resourceStore
    // A map of the current values serves as chances
    const values = getByType(from_type).map(({value}) => value)
    // The random index level serves as index for the outcome
    // NOTE! This only works if both types have the same amount of entries!
    const index = this._randomIndexFromChances(values)
    return getByType(to_type)[index];
  }

    _randomIndexFromChances = (values: number[]) => {
    // If a value like this [5, 3, 2] is provided there is a random value between 1 and 10 (the sum) generated.
    // The return is the index of the array. In this case there would be chances like [50%, 30%, 20%]
    const chance_sum = values.reduce((a, b) => a + b)
    const random_range = Math.random() * chance_sum;
    let cumulativeWeight = 0
    for (let i = 0; i < values.length; i++) {
      cumulativeWeight += values[i];
      if (random_range < cumulativeWeight) {
        return i;
      }
    }
    return cumulativeWeight;
  }
}
