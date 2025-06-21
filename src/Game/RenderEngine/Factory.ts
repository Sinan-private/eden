import {Renderable} from "@/Game/RenderEngine/Renderable.ts";
import {RenderImageType} from "@/Game/RenderEngine/imageRegistry.ts";
import {NormalizedSpawnProps, Spawn, SpawnProps} from "@/Game/RenderEngine/Spawn.ts";
import {RenderableProps} from "@/Game/RenderEngine/RenderEngine.ts";
import {Tick} from "@/GameEngine/Tick.ts";
import {randomRange} from "@/Game/helpers/randomRange.ts";
import {imageProvider} from "@/Game/RenderEngine/ImageProvider.ts";

const tupledFields: readonly ['x', 'y', 'z'] = ['x', 'y', 'z'] as const;
type TupledFields = typeof tupledFields[number];
type RenderFactoryConfigProps = {
  initial_amount: number;
  x: number | [number, number];
  y: number | [number, number];
  z: number | [number, number];
  image_type: RenderImageType;
  unmount_on_leaving_viewport: boolean;
  anchor: 'gaja' | '',
  spawn: SpawnProps;
}
type Props = Omit<Partial<RenderFactoryConfigProps>, 'spawn'> & {
  spawn: Partial<SpawnProps>;
}

// The normalized version
type NormalizedRenderFactoryConfig = {
  [K in keyof RenderFactoryConfigProps]: K extends TupledFields ? [number, number] : K extends 'spawn' ? NormalizedSpawnProps : RenderFactoryConfigProps[K];
};

export class Factory {
  private elements: Renderable[] = [];
  private config: NormalizedRenderFactoryConfig;
  private turn: number = 0;

  constructor(
    private Factory: new (config: RenderableProps) => Renderable,
    config?: Props,
  ) {
    this.config = this.normalizeConfig(config)
  }

  initialize = (x: number, y: number): this => {
    // In here the initial position is actually set. So in here I do the displacement
    this.elements.forEach(i => i.initialize(x, y));
    return this;
  }

  public getElements = (): Renderable[] => {
    return this.elements;
  }

  public createElement = (config: RenderableProps) => {
    return new this.Factory(config)
  }

  private _add = (source: Renderable, world_x: number, world_y: number) => {
    this.elements.push(source.initialize(world_x, world_y));
  }

  private _remove = (source: Renderable) => {
    this.elements = this.elements.filter(s => s !== source);
  }

  private randomValues = (): RenderableProps => {
    const x = randomRange(...this.config.x)
    const y = randomRange(...this.config.y)
    const z = randomRange(...this.config.z)
    const type = this.config.image_type
    const image = imageProvider.random(type).key
    return {
      x,
      y,
      z,
      type,
      image
    }
  }

  public spawnElement = (): Renderable => {
    // const offset_x = randomRange(...this.config.x) + (this.config.x || 0)
    // const random_z = randomRange(...this.config.z)
    // return new this.Factory({
    //   image: this.randomImage().key,
    //   type: this.config.image_type,
    //   offset_x,
    //   offset_y: this.spawn_height,
    //   z: random_z,
    // })
  }

  public update = (world_x: number, world_y: number, tick: Tick): void => {
    if (this.turn < tick.current_turn) {
      this.turn = tick.current_turn;
      if (this._shouldAddElement()) {
        // console.log('spawn on ', this.turn)
        this._add(this.spawnElement(), world_x, world_y)
      }
    }
    // console.log(tick.current_turn)
    this.elements.forEach(element => {
      if (element.left_viewport) {
        this._remove(element)
      }
    });
    this.elements.forEach(i => i.update(world_x, world_y));
  }

  private distanceToClosestElement = (): number => {
    const sorted = this.elements
      .map(({y}) => y)
      .sort((a, b) => a - b)
    const closest = sorted[0] || Infinity;
    // return closest - this.spawn_height * 2
    return closest - Spawn.spawn_height * 2
  }

  private _shouldAddElement = (): boolean => {
    const [min, max] = this.config.spawn.amount;
    const reached_min = this.elements.length < min
    const reached_max = this.elements.length >= max
    const far_enough = this.distanceToClosestElement() >= this.config.spawn.min_distance
    if (!far_enough) {
      // console.log('not far enough')
      return false
    }
    if (reached_min) {
      // console.log('reached min', this.elements.length)
      return true
    }
    if (reached_max) {
      // console.log('reached max', this.elements.length)
      return false
    }

    const chance = Math.random()
    return chance < (this.config.spawn.chance / 100)
  }

  private normalizeConfig = (config?: Props): NormalizedRenderFactoryConfig => {
    const normalize = <K extends keyof RenderFactoryConfigProps>(key: K) =>
      normalizeValue(key, config)

    return {
      initial_amount: normalize('initial_amount'),
      image_type: normalize('image_type'),
      x: normalize('x'),
      y: normalize('y'),
      z: normalize('z'),
      anchor: normalize('anchor'),
      unmount_on_leaving_viewport: normalize('unmount_on_leaving_viewport'),
      spawn: Spawn.normalizeConfig(config?.spawn),
    }
  }
}

const defaultConfig: NormalizedRenderFactoryConfig = {
  initial_amount: 1,
  x: [0, 0],
  y: [0, 0],
  z: [3, 8],
  anchor: '',
  image_type: 'cloud',
  unmount_on_leaving_viewport: false,
  spawn: {
    from: 'top',
    amount: [1, 5],
    chance: 30,
    min_distance: 0,
  },
}


const normalizeValue = <K extends keyof RenderFactoryConfigProps>(
  key: K,
  config?: Props
): NormalizedRenderFactoryConfig[K] => {
  const value = config?.[key] ?? defaultConfig[key];

  if (tupledFields.includes(key as TupledFields)) {
    if (Array.isArray(value)) return value as NormalizedRenderFactoryConfig[K];
    return [value, value] as NormalizedRenderFactoryConfig[K]; // Normalize number to tuple
  }

  return value as NormalizedRenderFactoryConfig[K];
};
