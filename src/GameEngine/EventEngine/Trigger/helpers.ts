// That looks a little ugly just because everything is also allowed to be a callback
// So I do the normalization to enforce everything to be a callback
import {GetChanceCallback, EventChanceProps, EventTriggerCreationProps} from "@/GameEngine/EventEngine/types.ts";
import {GameEngine} from "src/GameEngine";
import {GameEvent} from "@/GameEngine/EventEngine/GameEvent.ts";

export type TriggerIntermediateProps = Pick<EventTriggerCreationProps, 'type' | 'resources'>

export function normalizeChance(
  chance: EventTriggerCreationProps['chance'],
): GetChanceCallback {
  if (!chance) {
    return () => 100
  }
  if (typeof chance === 'function') {
    return chance
  }

  return normalizeChanceObject(chance)
}

const normalizeChanceObject = (
  chance: Partial<EventChanceProps>,
): GetChanceCallback => {
  if (chance.calculateChance) {
    return chance.calculateChance
  }

  // wrap numbers as functions
  const base = typeof chance.base_chance_per_second === 'function'
    ? chance.base_chance_per_second
    : () => (chance.base_chance_per_second as number) || 0;

  const increase = typeof chance.increase_chance_per_second === 'function'
    ? chance.increase_chance_per_second
    : (_game: GameEngine, parent: GameEvent) => (chance.increase_chance_per_second as number) * parent.turns_passed;

  return (game: GameEngine, parent: GameEvent) => base(game, parent) + increase(game, parent)
}

export const normalizeTrigger = (triggerCreationProps: EventTriggerCreationProps | EventTriggerCreationProps[]): TriggerIntermediateProps[] => {
  const trigger = ([] as EventTriggerCreationProps[]).concat(triggerCreationProps)
  return trigger.map(t => ({
    ...t,
    type: t.type ?? 'simultaneous',
  }))
}
