import {Renderable} from "@/Game/RenderEngine/Renderable.ts";

const PARALLAX_INTENSITY = 12

export class Branch extends Renderable {

  get brightness() {
    const lighten = Math.abs(this.offset_z) * 0.23
    return 1 + lighten
  }

  get scale() {
    return 1
  }

  // This should equal z 10 and higher
  // brightness(3.3) hue-rotate(124deg) saturate(0.3) blur(10px)

  get hue_rotate() {
    return Math.abs(this.offset_z) * 12.4
  }

  get saturate() {
    const unsaturated = 1 - Math.abs(this.offset_z) * 0.2
    return unsaturated >= 0.1
      ? unsaturated
      : 0.1
  }

}

export class Cloud extends Renderable {

  get scale() {
    return 1 + this.offset_z / 10;
  }

  get opacity(){
    const min = 0.1, max = 0.5;
    // z: 1 has 0.5 opacity and each z removes 0.05 down to the min
    const opacity = max - (this.offset_z - 1) * 0.05;
    return opacity < min
      ? min
      : opacity > max
        ? max
        : opacity
  }

  get brightness() {
    return 0.7
  }

  get hue_rotate() {
    return -70
  }

  get y() {
    let zOffset = this.offset_z * 8
    zOffset = 0
    const delta = this.world_y - this.initial_y + this.offset_y;
    const parallax = (1 + this.offset_z / (20 - PARALLAX_INTENSITY)) / 2.5
    return delta * parallax - zOffset
  }

}

export class Mushroom extends Renderable {
  get scale() {
    return 0.4 * this.random_seed + 0.3
  }

  get hue_rotate() {
    return Math.round(this.random_seed * 16)
  }

  get brightness() {
    const rand = seedRandomFromString(this.id)
    return 0.6 * rand + 0.3
  }
}

export class ManaVein extends Renderable {

  get scale() {
    return 0.3 + this.random_seed * 0.2
  }
}

export class Element extends Renderable {
}

function seedRandomFromString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0; // unsigned 32-bit
  }
  return (hash % 1000000) / 1000000;
}