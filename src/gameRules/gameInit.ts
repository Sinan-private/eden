import {ResourceUpdateProps} from "../Resource";
import {
  BaseResourceKeys,
  BuildResourceKeys,
  CitizenResourceKeys, CurrencyResourceKeys,
  ProcessedResourceKeys,
  ResourceKeys,
  ResourceTypes
} from "./types.ts";
import {Resource} from "./Resource.ts";

type ResourceInit = ResourceUpdateProps<ResourceKeys, ResourceTypes>[];

const base_resources: ResourceUpdateProps<BaseResourceKeys, ResourceTypes>[] = [
  {value: 1000, key: 'gold'},
  {value: 100, key: 'corn'},
  {value: 30, key: 'water'},
  {value: 50, key: 'coal'},
  {value: 50, key: 'stone'},
  {value: 50, key: 'wood'},
];

const build_resources: ResourceUpdateProps<BuildResourceKeys, ResourceTypes>[] = [
  {value: 10, key: 'land', max: 100},
  {value: 1, max: 50, key: 'windmill'},
  {value: 1, max: 50, key: 'field'},
  {value: 1, max: 50, key: 'bakery'},
  {value: 1, key: 'well'},
  {value: 1, key: 'forrester'},
  {value: 1, key: 'wood_mill', label: 'Wood mill'},
  {value: 1, key: 'pasture'},
];

const processed_resources: ResourceUpdateProps<ProcessedResourceKeys, ResourceTypes>[] = [
  {value: 1, key: 'meat'},
  {value: 1, key: 'milk'},
  {value: 1, key: 'wool'},
  {value: 1, key: 'flour'},
  {value: 1, key: 'bread'},
  {value: 10, key: 'bricks'},
  {value: 10, key: 'planks'},
];

const citizen_resources: ResourceUpdateProps<CitizenResourceKeys, ResourceTypes>[] = [
  {value: 1, key: 'citizen'},
  {value: 1, key: 'engineer'},
  {value: 1, key: 'scientist'},
  {value: 1, key: 'artist'},
  {value: 1, key: 'magician'},
];

const currency_resources: ResourceUpdateProps<CurrencyResourceKeys, ResourceTypes>[] = [
  {value: 1000, key: 'money'},
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
  typedResources(processed_resources, 'processed_resource'),
  typedResources(citizen_resources, 'citizen_resource'),
  typedResources(currency_resources, 'currency_resource'),
)

export const initialState = raw_state.map(rawResource =>
  new Resource(rawResource).state
);
