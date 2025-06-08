import {GameEvent} from "@/GameEngine/EventEngine/GameEvent.ts";
import {GameEngine} from "src/GameEngine";
import {GameEventCreationProps} from "@/GameEngine/EventEngine/types.ts";
import {toJS} from "mobx";

// Here lies the issue. Calling activeEvent will always trigger the evaluation. Instead I should separate the trigger from the getter,
// or I have no control over the event

export class EventEngine {
  public events: Map<string, GameEvent>;
  constructor(events: GameEventCreationProps[], private game: GameEngine) {
    this.events = this._initializeEvents(events)
  }

  public get = (id: string) => this.events.get(id)!

  public getByKey = (key: string) =>
    Array.from(this.events.values()).find(resource => resource.key === key)!;

  public evaluate = (): void => {
    this.incompleteEvents.forEach(e => e.evaluate());
    this.completedEvents.forEach(e => e.evaluateRecurringEvent());
  }

  public debug_status = () => {
    this.evaluate()
    const incomplete = this.incompleteEvents.map(({key, _label, trigger, is_active}) => ({
      key,
      _label: _label,
      is_active,
      incomplete_trigger: trigger.filter(({completed}) => !completed),
      completed_trigger: trigger.filter(({completed}) => completed),
    }))
    const complete = this.completedEvents.map(({key, _label, trigger, is_active}) => ({
      key,
      _label: _label,
      is_active,
      trigger: toJS(trigger)
    }))
    return {
      incomplete,
      complete
    }
  }

  get allEvents() {
    return Array.from(this.events.values());
  }

  get completedEvents() {
    return this.allEvents.filter(e => e.triggered)
  }

  get incompleteEvents() {
    return this.allEvents.filter(e => !e.triggered)
  }

  get activeEvent() {
    return this.completedEvents.find(e => !e.was_shown);
  }

  private _initializeEvents(events: GameEventCreationProps[]) {
    const fullResources: [string, GameEvent][] = events.map((event) => {
      const full = new GameEvent(event, this.game);
      return [full.id, full]
    });
    return new Map(fullResources)
  }
}
