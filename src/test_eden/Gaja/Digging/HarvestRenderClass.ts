import {makeAutoObservable} from "mobx";
import mana_for_harvest_1 from "@/assets/images/Mana-for-harvest1.png";
import mana_for_harvest_2 from "@/assets/images/Mana-for-harvest2.png";
import mana_for_harvest_3 from "@/assets/images/Mana-for-harvest3.png";
import mana_for_harvest_4 from "@/assets/images/Mana-for-harvest4.png";
import mana_for_harvest_5 from "@/assets/images/Mana-for-harvest5.png";
import {id} from "@/Resource/helpers/id.ts";

// Todo: What I actually want
//  - As long as mana is flushed the value here raises.
//  - As soon as the flushing stops the images are created
//  - When flushing is restarted the number raises again and if it stops the new images are concatenated
//  - When harvesting starts the first image is broken into pieces the same way images are initially created
//  - Meaning one image will always show the highest possible image and the rest fills the gaps
//  - Note: While images are broken down (on harvest) the should respct the original position

type DirtyManaImageCreation = {
  image: string;
  value: number;
}

type DirtyManaImage = {
  position: number;
  id: string;
} & DirtyManaImageCreation


export class HarvestRenderClass {
  public id: string = id()
  public mana_images: DirtyManaImage[] = []
  private _harvestAccumulator = 0;

  constructor(
  ) {
    makeAutoObservable(this)
  }

  public harvestMana = (amount: number) => {
    this._harvestAccumulator += amount;
    let safety = 50;
    // console.log(this._harvestAccumulator)
    if (this._harvestAccumulator < 1) {
      return
    }
    const calculated_image_sum = Object.values(this.mana_images).reduce((a, {value}) => a + value, 0);
    console.log(calculated_image_sum)

    while (this._harvestAccumulator > 0 && this.mana_images.length > 0 && safety > 0) {
      const img = this.mana_images[0];
      safety --

    //     console.log(this._harvestAccumulator)
      if (this._harvestAccumulator >= img.value) {
        // console.log('remove image', img.value)
        this._harvestAccumulator -= img.value;
        this.mana_images.shift();
      } else {

        const remaining = img.value - this._harvestAccumulator;
        const newImages = getManaImageValues(remaining, img.position, 20)
        // console.log('deconstruct image', img.value);
        this.mana_images.shift();
        this.mana_images.push(...newImages)
        // console.log(remaining);
        // console.log(newImages, this.mana_images);
        // img.value -= this._harvestAccumulator;
        this._harvestAccumulator = 0;
      }
    }
  }

  public createImages = (available_mana: number, position?: number) => {
    console.log('stop flushing', available_mana)
    this.mana_images = getManaImageValues(Math.ceil(available_mana), position)
  }

  public reset = () =>
    this.mana_images = [];
}

const images: DirtyManaImageCreation[] = [
  {
    image: mana_for_harvest_1,
    value: 50,
  },
  {
    image: mana_for_harvest_2,
    value: 25,
  },
  {
    image: mana_for_harvest_3,
    value: 15,
  },
  {
    image: mana_for_harvest_4,
    value: 5,
  },
  {
    image: mana_for_harvest_5,
    value: 1,
  },
]

function getManaImageValues(
  dirtyMana: number,
  position?: number,
  positionRandomiser = 0,
): DirtyManaImage[] {
  // const imageValues = [50, 25, 15, 5, 1];
  const result: DirtyManaImage[] = [];
  const randomisedPosition = () => {
    const randomizedPosition = position
      ? position + Math.random() * positionRandomiser - positionRandomiser / 2
      : Math.random() * 100
    return randomizedPosition < 0
      ? 0
      : randomizedPosition > 100
        ? 100
        : randomizedPosition;
  }

  // Step 1: Add one image with the highest possible value
  // const firstValue = images.find(({value}) => dirtyMana >= value);
  // if (!firstValue) return result;
  // result.push({
  //   ...firstValue,
  //   position,
  //   id: id(),
  // });
  // dirtyMana -= firstValue.value;

  // Step 2: Fill the rest randomly while deducting
  while (dirtyMana > 0) {
    const possible = images.filter(({value}) => value <= dirtyMana);
    if (possible.length === 0) break;

    const randomValue = possible[Math.floor(Math.random() * possible.length)];
    result.push({
      ...randomValue,
      position: randomisedPosition(),
      id: id(),
    });
    dirtyMana -= randomValue.value;
  }

  return result;
}
