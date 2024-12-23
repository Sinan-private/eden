import {ResourceStoreClass} from "../ResourceHandling";

export const resourceTurnUpdate = (resources: ResourceStoreClass) => {
  resources.produce('water', resources.get('well').value);
  resources.produce('corn', resources.get('field').value);
  resources.produce('flour', resources.get('windmill').value);
  resources.produce('bread', resources.get('bakery').value);
}
