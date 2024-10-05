import {ResourceUpdateProps} from "./types.ts";

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

export type UpdateFormat<K, T> = SimpleUpdateFormat<K, T> | TradeFormat<K, T>

// type IncrementFormat<T> = {
//   type: 'increment',
//   update: {
//     key: T,
//     value: number
//   }
// }
//
// type DecrementFormat<T> = {
//   type: 'decrement',
//   update: {
//     key: T,
//     value: number
//   }
// }
//
// type UpdateFormat<T> = {
//   type: 'update',
//   update: ResourceUpdateProps<T>
// }
//
// type SetFormat<T> = {
//   type: 'set',
//   update: ResourceUpdateProps<T>
// }
//
// export type ResourceUpdate<T> = TradeFormat<T> | IncrementFormat<T> | DecrementFormat<T> | UpdateFormat<T> | SetFormat<T>;
// export type ResourceUpdateList<T> = ResourceUpdate<T>[]

export const isTradeFormat = <K, T>(change: UpdateFormat<K, T>): change is TradeFormat<K, T> =>
  change.type === 'trade';


// const format: ResourceUpdateList<ResourceKeys> = [
//   {
//     type: 'trade',
//     update: {
//       give: {} as ResourceUpdateProps<string>[],
//       gain: {} as ResourceUpdateProps<string>[],
//       multiplier: 1
//     }
//   },
//   {
//     type: 'increment',
//     update: {
//       key: 'corn',
//       value: 1
//     }
//   },
//   {
//     type: 'decrement',
//     update: {
//       key: 'corn',
//       value: 1
//     }
//   },
//   {
//     type: 'update',
//     update: {
//       key: 'corn',
//       value: 1,
//       min: 0,
//       max: 100,
//       label: 'should not be updated usually',
//       type: 'Should also not be updates',
//     }
//   },
//   {
//     type: 'set',
//     update: {
//       key: 'corn',
//       value: 1,
//       min: 0,
//       max: 100,
//     }
//   }
// ]

// console.log(format)