import {makeAutoObservable} from "mobx";
import {ResourceStoreClass} from "@/Resource";
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
  private harvested_mana: number = 0;
  public mana_images: DirtyManaImage[] = []

  constructor(
    private readonly _resourceStore: ResourceStoreClass,
    private available_mana = 0
  ) {
    if (available_mana >= 1) {
      this.stopFlushing()
    }
    makeAutoObservable(this)
  }

  public stopFlushing = () => {
    this.mana_images = getManaImageValues(this.available_mana)
  }

  public turnUpdate = (): void => {
    const dirty_mana = this._resourceStore.getTypeSessionSum('dirty_mana')
    if (!dirty_mana) {
      return
    }
    this.available_mana = dirty_mana
  }

  public getManaImages = () => {
    // Todo I want the first in the list to get deconstructed.
    //  Meaning I want to return the list but replace the first entry with an instance of this constructor
    //  set to the remaining value. Meaning it recreates while it is harvested
    //  ---> Shit. The harvesting is done by Arwa I think.
    //  !!This is not a clean setup. One master component should handle the harvest!!
    if (!this.mana_images.length) return []
    const [raw_first, ...rest] = this.mana_images
    // console.log(this.mana_images.map(({value}) => value))
    // console.log(raw_first.value, this.harvested_mana)
    // const first = new HarvestRenderClass(this._resourceStore, raw_first.value - this.harvested_mana).getManaImages()
    return [raw_first, ...rest]
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

function getManaImageValues(dirtyMana: number): DirtyManaImage[] {
  console.log('Mana to turn', dirtyMana)
  // const imageValues = [50, 25, 15, 5, 1];
  const result: DirtyManaImage[] = [];

  // Step 1: Add one image with the highest possible value
  const firstValue = images.find(({value}) => dirtyMana >= value);
  if (!firstValue) return result;
  console.log('first', firstValue.value)
  const position = Math.floor(Math.random() * 100);
  result.push({
    ...firstValue,
    position,
    id: id(),
  });
  dirtyMana -= firstValue.value;

  // Step 2: Fill the rest randomly while deducting
  while (dirtyMana > 0) {
    const possible = images.filter(({value}) => value <= dirtyMana);
    if (possible.length === 0) break;
    const position = Math.floor(Math.random() * 100);

    const randomValue = possible[Math.floor(Math.random() * possible.length)];
    result.push({
      ...randomValue,
      position,
      id: id(),
    });
    dirtyMana -= randomValue.value;
  }

  return result;
}
