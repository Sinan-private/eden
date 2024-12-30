import {ResourceClass} from "../../Resource";
import {makeAutoObservable} from "mobx";

export class BehemothClass {
  constructor(states: ResourceClass[]) {
    console.log("BehemothClass constructor called", states);
    makeAutoObservable(this)
  }
}