import {makeAutoObservable} from "mobx";
import branch_image1 from "../../assets/images/Branch3.png";
import branch_image2 from "../../assets/images/Branch4.png";
import branch_image3 from "../../assets/images/Branch5.png";
import branch_image7 from "../../assets/images/Branch7.png";
import {randomRange} from "../helpers/randomRange.ts";

// Todo the MIN_DISTANCE_TO_REMOVE is unnecessarily high. The calculation for removal does not
//  include the z index yet

const MIN_DISTANCE_TO_LAST_BRANCH = 200
const MIN_DISTANCE_TO_REMOVE = 3000
const BRANCH_AMOUNT = 15
const PARALLAX_INTENSITY = 12

type BranchState = {
  image: string;
  z: number;
  x: number;
  y: number; // should be y
}


export class BranchClass {
  private _branches: BranchState[];
  // private _branches: Map<number, BranchState> = new Map<number, BranchState>();
  constructor(starting_branches: number) {
    this._branches = this._initialBranches(starting_branches);
    makeAutoObservable(this)
  }
  
  private _initialBranches = (starting_branches: number) => {
    return Array.from(Array(starting_branches)).map(() =>
      // this._createBranch(-2000)
      this._createBranch(randomRange(-2000, -300))
  )}

  public addBranch = (y: number) => {
    this._branches.push(this._createBranch(y))
  }
  private _createBranch = (y: number) => ({
    y,
    image: randomBranchImage(),
    z: randomRange(1, 5),
    x: randomRange(70, 300),
  })

  public getRandomImage = () => branch_images[randomRange(0, branch_images.length - 1)]
  public _shouldCreateBranch = (y: number) => {
    const minDistanceToLastBranch = (this.newest_branch?.y || 0) - y < -MIN_DISTANCE_TO_LAST_BRANCH
    // console.log('minDistanceToLastBranch', minDistanceToLastBranch)
    // const isLucky = Math.random() < chanceForBranch(this._branches.length)
    return chanceForBranch(this._branches.length) && minDistanceToLastBranch
  }

  public getPosition = (i: number, y: number) => {
    const y_delta = (y - this._branches[i].y)
    const parallax = (1 - this._branches[i].z / (20 - PARALLAX_INTENSITY))
    // console.log(y_delta * parallax - 500)
    return y_delta * parallax - 500
    // return (y - this._branches[i].y) * (1 - this._branches[i].z / PARALLAX_INTENSITY) - 500
  }

  private _removeOldest = () => {
    this._branches = this._branches.slice(1, this._branches.length)
    // this._branches.pop();
  }

  get oldest_branch() {
    return this._branches[0];
  }

  get newest_branch() {
    return this._branches[this._branches.length - 1];
  }

  get branches() {
    return this._branches
  }

  private _shouldRemoveBranch = (y: number) => {
    return typeof this.oldest_branch?.y === 'number'
      ? y - this.oldest_branch?.y > MIN_DISTANCE_TO_REMOVE
      : false
  }

  public turnUpdate = (y: number) => {
    if (this._shouldRemoveBranch(y)) {

      // console.log('remove oldest', toJS(this._branches))
      // console.log('y', y)
      this._removeOldest()
    }
    if (this._shouldCreateBranch(y)) {
      // console.log('y', y)
      // console.log('current y', y - this.oldest_branch?.y)
      // console.log('add new branch', this._branches.length)
      // console.log('chance', (this._branches.length * 75) / 100)
      // console.log('_shouldRemoveBranch', this._shouldRemoveBranch(y))
      // console.log('oldest y', this.oldest_branch?.y)
      // console.log('-----')
      this.addBranch(y)
    }
  }
}


const chanceForBranch = (currentBranches = 0) => {
  // For 10 it should be 0 for 1 hundred
  const chance = (1 - currentBranches / BRANCH_AMOUNT)
  return Math.random() < chance
}

const randomBranchImage = () => branch_images[randomRange(0, branch_images.length - 1)]

const branch_images = [
  branch_image1,
  branch_image2,
  branch_image3,
  branch_image7,
]