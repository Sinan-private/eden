import {makeAutoObservable} from "mobx";
import {Branch} from "@/Game/Views/Gaja/Branch.ts";
import {randomRange} from "@/Game/helpers/randomRange.ts";

const defaultConfig = {
  min_distance_to_last_branch: 200,
  visible_height: 3000,
  branch_amount: 10,
}

export type BranchConfig = {
  min_distance_to_last_branch: number;
  visible_height: number;
  branch_amount: number;
}

export class BranchManager {
  private _branches: Branch[] = [];
  private _height = 0;
  private config: BranchConfig;

  constructor(private _initial_height: number, _config?: Partial<BranchConfig>) {
    const safe_config = {
      ...defaultConfig,
      ..._config,
    }
    this.config = safe_config;
    this._branches = Array.from({ length: safe_config.branch_amount }, () => new Branch(randomRange(-2000, -300), _initial_height));
    makeAutoObservable(this);
  }

  public get branches() {
    return this._branches;
  }

  get ordered_branches() {
    return this._branches.slice().sort((a, b) => a.new_y - b.new_y)
  }

  get highest() {
    return this._branches.length
      ? this.ordered_branches[0]
      : null
  }
  get lowest() {
    if (!this._branches.length) return null
    const sorted = this.ordered_branches
    return sorted[sorted.length - 1]
  }

  public get oldest() {
    return this._branches[0];
  }

  public get newest() {
    return this._branches[this._branches.length - 1];
  }

  public branchPosition = (index: number) => {
    return this.branches[index].getPosition(this._height);
  }

  private _removeLowest = () => {
    this._branches = this._branches.filter(({should_be_removed}) => !should_be_removed);
  }

  public subscription = (climbing_height: number) => {
    this._height = climbing_height - this._initial_height
    this._removeLowest()
    if (this.shouldCreateNew(this._height)) {
      // Todo This is the issue now. New branches should appear at the proper position
      this._branches.push(new Branch(this._height - randomRange(-200, 300), this._height));
    }
    this._branches.forEach((branch) => branch.updateY(this._height))
  }

  // Stupid because of initial creation. Remove the highest one
  private shouldRemoveOldest(y: number): boolean {
    return this.oldest ? this.oldest.should_be_removed : false;
    // return this.oldest ? y - this.oldest.y > MIN_DISTANCE_TO_REMOVE : false;
  }

  private shouldCreateNew(y: number): boolean {
    const chanceForBranch = (currentBranches = 0) => {
      // For 10 it should be 0 for 1 hundred
      const chance = (1 - currentBranches / this.config.branch_amount)
      return Math.random() < chance
    }
    const farEnough = !this.newest || this.newest.y - y < - this.config.min_distance_to_last_branch;
    return chanceForBranch(this._branches.length) && farEnough

  }
}

