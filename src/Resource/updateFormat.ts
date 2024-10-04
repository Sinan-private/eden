import {ResourceUpdateProps} from "./types.ts";
// import {ResourceKeys} from "../context/gameInit.ts";

type UpdateFormatType = 'trade' | 'increment' | 'decrement' | 'update' | 'set'
type SimpleUpdateFormatType = Exclude<UpdateFormatType, 'trade'>;

type SimpleUpdateFormat<T> = {
  type: SimpleUpdateFormatType;
  update: ResourceUpdateProps<T>
}


type TradeFormat<T> = {
  type: 'trade',
  update: {
    give: ResourceUpdateProps<T>[];
    gain: ResourceUpdateProps<T>[];
    multiplier?: number
  }
}

export type UpdateFormat<T> = SimpleUpdateFormat<T> | TradeFormat<T>

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

export const isTradeFormat = <T>(change: UpdateFormat<T>): change is TradeFormat<T> =>
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