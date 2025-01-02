import branch_image1 from "../../assets/images/Branch3.png";
import branch_image2 from "../../assets/images/Branch4.png";
import branch_image3 from "../../assets/images/Branch5.png";
import branch_image7 from "../../assets/images/Branch7.png";
import {randomRange} from "../Classes/Slaves/helpers/randomRange.ts";
import {makeAutoObservable} from "mobx";

type BranchState = {
  displacement: number; // should be y
  image: string;
  distance: number;
  x: number;
}


export class BranchClass {
  private _branches: Map<number, BranchState> = new Map<number, BranchState>();
  constructor(starting_branches: number) {
    this._branches = new Map();
    makeAutoObservable(this)
  }

  public addBranch = (displacement: number) => {
    this._branches.set(displacement, {
      displacement: displacement,
      image: randomBranchImage(),
      distance: randomRange(1, 5),
      x: randomRange(0, 300),
    })
  }

  public _shouldCreateBranch = (displacement: number) => {
    const minDistanceToLastBranch = (this._branches.get(displacement)?.displacement || 0) - displacement < -200
    // const minDistanceToLastBranch = (branches[branches.length - 1]?.displacement || 0) - displacement < -200
    const isLucky = Math.random() < chanceForBranch(this._branches.size)
    return isLucky && minDistanceToLastBranch
  }

  get branches() {

  }

  public turnUpdate = (displacement: number) => {

  }
}

const chanceForBranch = (branchAmount: number) => {
  // I want between 0 and 3 branches to exist at the same time
  // 3 - 0%  - 0%
  // 2 - 25% - 2%
  // 1 - 50% - 4%
  // 0 - 75% - 6%
  return (30 - branchAmount * 10) / 100
}

const randomBranchImage = () => branch_images[randomRange(0, branch_images.length - 1)]

const branch_images = [
  branch_image1,
  branch_image2,
  branch_image3,
  branch_image7,
]