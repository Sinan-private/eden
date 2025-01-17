import {Levels} from "../LevelClass.ts";

export const levels: Levels = {
  level_1: {},
  level_2: {
    give: [
      {key: 'clean_mana_level_1', value: 150}
    ],
    gain: [
      {key: 'behemoth_stamina', max: 50},
      {key: 'behemoth_hp', max: 150, value: 150},
    ]
  },
  level_3: {
    give: [
      {key: 'clean_mana_level_1', value: 250},
      {key: 'clean_mana_level_2', value: 20}
    ],
    gain: [
      {key: 'behemoth_stamina', max: 50},
      {key: 'behemoth_hp', max: 150, value: 150},
    ]
  },
  level_4: {
    give: [
      {key: 'clean_mana_level_1', value: 500},
      {key: 'clean_mana_level_2', value: 30},
      {key: 'clean_mana_level_3', value: 5},
    ],
    gain: [
      {key: 'behemoth_stamina', max: 50},
      {key: 'behemoth_hp', max: 150, value: 150},
    ]
  },
  level_5: {
    give: [
      {key: 'clean_mana_level_1', value: 750},
      {key: 'clean_mana_level_2', value: 80},
      {key: 'clean_mana_level_3', value: 7},
      {key: 'clean_mana_level_4', value: 2},
    ],
    gain: [
      {key: 'behemoth_stamina', max: 50},
      {key: 'behemoth_hp', max: 150, value: 150},
    ]
  }
}