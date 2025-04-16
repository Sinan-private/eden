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

type DirtyManaImage = {
  image: string;
  value: number;
}


export class HarvestRenderClass {
  public id: string = id()
  private available_mana: number = 0;
  public mana_images: DirtyManaImage[] = []
  constructor(
    private readonly _resourceStore: ResourceStoreClass,
    // private readonly _behemoth: BehemothClass
  ) {
    // console.log(!_behemoth.is_flushing_mana, _resourceStore.getTypeSum('dirty_mana'))
    console.log('HarvestRenderClass', _resourceStore.id)
    makeAutoObservable(this)
  }
  public turnUpdate = (): void => {
    const dirty_mana = this._resourceStore.getTypeSessionSum('dirty_mana')
    // console.log(this._resourceStore.getByKey('dirty_mana_level_1').value)
    console.log(this._resourceStore.id)
    if (!dirty_mana) {
      return
    }
    console.log(dirty_mana, this.available_mana)
    this.available_mana = dirty_mana
    // console.log('me', this.id)
  }
}

const images: DirtyManaImage[] = [
  {
    image: mana_for_harvest_1,
    value: 1,
  },
  {
    image: mana_for_harvest_2,
    value: 5,
  },
  {
    image: mana_for_harvest_3,
    value: 15,
  },
  {
    image: mana_for_harvest_4,
    value: 25,
  },
  {
    image: mana_for_harvest_5,
    value: 50,
  },
]

function getManaImageValues(dirtyMana: number): DirtyManaImage[] {
  // const imageValues = [50, 25, 15, 5, 1];
  const result: DirtyManaImage[] = [];

  // Step 1: Add one image with the highest possible value
  const firstValue = images.find(({value}) => dirtyMana >= value);
  if (!firstValue) return result;

  result.push(firstValue);
  dirtyMana -= firstValue.value;

  // Step 2: Fill the rest randomly while deducting
  while (dirtyMana > 0) {
    const possible = images.filter(({value}) => value <= dirtyMana);
    if (possible.length === 0) break;

    const randomValue = possible[Math.floor(Math.random() * possible.length)];
    result.push(randomValue);
    dirtyMana -= randomValue.value;
  }

  return result;
}
