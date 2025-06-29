import {makeAutoObservable} from "mobx";

export class GlobalBreath {
  private current_tick: number = 0;
  private direction: 1 | -1 = 1;
  public value: number = 0;

  constructor(
    private duration_in_ticks: number = 100 // ms for one phase (in or out)
  ) {
    makeAutoObservable(this)
  }

  public update() {
    this.current_tick++;

    const t = Math.min(this.current_tick / this.duration_in_ticks, 1);
    const eased = easeInOut(t)

    this.value = this.direction === 1
      ? eased
      : 1 - eased;

    if (t >= 1) {
      this.direction *= -1;
      this.current_tick = 0;
    }
  }
}

function easeInOut(t: number): number {
  return 0.5 * (1 - Math.cos(Math.PI * t));
}