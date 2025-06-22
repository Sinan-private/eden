import {getGajaSize} from "@/Game/RenderEngine/media_queries.ts";

type PlacementKey = 'top' | 'bottom' | 'left' | 'right' | 'center';
type PlacementConfig = {
  from?: PlacementKey;
  x?: number;
  y?: number;
  anchor?: 'gaja' | '';
  image: { width: number; height: number };
};


export type SpawnProps = {
  // amount: number | [number, number]; // A number say between 0 and the value. An array means between x and y
  min_distance: number; // Distance to the closest element in the list. Before min_distance is reached no new spawn is triggered
  chance: number; // 0 - 100. The percentage chance to spawn a new element. If the current amount is smaller than the min amount. A spawn is triggered, no matter the chance
  from: 'top' | 'bottom' | 'left' | 'right';
  anchor: 'gaja' | '',
}

type ValidAnchor = Exclude<SpawnProps['anchor'], ''>
type AnchorSizes = Record<ValidAnchor, number>

export type NormalizedSpawnProps = {
  amount: [number, number];
} & Omit<SpawnProps, 'amount'>


// This needs to know the full image width its dimensions and where it should be attached to

export class Spawn {
  private _config: NormalizedSpawnProps
  constructor(spawn: SpawnProps) {
    this._config = Spawn.normalizeConfig(spawn)
  }

  static normalizeConfig = (config?: Partial<SpawnProps>): NormalizedSpawnProps => {
    const normalize = <K extends keyof SpawnProps>(key: K) =>
      normalizeValue(key, config)
    return {
      min_distance: normalize('min_distance'),
      chance: normalize('chance'),
      from: normalize('from'),
      anchor: normalize('anchor'),
    }
  }

  get width(): number {
    return this._config.anchor
      ? this.anchor_width
      : window.innerWidth
  }

  get top(): 0 | 'auto' {
    return this._config.from === 'top' ? 0 : 'auto'
  }

  get left(): 0 | 'auto' {
    return this._config.from === 'left' && !this._config.anchor ? 0 : 'auto'
  }

  get right(): 0 | 'auto' {
    return this._config.from === 'right' && !this._config.anchor ? 0 : 'auto'
  }

  static get spawn_height(): number {
    return -(window.innerHeight / 2)
  }

  get anchor_width() {
    const {anchor} = this._config
    if (!anchor) {
      return window.innerWidth
    }
    const anchor_sizes: AnchorSizes = {
      gaja: getGajaSize(window.innerWidth)
    }
    const width = anchor_sizes[anchor as ValidAnchor]
    if (!width) {
      throw new Error(`${anchor} is not a valid key to attach a rendered element to`)
    }
    return width;
  }

}

const tupledFields = ['amount'] as const;
type TupledFields = typeof tupledFields[number];

const defaultConfig = {
  amount: [1, 5],
  min_distance: 1,
  chance: 30,
  from: 'top',
  anchor: '',
}

const normalizeValue = <K extends keyof SpawnProps>(
  key: K,
  config?: Partial<SpawnProps>
): NormalizedSpawnProps[K] => {
  const value = config?.[key] ?? defaultConfig[key];

  if (tupledFields.includes(key as TupledFields)) {
    if (Array.isArray(value)) return value.sort((a, b) => a - b) as NormalizedSpawnProps[K];
    return [value, value] as NormalizedSpawnProps[K]; // Normalize number to tuple
  }

  return value as NormalizedSpawnProps[K];
};