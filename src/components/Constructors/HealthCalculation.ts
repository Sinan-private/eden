import {ProgressProps} from "@/components/ui/progress.tsx";
import {makeAutoObservable} from "mobx";

type StatusColor = ProgressProps['color']

const DEFAULT_VALUE = 55;
const DEFAULT_COLOR: StatusColor = 'green';

export type HealthValueProps = {
  value: number; // I have 15
  min?: number; // the min is 10
  max: number; // the max is 20 -> Meaning I would expect to have 50%
};
export type HealthProps = {
  thresholds?: (HealthValueProps | number)[]; // The indicators shown on the health Bar. An array of values between 0 and 100
  // percentageValue?: number; // To directly set a value to the bar. Between 0 and 100
  value?: HealthValueProps | number | null; // If a number is provided this is expected to be a percentage between 0 and 100
  // Instead a range can be passed to dynamically calculate the bar percentage.
  // A value must be provided in the object, the 'min' defaults to 0, the "max" defaults to 100
  // {value: 15, min: 10, max: 20} -> I have 15, the range is between 10 and 20, meaning 50%. The actual values are still shown in Details
  color?: StatusColor | StatusColor[]; // Either a color for the whole Bar, or an array for each segment, where the color decision is made within the Bar component.
  // Remember that an array of colors expects 1 color more than the provided number of segments. 1 segment creates 2 parts.
}

export class HealthCalculation {
  public readonly value: number;
  public readonly thresholds: number[];
  public readonly minThreshold: number;
  public readonly maxThreshold: number;
  public readonly color: StatusColor;

  constructor(props: HealthProps) {
    const value = getHealth(props.value, DEFAULT_VALUE);
    const thresholds = props.thresholds
      ? props.thresholds
        .map(toNumber)
        .concat([0, 100])
        .filter(unique)
        .sort(ascending)
      : []
    const thresholdsToRender = thresholds.filter(threshold => ![0, 100].includes(threshold))
    this.color = getStatusColor(value, thresholds, props.color);
    this.minThreshold = thresholds[0] || 0;
    this.maxThreshold = thresholds[thresholds.length - 1] || 100;
    this.value = value;
    this.thresholds = thresholdsToRender;
    if (hasWrongColorLength(props.color, thresholds)) {
      console.error(`When providing an array of colors, it needs to be one shorter then the array of thresholds. You provided thresholds: ${thresholds}; color: ${props.color}`)
    }
    makeAutoObservable(this)
  }

  public readonly getValueFromList = <T>(list: T[], thresholds = this.thresholds, value = this.value) =>
    list[findIndexInThreshold(thresholds, value)];

  public readonly getHealth = (defaultValue: number) => getHealth(this.value, defaultValue);
}

const hasWrongColorLength = (color: HealthProps['color'], thresholds: number[]) =>
  Array.isArray(color)
  && thresholds.length
  && color.length !== thresholds.length - 1


const toNumber = (segment: number | HealthValueProps): number => getHealth(segment, -1);
const unique = (value: number, index: number, array: number[]) => array.indexOf(value) === index;
const ascending = (a: number, b: number) => a - b;

const getStatusColor = (
  value: number,
  segments?: number[],
  color?: StatusColor | StatusColor[],
): StatusColor => {
  if (typeof color === 'string') return color
  if (segments?.length) {
    return getSegmentColor(value, segments, color)
  }
  return DEFAULT_COLOR;
}

const getSegmentColor = (
  value: number,
  segments: number[],
  color?: StatusColor | StatusColor[]
): StatusColor => !color?.length
  ? (color as StatusColor | undefined) || DEFAULT_COLOR
  : color[findIndexInThreshold(segments, value)] as StatusColor

const getHealth = (
  value: HealthValueProps | number | undefined | null,
  defaultValue = 45, // This should throw an error, but it is nice for prototyping
): number => {
  switch (typeof value) {
    case "number":
      return value;
    case "object":
      if (value !== null) {
        return rangeMapper(value);
      }
      return defaultValue
    default:
      return defaultValue
  }
}

const findIndexInThreshold = (thresholds: number[], value = 0) => {
  const t = thresholds.sort((a, b) => a - b);
  for (let i = 0; i < t.length; i++) {
    if (value < t[i]) {
      return i - 1;
    }
  }
  // If the value is greater than or equal to the last threshold, return the pre-last index since 100 is added for percentage
  return t.length - 2;
}

const defaultValues = {
  input_start: 0, // The lowest number of the range input.
  output_start: 0, // The lowest number of the range output.
  output_end: 100, // The largest number of the range output. Currently, set to a percentage range between 0 and 1
}

const rangeMapper = (
  {
    value,
    min = 0,
    max
  }: { value: number; min?: number, max: number }) =>
  rangeMapperInternal(value, min, max)
export const rangeMapperInternal = (
  input: number,
  input_start: number,
  input_end: number,
  // config?: MapChancesConfigProps,
  output_end = defaultValues.output_end,
  output_start = defaultValues.output_start,
): number => {
  return output_start + ((output_end - output_start) / (input_end - input_start)) * (input - input_start)
}
