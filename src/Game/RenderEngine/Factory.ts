import {Renderable, RenderableProps} from "@/Game/RenderEngine/Renderable.ts";
import {randomRange} from "@/Game/helpers/randomRange.ts";
import {ImageProvider} from "@/Game/RenderEngine/ImageProvider.ts";
import {
  ElementCreation,
  NormalizedRenderFactoryConfig, PlacementProps,
  RenderFactoryConfig,
  RenderFactoryConfigProps,
  tupledFields,
  TupledFields
} from "@/Game/RenderEngine/types.ts";
import {id} from "@/GameEngine/ResourceEngine/helpers/id.ts";
import {Placement} from "@/Game/RenderEngine/Placement.ts";
import {GameClass} from "@/Game";

export class Factory {
  public id = id();
  private elements: Renderable[] = [];
  private config: NormalizedRenderFactoryConfig;
  private turn: number = 0;
  public unmount_on_leaving_viewport = false;

  constructor(
    private Element: ElementCreation,
    config: RenderFactoryConfigProps,
    private _game: GameClass,
  ) {
    this.config = this.normalizeConfig(config)
  }

  initialize = (x: number, y: number): this => {
    // Here I would need to calculate the position including the min_spawn_distance
    for (let i = 0; i < this.config.initial_amount; i++) {
      this._add(this._spawnInitialElements(), x, y)
    }
    // In here the initial position is actually set. So in here I do the displacement
    this.elements.forEach(i => i.initialize(x, y)); // Not sure if this is needed and why
    return this;
  }

  public animate = (world_x: number, world_y: number): void => {
    const {current_turn} = this._game.tick
    if (this.turn < current_turn) {
      this.turn = current_turn;
      if (this._shouldAddElement()) {
        // console.log('spawn on ', this.turn)
        this._add(this.spawnElement(), world_x, world_y)
      }
    }
    // console.log(tick.current_turn)
    this.elements.forEach(element => {
      if (element.left_viewport) {
        this._remove(element.id)
      }
    });
    this._animate(world_x, world_y)
  }


  public getElements = (): Renderable[] => {
    return this.elements;
  }

  public spawnElement = (): Renderable => {
    const random = this._randomValues();
    const initialPosition = new Placement(random).position_outside_viewport
    return new this.Element(random, initialPosition, this._game);
  }

  private _spawnInitialElements = (): Renderable => {
    const random = this._randomValues();
    const _random = {
      ...random,
      y: randomRange(0, 100)
    }
    const initialPosition = new Placement(_random).position_inside_viewport
    return new this.Element(_random, initialPosition, this._game);
  }



  private _animate = (world_x: number, world_y: number) =>
    this.elements.forEach(elem => elem.animate(world_x, world_y));



  private _distanceToClosestElement = (): number => {
    const sorted = this.elements
      .map(({y}) => y)
      .sort((a, b) => a - b)
    return sorted[0] ?? Infinity;
  }

  private _shouldAddElement = (): boolean => {
    const [min, max] = this.config.spawn_amount;
    const reached_min = this.elements.length < min
    const reached_max = this.elements.length >= max
    const far_enough = this._distanceToClosestElement() >= this.config.spawn_min_distance
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

  private normalizeConfig = (config?: RenderFactoryConfigProps): NormalizedRenderFactoryConfig => {
    const normalize = <K extends keyof RenderFactoryConfig>(key: K) =>
      normalizeValue(key, config)

    return {
      id: normalize('id'),
      initial_amount: normalize('initial_amount'),
      type: normalize('type'),
      x: normalize('x'),
      y: normalize('y'),
      z: normalize('z'),
      anchor: normalize('anchor'),
      unmount_on_leaving_viewport: normalize('unmount_on_leaving_viewport'),
      spawn_chance: normalize('spawn_chance'),
      spawn_amount: normalize('spawn_amount'),
      spawn_min_distance: normalize('spawn_min_distance'),
    }
  }
  private _add = (source: Renderable, world_x: number, world_y: number) => {
    this.elements.push(source.initialize(world_x, world_y));
  }

  private _remove = (id: string) => {
    this.elements = this.elements.filter(s => s.id !== id);
  }

  private _randomValues = (): RenderableProps & PlacementProps => {
    const x = randomRange(...this.config.x)
    const y = randomRange(...this.config.y)
    const z = randomRange(...this.config.z)
    const type = this.config.type
    const image = ImageProvider.random(type)
    const {width, height} = image
    return {
      x,
      y,
      z,
      type,
      image: image.key,
      anchor: this.config.anchor,
      width,
      height,
    }
  }
}

const defaultConfig: NormalizedRenderFactoryConfig = {
  id: id(),
  initial_amount: 1,
  x: [0, 0],
  y: [0, 0],
  z: [3, 8],
  anchor: '',
  type: 'cloud',
  unmount_on_leaving_viewport: false,
  spawn_min_distance: 100,
  spawn_amount: [1, 5],
  spawn_chance: 50,
}


const normalizeValue = <K extends keyof RenderFactoryConfig>(
  key: K,
  config?: RenderFactoryConfigProps
): NormalizedRenderFactoryConfig[K] => {
  const value = config?.[key] ?? defaultConfig[key];

  if (tupledFields.includes(key as TupledFields)) {
    if (Array.isArray(value)) return value.sort((a, b) => a - b) as NormalizedRenderFactoryConfig[K];
    return [value, value] as NormalizedRenderFactoryConfig[K]; // Normalize number to tuple
  }

  return value as NormalizedRenderFactoryConfig[K];
};
