import {ResourceState} from "../genericTypes.ts";
import {Resource} from "../Resource.ts";

// I had to turn this off what might be dangerous. This is only needed for a single use case.
// In the Admin Panel when creating a resource and then adding a cost there is a pretty specific issue.
// The resource is yet being created so it can not be found in the state.
// But when adding a cost the resource itself is set as the gain value. In there it should display its own icon
// To do so I currently need the useResource.get(gain.key) to find the right image.
// But when I do the resource is not yet being added to the state so it won't be found.
// ---
// [TL:DR] This warning needs to be turned off unless I found a better solution to pass images of resource costs

export const get = <K extends string, T extends string>(key: K, state: ResourceState<K, T>[]): Resource<K, T> => {
  const _this = state.find(resource => resource.key === key);
  // if (!_this) throw new Error("Could not find resource key " + key);
  return new Resource<K, T>(_this!)
}
