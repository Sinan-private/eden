import {RecurringEventProps,} from "@/GameEngine/EventEngine/types.ts";
import {GameEngine} from "@/GameEngine";
import {GameEvent} from "@/GameEngine/EventEngine/GameEvent.ts";
import {normalizeTrigger} from "@/GameEngine/EventEngine/Trigger/helpers.ts";
import {EventTriggerClass, triggerHandlerFactory} from "@/GameEngine/EventEngine/Trigger/EventTrigger.ts";

export class RecurringEvent implements RecurringEventProps {
  public delay: number;
  public trigger: EventTriggerClass[];
  public is_completed = false;
  // public cumulative_costs_to_activate: RecurringEventProps['cumulative_costs_to_activate'];
  // public cumulative_costs_to_complete: RecurringEventProps['cumulative_costs_to_complete'];
  // public cumulative_gain: RecurringEventProps['cumulative_gain'];
  // public cumulative_loss: RecurringEventProps['cumulative_loss'];
  constructor(private game: GameEngine, private parent: GameEvent, private props?: Partial<RecurringEventProps>) {
    const triggers = props?.trigger ? normalizeTrigger(props.trigger) : []
    this.trigger = triggers.map(trigger => triggerHandlerFactory(trigger, game, parent))
    this.delay = props?.delay ?? 0
  }

  public evaluate = () => {
    const needs_no_evaluation = this.parent.is_active || !this.props
    if (needs_no_evaluation) {
      return false
    }
    if (this.is_completed) {
      return true
    }
    const time_passed = this.parent.ticks_since_completion / this.game.tick.ticks_per_second
    if (time_passed < this.delay) {
      return false
    }
    const completedTriggers = this.trigger.map(trigger => trigger.evaluate())
    const isTriggered = completedTriggers.reduce((noUnfulfilled, curr) => (noUnfulfilled && curr), true)
    if (isTriggered) {
      this.markCompleted()
    }
    return isTriggered;
  }

  private markCompleted() {
    this.is_completed = true;
  }

  public reset = () => {
    this.is_completed = false;
    this.trigger.forEach(trigger => trigger.reset());
  }

  get is_recurring() {
    return this.parent.is_active;
  }
}

