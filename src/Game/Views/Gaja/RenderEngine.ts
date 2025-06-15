// What's the idea here
// There will be way more stuff to animate than just the branches. There shall be clouds, mushrooms and even markets
// or cities. All of them will have to be aware of their position, the climbing height and also of their own
// z-axes since elements should move in different speed and possibly also react to their environment, like e.g.
// being blurred in the background or adjusting their color

// So the goal is to pass in objects here (can also be triggered by an event) so that the RenderEngine takes care
// on how to place and move them as well as the effects to trigger

import {GameBaseClasses} from "@/Game/Classes/Game/gameTypes.ts";
import {id} from "@/GameEngine/ResourceEngine/helpers/id.ts";

// interface Renderable {
//   update(currentY: number): void;
//   getElements(): RenderElement[];
// }

type RenderElement = {
  x: number;
  y: number;
  z: number;
  image: string;
  type: 'branch' | 'cloud' | 'mushroom' | 'market' | 'city'; // most likely own classes
  width: number;
  height: number;
  id?: string; // optional, for keyed rendering
}

export class RenderEngine {
  private sources: Renderable[] = [];

  // private _starting_height: number
  // private _current_height: number
  constructor(private props: GameBaseClasses) {
    // this._starting_height = props.behemoth.climb_height.value
  }

  public add = (source: Renderable) => {
    this.sources.push(source);
  }

  public remove = (source: Renderable) => {
    this.sources = this.sources.filter(s => s !== source);
  }

  public update = () => {
    for (const source of this.sources) {
      source.update(0, this.props.behemoth.climb_height.value);
    }
  }

  getElements(): Renderable[] {
    return this.sources.flatMap(s => s.getElements());
  }

  // public subscription = () => {
  //   this._current_height = this.props.behemoth.climb_height.value
  // }
  //
  //
  //
  // public addElement = (element: Partial<ImaginativeProps>) => {
  //   // By default, a new element should be spawned outside the viewport.
  //   // This might get a little tricky because I will have to see how to calculate this and get enough randomness in it
  // }
  //
  // public addFactory = () => {
  //
  // }
  //
  // public get = () => {
  //
  // }
}

abstract class Renderable implements RenderElement {
  public id: string = id()
  public x: number;
  public y: number;
  public z: number;
  public image: string;
  public type: RenderElement['type']
  public width: number;
  public height: number;
  constructor(private props: RenderElement) {
    this.id = props.id || this.id;
    this.x = props.x;
    this.y = props.y;
    this.z = props.z;
    this.image = props.image;
    this.type = this.props.type;
    this.width = this.props.width;
    this.height = this.props.height;
  }

  abstract update(currentX: number, currentY: number): void;
  abstract getElements(): Renderable[];
  get className() {
    return `
    absolute top-0 z-[-1] object-contain right-[350px]
    border border-red-500
    xl:w-[640px] xl:right-[500px]
    lg:w-[560px] lg:right-[500px]
    md:w-[480px] md:right-[400px]
    `
  }
}

export class Mushroom extends Renderable {
  private config: RenderElement;

  constructor(config: RenderElement) {
    super(config);
    this.config = config;
  }

  update(currentX: number, currentY: number) {
    // console.log(currentX, currentY)
    // Optional animation, wobble, or removal logic
  }

  getElements(): Renderable[] {
    return [this];
  }

}


// type ImaginativeProps = {
//   type: 'branch' | 'cloud' | 'mushroom' | 'market' | 'city'; // most likely own classes
//   width: number;
//   height: number;
//   image: string;
//   x: number;
//   y: number;
//   z: number;
//   x_offset_per_tick: number;
//   y_offset_per_tick: number;
// }