import {ResourceClass} from "../../Resource";

export class RandomResourceUpdate {
  constructor(
    // resources:
  ) {
  }
  public resourceConversion = (resources: ResourceClass[], to_resources: ResourceClass[]) => {
    const values = resources.map(({value}) => value)
    const index = this._randomIndexFromChances(values)
    return to_resources[index];
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

const mapMultiply = (
  input: number,
  input_end: number,
  // config?: MapChancesConfigProps,
  input_start = defaultValues.input_start,
  output_end = defaultValues.output_end,
  output_start = defaultValues.output_start,
): number => {
  return output_start + ((output_end - output_start) / (input_end - input_start)) * (input - input_start)
}

const defaultValues = {
  input_start: 0, // The lowest number of the range input.
  output_start: 0, // The lowest number of the range output.
  output_end: 1, // The largest number of the range output. Currently, set to a percentage range between 0 and 1
}