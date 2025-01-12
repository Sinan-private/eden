export type ResourceTypeRaw<K, T> = {
  value: number;
  min: number;
  max: number;
  label: string;
  type?: T;
  cost: ResourceCostUpdate<K, T> | null;
  revealedAt: ResourceCostUpdate<K, T> | null;
  iconName?: string;
}
export type TradeChange<K, T> = {key: K} & Partial<ResourceTypeRaw<K, T>>;
export type ResourceCostUpdate<K, T> = {
  give: TradeChange<K, T>[];
  gain: TradeChange<K, T>[];
}
export type ResourceUpdateProps<K, T> = {
  key: K;
  cost?: ResourceCostUpdate<K, T> | null;
  revealedAt?: ResourceCostUpdate<K, T> | null;
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
export type LevelUpdate<K, T> = Partial<ResourceCostUpdate<K, T>> & {
  need?: TradeChange<K, T>[]
}
