import {ResourceClass} from "../../Resource";

export class RandomResourceUpdate {
  constructor(
    // resources:
  ) {
  }
  public resourceConversion = (resources: ResourceClass[], to_resources: ResourceClass[]) => {
    const values = resources.map(({value}) => value)
    const index = this._randomIndexFromChances(values)
    return {
      conversion_from: resources[index],
      conversion_to: to_resources[index],
    }
  }
  private _randomIndexFromChances = (values: number[]) => {
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
