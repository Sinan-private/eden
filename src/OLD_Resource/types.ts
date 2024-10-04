export type ResourceTypeRaw = {
  value: number;
  min: number;
  max: number;
  label: string;
  type?: string; // should be generic
}

export type ResourceUpdateProps<T> = {
  key: T;
} & Partial<ResourceTypeRaw>

export type ResourceState<T> = ResourceTypeRaw & {key: T};

export type ResourceBeautyType = {
  value: string;
  min: string;
  max: string;
  fillPercentage: number;
}