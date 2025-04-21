import {makeAutoObservable} from "mobx";
import mana_for_harvest_1 from "@/assets/images/Mana-for-harvest1.png";
import mana_for_harvest_2 from "@/assets/images/Mana-for-harvest2.png";
import mana_for_harvest_3 from "@/assets/images/Mana-for-harvest3.png";
import mana_for_harvest_4 from "@/assets/images/Mana-for-harvest4.png";
import mana_for_harvest_5 from "@/assets/images/Mana-for-harvest5.png";
import {id} from "@/Game/Resource/helpers/id.ts";

const POSITION_RANDOMNESS_ON_DESTRUCT = 5;
const MAX_X_POSITION = 90;

type DirtyManaImageCreation = {
  image: string;
  value: number;
}

type DirtyManaImage = {
  xPosition: number;
  yPosition: 'top' | 'bottom';
  id: string;
} & DirtyManaImageCreation


export class HarvestRenderClass {
  public id: string = id()
  public mana_images: DirtyManaImage[] = []
  private _harvestAccumulator = 0;

  constructor() {
    makeAutoObservable(this)
  }

  public harvestMana = (amount: number) => {
    this._harvestAccumulator += amount;
    let safety = 50;
    if (this._harvestAccumulator < 1) {
      return
    }

    while (this._harvestAccumulator >= 0 && this.mana_images.length > 0 && safety > 0) {
      const img = this.mana_images[0];
      safety--
      const isImageRemoved = this._harvestAccumulator >= img.value;
      const isImageDeconstructed = !isImageRemoved;

      if (isImageRemoved) {
        this._harvestAccumulator -= img.value;
        this.mana_images.shift();
      }
      if (isImageDeconstructed) {
        const remaining = img.value - Math.floor(this._harvestAccumulator);
        // This is the most relevant part. If an image with a value of 15 is reduced by 2 it will generate new images for 13 Mana
        // And place them close to the deconstructed mana crystal
        const newImages = getManaImageValues(remaining, img, POSITION_RANDOMNESS_ON_DESTRUCT)
        this.mana_images.shift();
        this.mana_images.unshift(...newImages)
        this._harvestAccumulator -= Math.floor(this._harvestAccumulator);
      }
    }
  }

  public createImages = (available_mana: number) => {
    const images = getManaImageValues(Math.ceil(available_mana))
    this.mana_images.push(...images)
  }

  public reset = () => {
    this._harvestAccumulator = 0;
    this.mana_images = [];
  }
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
  image?: DirtyManaImage,
  positionRandomizer = 0,
): DirtyManaImage[] {
  const result: DirtyManaImage[] = [];
  // const first = getBiggestPossibleFirst(dirtyMana, position)

  // Step 2: Fill the rest randomly while deducting
  while (dirtyMana > 0) {
    const possible = images.filter(({value}) => value <= dirtyMana);
    if (possible.length === 0) break;

    const randomValue = possible[Math.floor(Math.random() * possible.length)];
    const xPosition = randomisedPosition(image?.xPosition, positionRandomizer);
    const yPosition = image?.yPosition ? image.yPosition : Math.random() > 0.5 ? 'top' : 'bottom';
    result.push({
      ...randomValue,
      xPosition,
      yPosition,
      id: id(),
    });
    dirtyMana -= randomValue.value;
  }

  return result;
}

// const getBiggestPossibleFirst = (
//   dirtyMana: number,
//   position?: number,
// ) => {
// // Step 1: Add one image with the highest possible value
//
//   const result: DirtyManaImage[] = [];
//
//   const firstValue = images.find(({value}) => dirtyMana >= value);
//   if (!firstValue) return result;
//   result.push({
//     ...firstValue,
//     position: randomisedPosition(position),
//     id: id(),
//   });
//   dirtyMana -= firstValue.value;
//   return result
// }

const randomisedPosition = (
  position?: number,
  positionRandomizer = 0,
) => {
  const randomizedPosition = position
    ? position + Math.random() * positionRandomizer - positionRandomizer / 2
    : Math.random() * MAX_X_POSITION
  return randomizedPosition < 0
    ? 0
    : randomizedPosition > MAX_X_POSITION
      ? MAX_X_POSITION
      : randomizedPosition;
}
