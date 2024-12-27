import {ResourceStoreClass} from "../Resource";

export const resourceTurnUpdate = (resources: ResourceStoreClass) => {
  resources.produce('dirty_mana_level_1', 10);
  resources.produce('dirty_mana_level_2');
  resources.produce('dirty_mana_level_3');
  resources.produce('raw_mana_level_1');
}
