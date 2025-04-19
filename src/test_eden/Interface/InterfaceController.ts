import {makeAutoObservable} from "mobx";

export type InterfaceActiveLeft = 'faction' | 'player' | 'behemoth' | null;

export class InterfaceController {
  public selectionActiveLeft: InterfaceActiveLeft = 'faction';
  constructor() {
    makeAutoObservable(this)
  }
  public selectActiveLeft = (selection: InterfaceActiveLeft) => {
    if (this.selectionActiveLeft !== selection) {
      this.selectionActiveLeft = selection
    } else {
      this.selectionActiveLeft = null;
    }
  }
  public isActive = (key: InterfaceActiveLeft) => {
    return this.selectionActiveLeft === key
  }
}