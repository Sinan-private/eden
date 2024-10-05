export type ResourceTypeRaw<T> = {
  value: number;
  min: number;
  max: number;
  label: string;
  type?: T; // should be generic
}

export type ResourceUpdateProps<K, T> = {
  key: K;
} & Partial<ResourceTypeRaw<T>>

export type ResourceState<K, T> = ResourceTypeRaw<T> & {key: K};

export type ResourceBeautyType = {
  value: string;
  min: string;
  max: string;
  fillPercentage: number;
}