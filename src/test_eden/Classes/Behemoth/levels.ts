import {Levels} from "../LevelClass.ts";

export const levels: Levels = {
  level_1: {},
  level_2: {
    give: [
      {key: 'clean_mana_level_1', value: 10}
    ],
    gain: [
      {key: 'behemoth_stamina', max: 50} // here I want to raise the max and not the value
    ]
  },
  level_3: {
    give: [
      {key: 'clean_mana_level_1', value: 200},
      {key: 'clean_mana_level_2', value: 20}
    ]
  },
  level_4: {
    give: [
      {key: 'clean_mana_level_1', value: 200},
      {key: 'clean_mana_level_2', value: 20}
    ]
  },
  level_5: {
    give: [
      {key: 'clean_mana_level_1', value: 200},
      {key: 'clean_mana_level_2', value: 20}
    ]
  }
}