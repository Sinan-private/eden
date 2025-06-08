import {GameEngine, ResourceKeys} from "src/GameEngine";
import { GetValueCallback, ResourceEvaluationProps} from "@/GameEngine/EventEngine/types.ts";
import {GameEvent} from "@/GameEngine/EventEngine/GameEvent.ts";

// game.resources.getByKey, parent.key
export class ResourceTrigger {
  factor: 'min' | 'max'
  key: ResourceKeys
  private _value: GetValueCallback
  constructor(
    props: ResourceEvaluationProps,
    private game: GameEngine,
    private parent: GameEvent,
  ) {
    this.key = props.key
    this.factor = props.factor || 'min'
    this._value = this._getValue(props.value)
  }

  private _getValue = (value: number | GetValueCallback): GetValueCallback => {
    if (typeof value === 'number') {
      return () => value
    }
    return value
  }

  get value(): number {
    return this._value(this.game, this.parent, this.key)
  }

  get isCompleted(): boolean {
    const {value} = this.game.resources.getByKey(this.key)
    const needed = this.value
    return this.factor === 'min'
      ? value >= needed
      : value <= needed;
  }
}
