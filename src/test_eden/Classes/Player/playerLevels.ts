import {Levels} from "../LevelClass.ts";

export const playerLevel: Levels = {
  level_1: {},
  level_2: {
    give: [{key: 'clean_mana_level_1', value: 100}],
    gain: [{key: 'liquid_mana_level_2', max: Infinity}]
  },
  level_3: {
    give: [{key: 'clean_mana_level_1', value: 200}, {key: 'clean_mana_level_2', value: 25}],
    gain: [{key: 'liquid_mana_level_3', max: Infinity}]
  },
  level_4: {
    give: [{key: 'clean_mana_level_1', value: 400}, {key: 'clean_mana_level_2', value: 50}, {key: 'clean_mana_level_3', value: 5}],
    gain: [{key: 'liquid_mana_level_4', max: Infinity}]
  },
  level_5: {
    gain: [{key: 'liquid_mana_level_5', max: Infinity}]
  }
}