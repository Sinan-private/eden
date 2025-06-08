import {GameEngine, ResourceKeys} from "src/GameEngine";
import {ResourceTrigger} from "@/GameEngine/EventEngine/Trigger/ResourceTrigger.ts";
import {TriggerType} from "@/GameEngine/EventEngine/Trigger/EventTrigger.ts";
import {GameEvent} from "@/GameEngine/EventEngine/GameEvent.ts";

// This is ugly to read. But the user should have as much freedom as possible and that makes for many multiple types and combinations

type MakePartial<T, K extends keyof T> =
  Omit<T, K> & Partial<Pick<T, K>>;

export type EventKeyValueProps = {
  key: ResourceKeys;
  value: number | GetValueCallback
}

export type ResourceEvaluationProps = {
  factor?: 'min' | 'max';
} & EventKeyValueProps;

type ResourceCumulativeGrowthProps = {
  factor?: 'plus' | 'times';
} & EventKeyValueProps;

export type GetValueCallback = (game: GameEngine, event: GameEvent, resource_key: ResourceKeys) => number;
export type GetChanceCallback = EventCallback<number>

export type EventCallback<T> = (game: GameEngine, event: GameEvent) => T

// This will evaluate against a number range between 0 and 100. So the returned number is the percentage
// chance of this to happen
export type EventChanceProps = {
  base_chance_per_second: number | GetChanceCallback;
  increase_chance_per_second: number | GetChanceCallback;
  calculateChance: GetChanceCallback;
}

export type GameEventCreationProps =
  Omit<
    MakePartial<
      GameEventProps,
      'resource_gain' | 'resource_loss' | 'preventClose'
    >,
    'trigger'
  > & {
  trigger: EventTriggerCreationProps | EventTriggerCreationProps[] // | ((resources: ResourceStoreClass) => boolean);
};

export type EventTriggerCreationProps = {
  type?: TriggerType;
  resources: ResourceEvaluationProps[];
  chance?: Partial<EventChanceProps> | GetChanceCallback;
}

// ------------------------ FINALE PROPS ---------------------------------

export type GameEventProps = {
  key: string;
  trigger: {
    type: TriggerType;
    resources: ResourceTrigger[];
  }[];
  label: string | EventCallback<string>;
  description: string | EventCallback<string>;
  resource_gain: EventKeyValueProps[];
  resource_loss: EventKeyValueProps[];
  preventClose: boolean;
  recurring?: Partial<RecurringEventProps>
}

export type CumulativeGrowthProps = ResourceCumulativeGrowthProps[] | GetChanceCallback

export type RecurringEventProps = {
  delay: number; // The number of seconds until the event reactivates (still needs to be fulfilled)
  trigger: GameEventCreationProps['trigger'];
  // resources: ResourceEvaluationProps[]; // The resources needed to re-activate the event
  // cumulative_costs_to_activate: CumulativeGrowthProps; // The resources needed to re-activate the event. It still needs to be fulfilled
  // cumulative_costs_to_complete: CumulativeGrowthProps; // The resources needed to fulfill the event consecutive time
  // cumulative_gain: CumulativeGrowthProps; // The resources needed to fulfill the event consecutive time
  // cumulative_loss: CumulativeGrowthProps; // The resources needed to fulfill the event consecutive time
  // calculateChance(resources: ResourceStoreClass): number;
}
