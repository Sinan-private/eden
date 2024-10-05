import {ResourceSingle} from "../Resource/ResourceSingle.ts";
import {ResourceUpdateProps} from "../Resource/types.ts";
import {ResourceKeys, ResourceTypes} from "./types.ts";

type ResourceInit = ResourceUpdateProps<ResourceKeys, ResourceTypes>[];

const base_resources: ResourceInit = [
  {value: 1000, key: 'gold'},
  {value: 100, key: 'corn'},
  {value: 30, key: 'water'},
  {value: 1, key: 'stone'},
  {value: 1, key: 'wood'},
  {value: 1, max: 50, key: 'citizen'},
];

const build_resources: ResourceInit = [
  {value: 10, key: 'land', label: 'Land', max: 100},
  {value: 1, max: 50, key: 'windmill'},
  {value: 1, max: 50, key: 'field'},
  {value: 1, max: 50, key: 'bakery'},
  {value: 1, key: 'well'},
  {value: 1, key: 'forrester'},
  {value: 1, key: 'wood_mill', label: 'Wood mill'},
  {value: 1, key: 'pasture'},
];

const processed_resources: ResourceInit = [
  {value: 1, key: 'meat'},
  {value: 1, key: 'milk'},
  {value: 1, key: 'wool'},
  {value: 1, key: 'flour'},
  {value: 1, key: 'bread'},
];

export const uncategorized_resources: ResourceInit = [
];

// This is just a little helper to keep the object clean and readable
const typedResources = (resources: ResourceInit, type: ResourceTypes) =>
  resources.map((resource) => ({
    ...resource,
    type
  }))

export const raw_state = uncategorized_resources.concat(
  typedResources(base_resources, 'base_resource'),
  typedResources(build_resources, 'build_resource'),
  typedResources(processed_resources, 'processed_resource')
)

export const initialState = raw_state.map(rawResource =>
  new ResourceSingle(rawResource).state);