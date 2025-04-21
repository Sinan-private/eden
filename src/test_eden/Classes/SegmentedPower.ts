import {HealthCalculation} from "@/Game/components/Constructors/HealthCalculation.ts";
import {ResourceClass} from "src/Game/Resource";

export class SegmentedPower {
  public thresholds: number[]

  constructor(
    private resource: ResourceClass,
    public segments: number
  ) {
    this.thresholds = this._getThresholds()
  }

  public getStatus = () => {
    const thresholds = this.thresholds
    return new HealthCalculation({...this.resource.state, thresholds})
  }

  public spendPoints = (amount: number, onSuccess?: () => boolean) => {
    if (this.can_spend < amount) return
    const cost = this.step * amount
    if (onSuccess) {
      const success = onSuccess()
      if (success) {
        this.resource.updateValueBy(-cost)
      }
    }
  }

  private _getThresholds = () => {
    const step = 100 / this.segments
    const result: number[] = []
    for (let i = 1; i < this.segments; i++) {
      result.push(step * i)
    }
    return result
  }

  get achieved_thresholds() {
    return this.getStatus().achieved_thresholds
  }

  get step() {
    return 100 / this.segments
  }

  get can_spend() {
    return this.achieved_thresholds.index
  }

  get value() {
    return this.resource.value
  }

  get status() {
    return {
      value: this.resource.value,
      thresholds: this.thresholds,
    }
  }
  get state() {
    return this.resource.state
  }
}