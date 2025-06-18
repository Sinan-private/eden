import {RenderElement} from "@/Game/RenderEngine/RenderEngine.ts";
import {Renderable} from "@/Game/RenderEngine/Renderable.ts";
import {randomRange} from "@/Game/helpers/randomRange.ts";
import {Tick} from "@/GameEngine/Tick.ts";
import {getImagesByType} from "@/Game/RenderEngine/imageRegistry.ts";

type TupledFields = 'random_x' | 'random_y' | 'spawn_amount';
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

const defaultConfig: NormalizedRenderFactoryConfig = {
  initial_amount: 1,
  random_x: [-400, 400],
  random_y: [-100, 100],
  spawn_amount: [1, 8],
  spawn_min_distance: 300, // should be 0
  spawn_chance: 30,
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
    private Factory: new (config: RenderElement) => Renderable,
    config: Partial<RenderFactoryConfigProps> = {}
  ) {
    this.config = defaultConfig
    const amount = config.initial_amount ?? 1;
    for (let i = 0; i < amount; i++) {
      this.elements.push(this.createRandomElement())
    //   const offset_x = randomRange(...this.config.random_x)
    //   const offset_y = randomRange(...this.config.random_y)
    // // const random_x = Math.random() * 600;
    // // const random_y = -(Math.random() * 600);
    // const random_z = 3 + Math.random() * 5;
    //   this.elements.push(new this.Factory({
    //     image: 'cloud1',
    //     type: 'cloud',
    //     offset_x,
    //     offset_y,
    //     z: random_z,
    //   })); // You'll need to define `generateConfig`
    }
  }

  initialize = (x: number, y: number): this => {
    // In here the initial position is actually set. So in here I do the displacement
    this.elements.forEach(i => i.initialize(x, y));
    return this;
  }

  private createRandomElement = (): Renderable => {
    const offset_x = randomRange(...this.config.random_x)
    const offset_y = randomRange(...this.config.random_y)
    const random_z = 3 + Math.random() * 5
    return new this.Factory({
      image: this.randomImage().key,
      type: 'cloud',
      offset_x,
      offset_y,
      z: random_z,
    })
  }

  private spawnElement = (): Renderable => {
    const offset_x = randomRange(...this.config.random_x)
    const random_z = 3 + Math.random() * 5
    return new this.Factory({
      image: this.randomImage().key,
      type: 'cloud',
      offset_x,
      offset_y: this.spawn_height,
      z: random_z,
    })
  }



  public update = (x: number, y: number, tick: Tick): void => {
    if (this.turn < tick.current_turn) {
      this.turn = tick.current_turn;
      if (this._shouldAddElement()) {
        this._add(this.spawnElement(), x, y)
      }
    }
    // console.log(tick.current_turn)
    this.elements.forEach(element => {
      if (element.left_viewport) {
        this._remove(element)
      }
    });
    this.elements.forEach(i => i.update(x, y));
  }

  public getElements = (): Renderable[] => {
    return this.elements;
  }

  private _add = (source: Renderable, x: number, y: number) => {
    this.elements.push(source.initialize(x, y));
  }

  private randomImage = () => {
    const type = 'cloud'
    const images = getImagesByType(type)
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
    const closest = sorted[0];
    return closest - this.spawn_height * 2
  }

  private _shouldAddElement = (): boolean => {
    const [min, max] = this.config.spawn_amount;
    const reached_min = this.elements.length < min
    const reached_max = this.elements.length >= max
    if (reached_min) {
      return true
    }
    if (reached_max) {
      return false
    }
    const far_enough = this.distanceToClosestElement() >= this.config.spawn_min_distance
    if (!far_enough) {
      return false
    }
    return Math.random() > (this.config.spawn_chance / 100)
  }

  get left_viewport(): boolean {
    return this.elements.every(i => i.left_viewport);
  }

  get spawn_height(): number {
    return -(window.innerHeight / 2)
  }
}