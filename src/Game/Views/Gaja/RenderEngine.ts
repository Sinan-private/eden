// What's the idea here
// There will be way more stuff to animate than just the branches. There shall be clouds, mushrooms and even markets
// or cities. All of them will have to be aware of their position, the climbing height and also of their own
// z-axes since elements should move in different speed and possibly also react to their environment, like e.g.
// being blurred in the background or adjusting their color

// So the goal is to pass in objects here (can also be triggered by an event) so that the RenderEngine takes care
// on how to place and move them as well as the effects to trigger

import {GameBaseClasses} from "@/Game/Classes/Game/gameTypes.ts";
import {id} from "@/GameEngine/ResourceEngine/helpers/id.ts";
import {getImage, RenderImageKey} from "@/Game/Views/Gaja/imageRegistry.ts";

const PARALLAX_INTENSITY = 12


// interface Renderable {
//   update(currentY: number): void;
//   getElements(): RenderElement[];
// }

type RenderElement = {
  x: number;
  y: number;
  z: number;
  image: RenderImageKey;
  type: 'branch' | 'cloud' | 'mushroom' | 'market' | 'city'; // most likely own classes
  // width: number;
  // height: number;
  id?: string; // optional, for keyed rendering
  sticky?: boolean;
}

export class RenderEngine {
  private sources: Renderable[] = [];

  // private _starting_height: number
  // private _current_height: number
  constructor(private props: GameBaseClasses) {
    // this._starting_height = props.behemoth.climb_height.value
  }

  public add = (source: Renderable) => {
    this.sources.push(source.initialize(0, this.props.behemoth.climb_height.value));
  }

  public addFactory = (source: any) => {

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

}

class Renderable {
  public id: string = id()
  protected initial_x: number = 0;
  protected initial_y: number = 0;
  protected world_x: number = 0;
  protected world_y: number = 0;
  protected sticky: boolean;
  public offset_x: number;
  public offset_y: number;
  public offset_z: number;
  public image: string;
  public type: RenderElement['type']
  public width: number;
  public height: number;
  constructor(private props: RenderElement) {
    const {image, width, height} = getImage(this.props.image);
    this.id = props.id || this.id;
    this.type = this.props.type;
    this.sticky = !!props.sticky;
    this.offset_x = props.x;
    this.offset_y = props.y;
    this.offset_z = props.z;
    this.image = image;
    this.width = width;
    this.height = height;
  }

  update(currentX: number, currentY: number): void {
  //   This should trigger the movement of the world since creation.
    //   The individual movement is based on the z-axes and will be calculated individually
    this.world_x = currentX;
    this.world_y = currentY;
  };
  abstract getElements(): Renderable[];
  public initialize = (initialX: number, initialY: number): Renderable => {
    this.initial_x = initialX;
    this.initial_y = initialY;
    this.world_x = initialX;
    this.world_y = initialY;
    return this
  }
  get className() {
    return `
    absolute top-0 z-[-1] object-contain right-[350px]
    xl:w-[640px] xl:right-[500px]
    lg:w-[560px] lg:right-[500px]
    md:w-[480px] md:right-[400px]
    `
  }

  get x() {
    console.log(this.world_x, this.initial_x)
    console.log(this.offset_x)
    return this.world_x - this.initial_x + this.offset_x;
  }

  get y() {
    const delta = this.world_y - this.initial_y + this.offset_y;
    const parallax = (1 + this.offset_z / (20 - PARALLAX_INTENSITY))
    return delta * parallax
  }

  get filter() {
    const offset = Math.abs(this.offset_z)
    const blur = offset < 2 ? 0 : offset * 1.5;
    return `blur(${blur}px)`
  }

  get style() {
    return {
      width: this.width,
      height: this.height,
      zIndex: this.offset_z,
      transform: this.transform,
      filter: this.filter,
      // scale: 1 + this.offset_z / 10,
    }
  }

  get transform() {
    const scale = 1 + this.offset_z / 10;
    return `translate(${this.x}px, ${this.y}px) scale(${scale})`
  }
}

export class Mushroom extends Renderable {
  private config: RenderElement;

  constructor(config: RenderElement) {
    super(config);
    this.config = config;
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