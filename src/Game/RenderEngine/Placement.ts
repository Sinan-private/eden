import {imageProvider} from "@/Game/RenderEngine/ImageProvider.ts";
import {PlacementProps} from "@/Game/RenderEngine/types.ts";

export class Placement {
  x: number;
  y: number;
  z: number;
  width: number; // Let's see if they are really needed
  height: number;
  anchor: {
    key: 'gaja' | 'window' | 'custom',
    w: number;
    h: number;
  };
  constructor(props: PlacementProps) {
    this.x = props.x;
    this.y = props.y;
    this.z = props.z;
    this.width = props.width;
    this.height = props.height;
    this.anchor = this._createAnchor(props.anchor)
  }
  private _createAnchor = (anchor: PlacementProps['anchor']): Placement['anchor'] => {
    if (typeof anchor === 'object') {
      return {
        key: 'custom',
        ...anchor
      }
    }
    if (anchor === 'gaja') {
      return {
        key: 'gaja',
        ...imageProvider.getGajaSize
      }
    }
    return {
      key: 'window',
      w: window.innerWidth,
      h: window.innerHeight
    }
  }

  get position_outside_parent() {
    const x_percent = (this.x ?? 0) / 100;
    const y_percent = (this.y ?? 0) / 100;
    const x_invert_percent = 1 - x_percent;
    const y_invert_percent = 1 - y_percent;
    const top = (-this.height * y_invert_percent) + (this.anchor.h * y_percent)
    const left = (-this.width * x_invert_percent) + (this.anchor.w * x_percent)
    return {top, left}
  }

  get position_inside_parent() {
    const x_percent = (this.x ?? 0) / 100;
    const y_percent = (this.y ?? 0) / 100;
    const x_invert_percent = 1 - x_percent;
    const y_invert_percent = 1 - y_percent;
    const top = (-this.height * y_percent) + (this.anchor.h)
    const left = (-this.width * x_invert_percent) + (this.anchor.w * x_percent)
    return {top, left}
  }
}
