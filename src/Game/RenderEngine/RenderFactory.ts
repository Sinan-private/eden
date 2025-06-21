import {RenderableProps} from "@/Game/RenderEngine/RenderEngine.ts";
import {Renderable} from "@/Game/RenderEngine/Renderable.ts";
import {randomRange} from "@/Game/helpers/randomRange.ts";
import {Tick} from "@/GameEngine/Tick.ts";
import {getImagesByType, RenderImageType} from "@/Game/RenderEngine/imageRegistry.ts";
import {SpawnPosition} from "@/Game/RenderEngine/SpawnEngine.ts";

type TupledFields = 'x' | 'y' | 'spawn_amount' | 'z';
type RenderFactoryConfigProps = {
  initial_amount: number;
  x: number | [number, number];
  y: number | [number, number];
  z: number | [number, number];
  spawn_amount: number | [number, number]; // A number say between 0 and the value. An array means between x and y
  spawn_min_distance: number; // Distance to the closest element in the list. Before min_distance is reached no new spawn is triggered
  spawn_chance: number; // 0 - 100. The percentage chance to spawn a new element. If the current amount is smaller than the min amount. A spawn is triggered, no matter the chance
  image_type: RenderImageType;
  unmount_on_leaving_viewport: boolean;
  spawn: SpawnPosition;
}
 // & Omit<RenderElement, 'image' | 'z'>

// The normalized version
type NormalizedRenderFactoryConfig = {
  [K in keyof RenderFactoryConfigProps]: K extends TupledFields ? [number, number] : RenderFactoryConfigProps[K];
};

const defaultConfig: NormalizedRenderFactoryConfig = {
  initial_amount: 1,
  x: [0, 0],
  y: [0, 0],
  z: [3, 8],
  spawn: 'top',
  spawn_amount: [5, 10],
  spawn_min_distance: 0, // should be 0
  spawn_chance: 25,
  image_type: 'cloud',
  unmount_on_leaving_viewport: false,
  // offset_x: 0,
  // offset_y: 0,
  // type: 'cloud',
}

// I want to
// provide default values
// normalize values to be arrays
// order arrays to be of a consistent shape

export class RenderFactory {
  private elements: Renderable[] = [];
  private config: NormalizedRenderFactoryConfig;
  private turn: number = 0;

  constructor(
    private Factory: new (config: RenderableProps) => Renderable,
    config?: Partial<RenderFactoryConfigProps>,
  ) {
    this.config = this._normalizeConfig(config);
    const amount = this.config.initial_amount;
    for (let i = 0; i < amount; i++) {
      this.elements.push(this.createRandomElement())
    }
  }

  initialize = (x: number, y: number): this => {
    // In here the initial position is actually set. So in here I do the displacement
    this.elements.forEach(i => i.initialize(x, y));
    return this;
  }

  private _normalizeConfig = (config?: Partial<RenderFactoryConfigProps>): NormalizedRenderFactoryConfig => ({
    initial_amount: normalizeValue('initial_amount', config),
    x: normalizeRange(config?.x, defaultConfig.x),
    y: normalizeRange(config?.y, defaultConfig.y),
    spawn_amount: normalizeRange(config?.spawn_amount, defaultConfig.spawn_amount),
    spawn_min_distance: normalizeValue('spawn_min_distance', config), // should be 0
    spawn_chance: normalizeValue('spawn_chance', config),
    image_type: normalizeValue('image_type', config),
    unmount_on_leaving_viewport: normalizeValue('unmount_on_leaving_viewport', config),
    offset_x: normalizeValue('offset_x', config),
    offset_y: normalizeValue('offset_y', config),
    z: normalizeRange(config?.z, defaultConfig.z),
    type: normalizeValue('type', config),
    spawn: config?.spawn ?? defaultConfig.spawn, // Just the fallback until the constructor works
  })

  private createRandomElement = (): Renderable => {
    const offset_x = randomRange(...this.config.x) + (this.config.offset_x || 0)
    const offset_y = randomRange(...this.config.y)
    const random_z = randomRange(...this.config.z)
    console.log(random_z, this.config.z)
    return new this.Factory({
      image: this.randomImage().key,
      type: this.config.image_type,
      offset_x,
      offset_y,
      z: random_z,
    })
  }

  private spawnElement = (): Renderable => {
    const offset_x = randomRange(...this.config.x) + (this.config.x || 0)
    const random_z = randomRange(...this.config.z)
    return new this.Factory({
      image: this.randomImage().key,
      type: this.config.image_type,
      offset_x,
      offset_y: this.spawn_height,
      z: random_z,
    })
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

  public getElements = (): Renderable[] => {
    return this.elements;
  }

  private _add = (source: Renderable, world_x: number, world_y: number) => {
    this.elements.push(source.initialize(world_x, world_y));
  }

  private randomImage = () => {
    const images = getImagesByType(this.config.image_type)
    const index = randomRange(0, images.length - 1)
    return images[index]
  }

  private _remove = (source: Renderable) => {
    this.elements = this.elements.filter(s => s !== source);
  }

  private distanceToClosestElement = (): number => {
    const sorted = this.elements
      .map(({y}) => y)
      .sort((a, b) => a - b)
    const closest = sorted[0] || Infinity;
    return closest - this.spawn_height * 2
  }

  private _shouldAddElement = (): boolean => {
    const [min, max] = this.config.spawn_amount;
    const reached_min = this.elements.length < min
    const reached_max = this.elements.length >= max
    const far_enough = this.distanceToClosestElement() >= this.config.spawn_min_distance
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
    return chance < (this.config.spawn_chance / 100)
  }

  get left_viewport(): boolean {
    return this.elements.every(i => i.left_viewport);
  }

  get unmount_on_leaving_viewport(): boolean {
    return this.config.unmount_on_leaving_viewport && this.left_viewport
  }

  get spawn_height(): number {
    return -(window.innerHeight / 2)
  }
}


const normalizeRange = (
  value: number | [number, number] | undefined,
  defaultValue = [0, 1],
): [number, number] => {
  if (Array.isArray(value)) {
    return value.sort((a, b) => a - b)
  }
  const [min, max] = defaultValue
  return [value ?? min, value ?? max]
}
const normalizeValue = <K extends keyof RenderFactoryConfigProps>(
  key: K,
  config?: Partial<RenderFactoryConfigProps>
): RenderFactoryConfigProps[K] => {
  return config?.[key] ?? defaultConfig[key];
};