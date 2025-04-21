import {makeAutoObservable} from "mobx";
import {id} from "@/Game/Resource/helpers/id.ts";

const TICKS_PER_SECOND = 40
const TICKS_PER_TURN = 20

export type Subscription = {
  callback: (tick: number) => void;
  interval: 'tick' | 'turn'
}

export class Tick {
  id: string = id()
  private tickInterval: NodeJS.Timeout | null = null;
  public tick_index: number = 0;
  subscribers = new Map<string, Subscription>();

  constructor() {
    makeAutoObservable(this);
  }

  public start = () => {
    if (this.tickInterval) return;
    this.tickInterval = setInterval(() => this.nextInterval(), 1000 / TICKS_PER_SECOND); // 1 second per tick
  }

  public stop = () => {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  nextInterval() {
    this.tick_index++;
    this.nextTick()
    if (this.isNextTurn()) {
      this.nextTurn()
    }
  }

  nextTick() {
    this.tick_index++;
    this.subscribers.forEach(({callback, interval}) => {
      if (interval === 'tick') {
        callback(this.tick_index)
      }
    })
  }

  nextTurn() {
    this.subscribers.forEach(({callback, interval}) => {
      if (interval === 'turn') {
        callback(this.tick_index)
      }
    });
  }

  get isActive() {
    return !!this.tickInterval
  }

  private isNextTurn = () => {
    return !(this.tick_index % TICKS_PER_TURN)
  }

  public subscribeToTick = (callback: (tick: number) => void, id: string): () => void => {
    this.subscribers.set(id, {callback, interval: 'tick'});
    return () => this.subscribers.delete(id); // return unsubscribe
  }
  public subscribeToTurn = (callback: (tick: number) => void, id: string): () => void => {
    this.subscribers.set(id, {callback, interval: 'turn'});
    return () => this.subscribers.delete(id); // return unsubscribe
  }
}
