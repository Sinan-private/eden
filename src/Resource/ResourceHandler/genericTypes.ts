export type ResourceTypeRaw<K, T> = {
  value: number;
  min: number;
  max: number;
  label: string;
  type?: T;
  cost: ResourceCostUpdate<K> | null;
  revealedAt: ResourceCostUpdate<K> | null;
  iconName?: string;
}
export type TradeChange<K> = {key: K, value: number};
export type ResourceCostUpdate<K> = {
  give: {key: K, value?: number}[];
  gain: {key: K, value?: number}[];
}
export type ResourceUpdateProps<K, T> = {
  key: K;
  cost?: ResourceCostUpdate<K> | null;
  revealedAt?: ResourceCostUpdate<K> | null;
  iconName?: string;
  min?: number | null;
  max?: number | null;
} & Partial<Omit<ResourceTypeRaw<K, T>, 'min' | 'max'>>
export type ResourceState<K, T> = ResourceTypeRaw<K, T> & {key: K};
export type ResourceBeautyType = {
  value: string;
  min: string;
  max: string;
  fillPercentage: number;
}
export type Icon = { name: string, src: string };
