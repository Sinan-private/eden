import {ResourceClass, ResourceKeys} from "../../Resource";
import {makeAutoObservable} from "mobx";
import {id} from "../../Resource/helpers/id.ts";

export class BehemothClass {
  id: string;
  public movementRequested: boolean;
  public readyToMove: boolean; // calculated
  public climb_height: ResourceClass;
  public climb_speed: ResourceClass;
  public digging_depth: ResourceClass;

  constructor(states: ResourceClass[]) {
    const find = (key: ResourceKeys)=> states.find(resource => key === resource.key)!;
    // console.log("BehemothClass constructor called", this);
    this.id = id();
    this.climb_height = find('behemoth_climb_height')
    this.climb_speed = find('behemoth_climb_speed')
    this.digging_depth = find('behemoth_digging_depth')
    this.movementRequested = false;
    this.readyToMove = true;
    console.log(this.digging_depth)
    makeAutoObservable(this)
  }

  get decelerating() {
    return !this.movementRequested && !!this.climb_speed.value;
  }

  get accelerating() {
    return this.movementRequested && this.climb_speed.value < this.climb_speed.max;
  }

  get inMotion() {
    return !!this.climb_speed.value || this.movementRequested;
  }

  public startClimbing = () => {
    console.log("Starting Climbing!");
    this.movementRequested = true;
  }
  public stopClimbing = () => {
    console.log("Stop Climbing!");
    this.movementRequested = false;
  }
}