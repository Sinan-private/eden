import {GameEngine, ResourceKeys} from "src/GameEngine";
import {ResourceTrigger} from "@/GameEngine/EventEngine/Trigger/ResourceTrigger.ts";
import {EventTriggerCreationProps} from "@/GameEngine/EventEngine/types.ts";
import {normalizeChance, TriggerIntermediateProps} from "@/GameEngine/EventEngine/Trigger/helpers.ts";
import {GameEvent} from "@/GameEngine/EventEngine/GameEvent.ts";

export type EventTriggerClass = EventTrigger

abstract class EventTrigger {
  public readonly type: TriggerType;
  public completed = false;
  public resources: ResourceTrigger[];
  public chance?: EventTriggerCreationProps['chance'];
  // public created_at_turn: number;
  private completedTrigger = new Set<ResourceKeys>();

  constructor(
    public readonly props: EventTriggerCreationProps,
    protected game: GameEngine,
    public parent: GameEvent,
  ) {
    // this.event_key = props.
    this.type = props.type ?? 'simultaneous';
    // this.created_at_turn = game.tick.current_turn
    this.resources = props.resources.map(trigger =>
      new ResourceTrigger(trigger, game, parent)
    );
    this.chance = props.chance
  }

  public getIncompleteResources(): ResourceTrigger[] {
    return this.resources.filter(({key}) => !this.completedTrigger.has(key));
  }

  public getCompletedResources(): ResourceTrigger[] {
    return this.resources.filter(({key}) => this.completedTrigger.has(key));
  }

  protected addCompletedTrigger(key: ResourceKeys) {
    this.completedTrigger.add(key);
  }

  protected setCompleted() {
    this.completed = true;
  }

  protected isTriggerCompleted(): boolean {
    return this.completedTrigger.size === this.resources.length;
  }

  public reset = (): void => {
    this.completed = false;
    this.completedTrigger = new Set<ResourceKeys>();
  }

  abstract evaluate(): boolean;
}

export class SimultaneousTrigger extends EventTrigger {
  evaluate(): boolean {
    // console.log('SimultaneousTrigger')
    if (this.completed) return true;
    const done = this.resources.every(({isCompleted}) => isCompleted);
    if (done) this.setCompleted();
    return done;
  }
}

export class SequenceTrigger extends EventTrigger {
  evaluate(): boolean {
    // console.log('SequenceTrigger')
    if (this.completed) return true;

    const [next] = this.getIncompleteResources();
    if (next?.isCompleted) {
      this.addCompletedTrigger(next.key);
    }

    const done = this.isTriggerCompleted();
    if (done) this.setCompleted();
    return done;
  }
}

export class ProgressiveTrigger extends EventTrigger {
  evaluate(): boolean {
    // console.log('ProgressiveTrigger')
    if (this.completed) return true;
    this.getIncompleteResources().forEach(({isCompleted, key}) => {
      if (isCompleted) this.addCompletedTrigger(key);
    });

    const done = this.isTriggerCompleted();
    if (done) this.setCompleted();
    return done;
  }
}
// This is a new type. Idea is for some events to randomly happen from time to time.
// They could still have dependencies to resources, e.g. when you store a lot of corn it can rot
// So it should be mostly the same type but with a certain chance.
// This should also hold a state to increment some values
export class RandomTrigger extends EventTrigger {

  // Here I need the full game
  evaluate(): boolean {

    if (this.completed) return true;
    // The normalizer enforces this.chance to return a callback
    const normalized = normalizeChance(this.chance)
    const chance = normalized(this.game, this.parent)
    const luck = Math.random() * 100
    const done = luck <= chance;

    if (done) this.setCompleted();
    return done;
  }
}

export type TriggerType = 'simultaneous' | 'sequence' | 'progressive' | 'random'
export const triggerHandlerFactory = (trigger: TriggerIntermediateProps, game: GameEngine, parent: GameEvent): EventTriggerClass => {
  switch (trigger.type) {
    case 'simultaneous':
      return new SimultaneousTrigger(trigger, game, parent);
    case 'sequence':
      return new SequenceTrigger(trigger, game, parent);
    case 'progressive':
      return new ProgressiveTrigger(trigger, game, parent);
    case 'random':
      return new RandomTrigger(trigger, game, parent);
    default:
      throw new Error('Unknown trigger type ' + trigger.type);
  }
}
