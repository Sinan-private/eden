import {GameBaseClasses} from "../context/game.context.ts";
import {makeAutoObservable} from "mobx";

export type InterfaceActiveLeft = 'faction' | 'player' | 'behemoth' | null;

export class InterfaceController {
  public selectionActiveLeft: InterfaceActiveLeft = 'player';
  constructor(public game: GameBaseClasses) {
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