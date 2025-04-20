import {action, IReactionDisposer, makeAutoObservable, reaction, runInAction} from "mobx";

const TICKS_PER_SECOND = 4
const TICKS_PER_TURN = 5


export class Tick {
  private tickInterval: number | null = null;
  public tick_index: number = 0;
  constructor() {
    makeAutoObservable(this);
  }

  public start = () => {
    console.log(this)
    if (this.tickInterval) return; // already running

    this.tickInterval = window.setInterval(() => {
      runInAction(() => {
        // this.tick();
        if (this.isNextTurn()) {
          console.log(this.tick_index)
          // this.turn();
        }
        this.tick_index++;
      });
    }, 1000 / TICKS_PER_SECOND); // 1 second per tick
  }

  public stop = () => {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  get isActive() {
    return !!this.tickInterval
  }


  private isNextTurn = () => {
    return !(this.tick_index % TICKS_PER_TURN)
  }


  public subscribe = (callback: (tickIndex: number) => void): IReactionDisposer => {
    return reaction(
      () => this.tick_index,
      (tickIndex) => callback(tickIndex)
    );
  }
  public subscribeToTurn = (callback: (tickIndex: number) => void) => {
    return reaction(
      () => this.tick_index,
      (tickIndex) => {
        if (this.isNextTurn()) {
          callback(tickIndex)
        }
      }
    );
  }
}