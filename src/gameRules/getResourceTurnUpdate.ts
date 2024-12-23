import {ResourceKeys, ResourceTypes} from "../Resource/specificTypes.ts";
import {ResourceStore} from "../Resource/ResourceStore.ts";

export const resourceTurnUpdate = (resources: ResourceStore<ResourceKeys, ResourceTypes>) => {
  resources.produce('water', resources.get('well').value);
  resources.produce('corn', resources.get('field').value);
  resources.produce('flour', resources.get('windmill').value);
  resources.produce('bread', resources.get('bakery').value);
}
