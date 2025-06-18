import {RenderElement} from "@/Game/RenderEngine/RenderEngine.ts";
import {Renderable} from "@/Game/RenderEngine/Renderable.ts";
import {randomRange} from "@/Game/helpers/randomRange.ts";

type TupledFields = 'random_x' | 'random_y' | 'spawn';
type RenderFactoryConfigProps = {
  initial_amount: number;
  random_x: number | [number, number];
  random_y: number | [number, number];
  spawn_amount: number | [number, number]; // A number say between 0 and the value. An array means between x and y
  spawn_min_distance: number; // Distance to the closest element in the list. Before min_distance is reached no new spawn is triggered
  spawn_chance: number; // 0 - 100. The percentage chance to spawn a new element. If the current amount is smaller than the min amount. A spawn is triggered, no matter the chance
}

// The normalized version
type NormalizedRenderFactoryConfig = {
  [K in keyof RenderFactoryConfigProps]: K extends TupledFields ? [number, number] : RenderFactoryConfigProps[K];
};

const defaultConfig: RenderFactoryConfigProps = {
  initial_amount: 1,
  random_x: [-100, 100],
  random_y: [-100, 100],
  spawn_amount: [0, 3],
  spawn_min_distance: 0,
}

// I want to
// provide default values
// normalize values to be arrays
// order arrays to be of a consistent shape

export class RenderFactory {
  private elements: Renderable[] = [];
  private config: NormalizedRenderFactoryConfig

  constructor(
    private Factory: new (config: RenderElement) => Renderable,
    config: Partial<RenderFactoryConfigProps> = {}
  ) {
    this.config = defaultConfig
    const amount = config.initial_amount ?? 1;
    for (let i = 0; i < amount; i++) {
      const offset_x = randomRange(...this.config.random_x)
      const offset_y = randomRange(...this.config.random_y)
    // const random_x = Math.random() * 600;
    // const random_y = -(Math.random() * 600);
    const random_z = 3 + Math.random() * 5;
      this.elements.push(new this.Factory({
        image: 'cloud1',
        type: 'cloud',
        offset_x,
        offset_y,
        z: random_z,
      })); // You'll need to define `generateConfig`
    }
  }

  initialize = (x: number, y: number): this => {
    // In here the initial position is actually set. So in here I do the displacement
    this.elements.forEach(i => i.initialize(x, y));
    return this;
  }

  public add = (source: Renderable) => {
    this.element.push(source.initialize(0, this.props.behemoth.climb_height.value));
  }

  public addFactory = (factory: RenderFactory) => {
    this.factories.push(factory.initialize(0, this.props.behemoth.climb_height.value));
  }

  public remove = (source: Renderable) => {
    this.element = this.element.filter(s => s !== source);
  }

  update = (x: number, y: number): void => {
    this.elements.forEach(item => {
      if (item.left_viewport) {
        // item.
      }
    });
    this.elements.forEach(i => i.update(x, y));
    const elements = this.elements.length
    console.log(elements)
  }

  getElements = (): Renderable[] => {
    return this.elements;
  }

  get left_viewport(): boolean {
    return this.elements.every(i => i.left_viewport);
  }
}