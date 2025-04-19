import {ResourceClass} from "@/Resource";
import {HealthCalculation} from "@/components/Constructors/HealthCalculation.ts";

export class SegmentedPower {
  constructor(
    private resource: ResourceClass,
    public segments: number
  ) {
  }

  public getStatus = () => {
    const thresholds = this._getThresholds()
    return new HealthCalculation({...this.resource.state, thresholds})
  }
  public spendPoints = (amount: number, onSuccess?: () => boolean) => {
    if (this.can_spend < amount) return
    const cost = this.step * amount
    if(onSuccess) {
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

  get state() {
    return {}
  }
}