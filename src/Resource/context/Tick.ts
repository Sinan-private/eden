import {makeAutoObservable} from "mobx";
import {id} from "@/Resource/helpers/id.ts";

const TICKS_PER_SECOND = 4
const TICKS_PER_TURN = 5


export class Tick {
  id: string = id()
  private tickInterval: NodeJS.Timeout | null = null;
  public tick_index: number = 0;
  subscribers = new Set<(tick: number) => void>();
  constructor() {
    makeAutoObservable(this);
  }

  public start = () => {
    if (this.tickInterval) return;
    this.tickInterval = setInterval(() => this.nextTick(), 1000 / TICKS_PER_SECOND); // 1 second per tick
  }

  public stop = () => {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  nextTick() {
    console.log(Array.from(this.subscribers))
    const first = this.subscribers.values().next().value;
    const second = [...this.subscribers][1]
    console.log(first, second);
    console.log(first === second);
    this.tick_index++;
    this.subscribers.forEach((cb) => cb(this.tick_index));
  }

  get isActive() {
    return !!this.tickInterval
  }


  private isNextTurn = () => {
    return !(this.tick_index % TICKS_PER_TURN)
  }


  public subscribe = (callback: (tick: number) => void): () => void => {
    console.log("Subscribing", callback);
    this.subscribers.add(callback);

    // return () => {
    //   console.log("Unsubscribing", callback);
    //   console.log("Unsubscribing", this.subscribers.delete(callback));
    //   // this.subscribers.delete(callback);
    // };
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback); // return unsubscribe
  }
}