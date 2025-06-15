import {randomRange} from "@/Game/helpers/randomRange.ts";
import branch_image1 from "@/assets/images/Branch3.png";
import branch_image2 from "@/assets/images/Branch4.png";
import branch_image3 from "@/assets/images/Branch5.png";
import branch_image7 from "@/assets/images/Branch7.png";
import {id} from "@/GameEngine/ResourceEngine/helpers/id.ts";
const PARALLAX_INTENSITY = 12

export class Branch {
  public id = id();
  public readonly image: string;
  public readonly z: number;
  public readonly x: number;
  public y: number;
  private _original_y: number;
  public new_y: number = 0;

  constructor(y: number, _original_height: number ) {
    this.y = y;
    this._original_y = y;
    // this.new_y = _original_height - y;
    this.image = randomBranchImage();
    this.z = randomRange(1, 5);
    this.x = randomRange(70, 300);
  }

  public getPosition = (y: number) => ({
    x: this.x,
    y: this._getCurrentY(y)
  })

  public updateY = (current_height: number) => {
    const y_delta = (current_height - this._original_y)
    const parallax = (1 - this.z / (20 - PARALLAX_INTENSITY))
    const y = y_delta * parallax - 500
    this.new_y = y
  }

  get should_be_removed() {
    // console.log(this.new_y)
    return this.new_y > window.innerHeight
  }

  private _getCurrentY = (y: number): number => {
    const y_delta = (y - this.y)
    const parallax = (1 - this.z / (20 - PARALLAX_INTENSITY))
    return y_delta * parallax - 500
  }
}

const randomBranchImage = () => branch_images[randomRange(0, branch_images.length - 1)]
const branch_images = [
  branch_image1,
  branch_image2,
  branch_image3,
  branch_image7,
]
