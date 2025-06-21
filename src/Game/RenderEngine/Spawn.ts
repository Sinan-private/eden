import {SpawnPosition} from "@/Game/RenderEngine/SpawnEngine.ts";

export type SpawnProps = {
  amount: number | [number, number]; // A number say between 0 and the value. An array means between x and y
  min_distance: number; // Distance to the closest element in the list. Before min_distance is reached no new spawn is triggered
  chance: number; // 0 - 100. The percentage chance to spawn a new element. If the current amount is smaller than the min amount. A spawn is triggered, no matter the chance
  from: SpawnPosition;
}

export type NormalizedSpawnProps = {
  amount: [number, number];
} & Omit<SpawnProps, 'amount'>

export class Spawn {
  constructor(spawn: SpawnPosition) {

  }

  static normalizeConfig = (config?: Partial<SpawnProps>): NormalizedSpawnProps => {
    const normalize = <K extends keyof SpawnProps>(key: K) =>
      normalizeValue(key, config)
    return {
      amount: normalize('amount'),
      min_distance: normalize('min_distance'),
      chance: normalize('chance'),
      from: normalize('from')
    }
  }

  static get spawn_height(): number {
    return -(window.innerHeight / 2)
  }

}

const tupledFields = ['amount'] as const;
type TupledFields = typeof tupledFields[number];

const defaultConfig = {
  amount: [1, 5],
  min_distance: 1,
  chance: 30,
  from: 'top'
}

const normalizeValue = <K extends keyof SpawnProps>(
  key: K,
  config?: Partial<SpawnProps>
): NormalizedSpawnProps[K] => {
  const value = config?.[key] ?? defaultConfig[key];

  if (tupledFields.includes(key as TupledFields)) {
    if (Array.isArray(value)) return value as NormalizedSpawnProps[K];
    return [value, value] as NormalizedSpawnProps[K]; // Normalize number to tuple
  }

  return value as NormalizedSpawnProps[K];
};