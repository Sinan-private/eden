import {makeAutoObservable} from "mobx";
import {id} from "@/GameEngine/ResourceEngine/helpers/id.ts";
import {GlobalBreath} from "@/GameEngine/Tick/GlobalBreath.ts";

export type TickCreationProps = {
  ticks_per_second?: number;
  ticks_per_turn?: number;
  auto_start?: boolean;
}

export type Subscription = {
  callback: (tick: number) => void;
  interval: 'tick' | 'turn'
}

const breath = new GlobalBreath(80);

export class Tick {
  public id: string = id()
  public tick_index: number = 0;
  public subscribers = new Map<string, Subscription>();
  public _ticks_per_second = 40;
  public _ticks_per_turn = 20;
  private tickInterval: NodeJS.Timeout | null = null;
  private _breath = breath;

  constructor(config?: TickCreationProps) {
    if (config?.ticks_per_second) {
      this.setTicksPerSecond(config.ticks_per_second)
    }
    if (config?.ticks_per_turn) {
      this.setTicksPerTurn(config.ticks_per_turn)
    }
    if (config?.auto_start) {
      this.start()
    }
    makeAutoObservable(this);
  }

  public start = () => {
    if (this.tickInterval) return;
    this.tickInterval = setInterval(() => this._nextInterval(), 1000 / this.ticks_per_second); // 1 second per tick
  }

  public stop = () => {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  public setTicksPerSecond = (ticksPerSecond: number) =>
    this._ticks_per_second = ticksPerSecond;

  public setTicksPerTurn = (ticksPerTurn: number) =>
    this._ticks_per_turn = ticksPerTurn;

  public perSecond = (number: number) =>
    number / this._ticks_per_second

  public subscribeToTick = (callback: (tick: number) => void, id: string): () => void => {
    this.subscribers.set(id, {callback, interval: 'tick'});
    return () => this.subscribers.delete(id); // return unsubscribe
  }
  public subscribeToTurn = (callback: (tick: number) => void, id: string): () => void => {
    this.subscribers.set(id, {callback, interval: 'turn'});
    return () => this.subscribers.delete(id); // return unsubscribe
  }

  public ticksElapsed = (ticks: number) => this.current_tick - ticks
  public turnsElapsed = (turns: number) => this.current_turn - turns

  get tickSubscribers() {
    return this._getSubscribersByType('tick')
  }

  get turnSubscribers() {
    return this._getSubscribersByType('turn')
  }

  get isActive() {
    return !!this.tickInterval
  }

  get ticks_per_second() {
    return this._ticks_per_second
  }

  get turns_per_second() {
    return this.ticks_per_second / this.ticks_per_turn
  }

  get ticks_per_turn() {
    return this._ticks_per_turn
  }

  get current_tick() {
    return this.tick_index
  }

  get current_turn() {
    return Math.floor(this.current_tick / this.ticks_per_turn)
  }

  get breath(): number {
    return this._breath.value
  }

  private isNextTurn = () => {
    return !(this.tick_index % this.ticks_per_turn)
  }

  private _nextInterval() {
    this.tick_index++;
    this._nextTick()
    if (this.isNextTurn()) {
      this._nextTurn()
    }
  }

  private _nextTick() {
    this.tick_index++;
    this._breath.update(this.tick_index)
    this.tickSubscribers.forEach((callback) => callback(this.tick_index))
  }

  private _nextTurn() {
    this.turnSubscribers.forEach((callback) => callback(this.tick_index))
  }

  private _getSubscribersByType = (type: 'tick' | 'turn'): Subscription['callback'][] =>
    Array.from(this.subscribers)
      .filter(([, {interval}]) => interval === type)
      .map(([,{callback}]) => callback)


}
