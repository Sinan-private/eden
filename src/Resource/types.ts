export type ResourceTypeRaw<T> = {
  value: number;
  min: number;
  max: number;
  label: string;
  type?: T;
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
