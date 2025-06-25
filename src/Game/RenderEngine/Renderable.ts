import {getImage, RenderImageKey, RenderImageType} from "@/Game/RenderEngine/imageRegistry.ts";
import {id} from "@/GameEngine/ResourceEngine/helpers/id.ts";
import {AnchorProps, InitialPosition} from "@/Game/RenderEngine/types.ts";

const PARALLAX_INTENSITY = 12

// I need to create something that knows the dom. No ref needed for now, but the dimensions of the image
// and the window width and height.
// I want to provide spawn positions inside or outside of the screen and with the option to attach to Gaja


export type RenderableProps = {
  x?: number;
  y?: number;
  z: number;
  image: RenderImageKey;
  type: RenderImageType;
  // width: number;
  // height: number;
  anchor?: AnchorProps;
  id?: string; // optional, for keyed rendering
}

export abstract class Renderable {
  public id: string = id();
  protected initial_x: number = 0;
  protected initial_y: number = 0;
  protected world_x: number = 0;
  protected world_y: number = 0;
  public offset_x: number = 0;
  public offset_y: number;
  public offset_z: number;
  public image: string;
  public type: RenderableProps['type']
  public width: number;
  public height: number;
  public anchor?: AnchorProps;
  public top: number = 0;
  public left: number = 0;

  constructor(private props: RenderableProps, initialPosition: InitialPosition) {
    const {image, width, height} = getImage(this.props.image);
    this.id = props.id || this.id;
    this.type = this.props.type;
    this.offset_x = props.x || 0;
    this.offset_y = props.y || 0;
    this.offset_z = Math.round(props.z);
    this.image = image;
    this.width = width;
    this.height = height;
    this.anchor = props.anchor;
    this.top = initialPosition.top;
    this.left = initialPosition.left;
  }

  update(x: number, y: number): void {
    //   This should trigger the movement of the world since creation.
    //   The individual movement is based on the z-axes and will be calculated individually
    this.world_x = x;
    this.world_y = y;
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
    // xl:w-[640px] xl:right-[500px]
    // lg:w-[560px] lg:right-[500px]
    // md:w-[480px] md:right-[400px]
    // absolute top-0 z-[-1] object-contain right-[350px]
    return `
    absolute top-0 z-[-1] object-contain 
    `
  }

  get x() {
    // If the image is smaller, it needs to go further to the right to be aligned with Gaja
    const position = this.world_x - this.initial_x // + this.offset_x
    const zOffset = this.anchor ? this.offset_z * 28 : 0
    return position - zOffset;
  }

  get y() {
    let zOffset = this.offset_z * 8
    zOffset = 0
    const delta = this.world_y - this.initial_y // + this.offset_y;
    const getParallaxFactor = (val: number): number => {
      return 10 ** (-val / 10);
    };
    // const parallax = ((1 + this.offset_z) / (20 - PARALLAX_INTENSITY))
    const parallax = getParallaxFactor(-this.offset_z)
    return delta * parallax - zOffset
  }

  get filter() {
    const offset = Math.abs(this.offset_z)
    const blur = offset < 2 ? 0 : offset * 1.5;
    return `blur(${blur}px)`
  }

  get left_viewport() {
    return this.y + this.top >= window.innerHeight
  }

  get style() {
    return {
      width: this.width,
      height: this.height,
      zIndex: this.offset_z,
      transform: this.transform,
      filter: this.filter,
      top: this.top,
      left: this.left,
    }
  }

  get transform() {
    let scale = 1 + this.offset_z / 20;
    if (scale < 0.2) {
      scale = 0.2
    }
    return `translate(${this.x}px, ${this.y}px) scale(${scale})`
  }
}

export class Branch extends Renderable {

  getElements(): Renderable[] {
    return [this];
  }

}

export class Cloud extends Renderable {

  getElements(): Renderable[] {
    return [this];
  }

  get transform() {
    const scale = 1 + this.offset_z / 10;
    return `translate(${this.x}px, ${this.y}px) scale(${scale})`
  }

  private opacity = () => {
    const min = 0.1, max = 0.5;
    // z: 1 has 0.5 opacity and each z removes 0.05 down to the min
    const opacity = max - (this.offset_z - 1) * 0.05;
    return opacity < min
      ? min
      : opacity > max
        ? max
        : opacity
  }

  get y() {
    let zOffset = this.offset_z * 8
    zOffset = 0
    const delta = this.world_y - this.initial_y + this.offset_y;
    const parallax = (1 + this.offset_z / (20 - PARALLAX_INTENSITY)) / 3
    return delta * parallax - zOffset
  }

  get style() {
    return {
      width: this.width,
      height: this.height,
      zIndex: this.offset_z,
      transform: this.transform,
      filter: this.filter + ' brightness(0.7) hue-rotate(-70deg)',
      opacity: this.opacity(),
      top: this.top,
      left: this.left,
    }
  }

}