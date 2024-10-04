// This maps the random value to a range from output start to output end
// Usually used to compare values and get a percentage.

// An example. In a game you often have something like {chance: 7}, {chance: 14}
// Where you want the second one to appear double the amount as the first one. Meaning it maps a set of chances to a percentage.
// In this case the calculation of the first one would be
// input = 7 // the chance
// input_end = 21 // of all chances added (7 + 14)
// All other values are the default

const defaultValues = {
  input_start: 0, // The lowest number of the range input.
  output_start: 0, // The lowest number of the range output.
  output_end: 1, // The largest number of the range output. Currently, set to a percentage range between 0 and 1
}

export const mapMultiply = (
  input: number,
  input_end: number,
  // config?: MapChancesConfigProps,
  input_start = defaultValues.input_start,
  output_end = defaultValues.output_end,
  output_start = defaultValues.output_start,
): number => {
  return output_start + ((output_end - output_start) / (input_end - input_start)) * (input - input_start)
}
