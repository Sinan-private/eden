import {makeAutoObservable} from "mobx";
import {Branch} from "@/Game/Views/Gaja/Branch.ts";
import {randomRange} from "@/Game/helpers/randomRange.ts";
import {CLIMBING_SPEED_COEFFICIENT} from "@/Game/constants/constants.ts";

const MIN_DISTANCE_TO_LAST_BRANCH = 200
const MIN_DISTANCE_TO_REMOVE = 3000
const BRANCH_AMOUNT = 15

const defaultConfig = {
  min_distance_to_last_branch: 200,
  visible_height: 3000,
  branch_amount: 15,
}

export type BranchConfig = {
  min_distance_to_last_branch: number;
  visible_height: number;
  branch_amount: number;
}

export class BranchManager {
  private _branches: Branch[] = [];
  private _height = 0;

  constructor(private _initial_height: number, config?: Partial<BranchConfig>) {
    const safe_config = {
      ...defaultConfig,
      ...config,
    }
    this._branches = Array.from({ length: safe_config.branch_amount }, () => new Branch(randomRange(-2000, -300)));
    makeAutoObservable(this);
  }

  public get branches() {
    return this._branches;
  }

  public get oldest() {
    return this._branches[0];
  }

  public get newest() {
    return this._branches[this._branches.length - 1];
  }

  public turnUpdate(currentY: number) {
    if (this.shouldRemoveOldest(currentY)) {
      this._branches.shift(); // remove first
    }

    if (this.shouldCreateNew(currentY)) {
      this._branches.push(new Branch(currentY));
    }
  }

  public branchPosition = (index: number) => {
    return this.branches[index].getPosition(this._height);
  }

  public subscription = (climbing_speed: number) => {
    console.log('tick')
    const newPosition = (this._height + climbing_speed * CLIMBING_SPEED_COEFFICIENT)
    this._height = newPosition
  }

  private shouldRemoveOldest(y: number): boolean {
    return this.oldest ? y - this.oldest.y > MIN_DISTANCE_TO_REMOVE : false;
  }

  private shouldCreateNew(y: number): boolean {
    const farEnough = !this.newest || this.newest.y - y < -MIN_DISTANCE_TO_LAST_BRANCH;
    return chanceForBranch(this._branches.length) && farEnough

  }
}

const chanceForBranch = (currentBranches = 0) => {
  // For 10 it should be 0 for 1 hundred
  const chance = (1 - currentBranches / BRANCH_AMOUNT)
  return Math.random() < chance
}
