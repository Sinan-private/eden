import {id} from "@/GameEngine/ResourceEngine/helpers/id.ts";
import {GameEngine} from "src/GameEngine";
import {
  EventTriggerClass,
  triggerHandlerFactory,
} from "@/GameEngine/EventEngine/Trigger/EventTrigger.ts";
import {makeAutoObservable} from "mobx";
import {
  EventCallback,
  EventKeyValueProps,
  GameEventCreationProps,
  GameEventProps,
} from "@/GameEngine/EventEngine/types.ts";
import {normalizeTrigger} from "@/GameEngine/EventEngine/Trigger/helpers.ts";
import {ResourceTrigger} from "@/GameEngine/EventEngine/Trigger/ResourceTrigger.ts";
import {RecurringEvent} from "@/GameEngine/EventEngine/RecurringEvent.ts";


export class GameEvent implements GameEventProps {
  public id: string = id();
  public key: string;
  public is_active = true;
  public is_recurring: boolean;
  public recurring: RecurringEvent;
  public trigger: EventTriggerClass[];
  public _label: EventCallback<string>;
  public _description: EventCallback<string>;
  public resource_gain: EventKeyValueProps[];
  public resource_loss: EventKeyValueProps[];
  public completed_at: { tick: number }[] = [];
  public was_triggered = false;
  public was_shown = false;
  public preventClose: boolean;
  public created_at_turn: number;

  // public completed_at_turn: number;


  constructor(props: GameEventCreationProps, private game: GameEngine) {
    this.key = props.key;
    const triggers = normalizeTrigger(props.trigger)
    this.trigger = triggers.map(trigger => triggerHandlerFactory(trigger, game, this))
    this.is_recurring = !!props.recurring;
    this.resource_gain = props.resource_gain || [];
    this.resource_loss = props.resource_loss || [];
    this._label = typeof props.label === 'function' ? props.label : () => (props.label as string);
    this._description = typeof props.description === 'function' ? props.description : () => (props.description as string);
    this.preventClose = props.preventClose || false;
    this.created_at_turn = game.tick.current_turn
    this.recurring = new RecurringEvent(game, this, props.recurring)
    makeAutoObservable(this)
  }

  public evaluate = () => {
    if (this.was_triggered) {
      return true
    }
    const completedTriggers = this.trigger.map(trigger => trigger.evaluate())
    const isTriggered = completedTriggers.reduce((noUnfulfilled, curr) => (noUnfulfilled && curr), true)
    if (isTriggered) {
      this.markAsTriggered()
    }
    return isTriggered;
  }

  public updateResources = () => {
    const handleChange = (change: EventKeyValueProps[], factor: -1 | 1 = 1) => {
      change.forEach(props => {
        // Here also add the calculation from the recurring Event
        // Can I use the ResourceTrigger here
        const {value} = new ResourceTrigger(props, this.game, this) // Normalization because value can be a callback
        const resource = this.game.resources.getByKey(props.key)
        resource.updateValueBy(value * factor)
      })
    }
    handleChange(this.resource_gain)
    handleChange(this.resource_loss, -1)
  }

  public evaluateRecurringEvent = () => {
    // The issue is simple. A completed event is just taken from the list to evaluate
    if (this.recurring.is_completed) {
    console.log(this.recurring.is_completed, 'reset')
      this.reset()
    } else {
      this.recurring.evaluate()
    }

  }

  public markAsShown = () => {
    if (!this.was_shown) {
      this.was_shown = true;
    }
  }

  public markAsTriggered = () => {
    console.log('mark as triggered')
    if (!this.was_triggered) {
      this.is_active = false;
      this.was_triggered = true;
      this.completed_at.push({tick: this.game.tick.tick_index})
    }
  }

  public checkMissingResources = () => {
    return this.trigger.map(trigger => trigger.getIncompleteResources())
  }

  public checkCompletedResources = () => {
    return this.trigger.map(trigger => trigger.getCompletedResources())
  }

  public reset = (): void => {
    this.was_triggered = false;
    this.was_shown = false;
    this.is_active = true;
    this.recurring.reset();
    this.created_at_turn = this.game.tick.current_turn
    // this.nextEvaluationAtTick = undefined;
    this.trigger.forEach(trigger => trigger.reset());
  }

  get triggered() {
    return this.was_triggered;
  }

  get completedTriggers() {
    return this.trigger.filter(trigger => trigger.completed).keys()
  }

  get turns_passed() {
    return this.game.tick.turnsElapsed(this.created_at_turn)
  }

  get seconds_passed() {
    return this.turns_passed / this.game.tick.turns_per_second
  }

  get times_completed() {
    return this.completed_at.length
  }

  get ticks_since_completion() {
    const latest = this.completed_at[this.completed_at.length - 1]
    return this.game.tick.ticksElapsed(latest.tick)
  }

  get label() {
    return this._label(this.game, this)
  }

  get description() {
    return this._description(this.game, this)
  }

}

