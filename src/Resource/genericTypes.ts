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
export type TradeChangePlusIcon<K> = TradeChange<K> & {icon: string};

export type ResourceCost<K> = {
  give: TradeChangePlusIcon<K>[];
  gain: TradeChangePlusIcon<K>[];
}

export type ResourceCostUpdate<K> = {
  give: {key: K, value: number}[];
  gain: {key: K, value: number}[];
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
type UpdateFormatType = 'trade' | 'increment' | 'decrement' | 'update' | 'set'
type SimpleUpdateFormatType = Exclude<UpdateFormatType, 'trade'>;
type SimpleUpdateFormat<K, T> = {
  type: SimpleUpdateFormatType;
  update: ResourceUpdateProps<K, T>
}
type TradeFormat<K, T> = {
  type: 'trade',
  update: {
    give: ResourceUpdateProps<K, T>[];
    gain: ResourceUpdateProps<K, T>[];
    multiplier?: number
  }
}
export type TurnUpdateFormat<K, T> = SimpleUpdateFormat<K, T> | TradeFormat<K, T>
export const isTradeFormat = <K, T>(change: TurnUpdateFormat<K, T>): change is TradeFormat<K, T> =>
  change.type === 'trade';
export type Icon = { name: string, src: string };
export type TradeResourceUpdateType<K, T> = {
  valueChangeApproach: number;
  minChangeApproach: number;
  maxChangeApproach: number;
} & ResourceUpdateProps<K, T>;
export type TradeLimitingResource<K extends string> = { key: K, factor: number };