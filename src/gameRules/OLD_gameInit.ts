import {ResourceBase, ResourceUpdateProps} from "../Resource";
import {
  BaseResourceKeys,
  ResourceKeys,
  ResourceTypes
} from "./types.ts";
// import {EditResource} from "./EditResource.ts";

type ResourceInit = ResourceUpdateProps<ResourceKeys, ResourceTypes>[];

const base_resources: ResourceUpdateProps<BaseResourceKeys, ResourceTypes>[] = [
  {value: 1000, key: 'gold'},
  {value: 100, key: 'corn'},
  {value: 30, key: 'water'},
  {value: 50, key: 'coal'},
  {value: 50, key: 'stone'},
  {value: 50, key: 'wood'},
];

const build_resources: ResourceUpdateProps<ResourceKeys, ResourceTypes>[] = [
  {
    value: 10,
    key: 'land',
    max: 100,
    cost: {
      give: [{key: 'gold', value: 10}],
      gain: [{key: 'land', value: 1}]
    }
  },
  {
    value: 1,
    max: 50,
    key: 'windmill',
    cost: {
      give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'bricks', value: 3}],
      gain: [{key: 'windmill', value: 1}]
    },
  },
  {
    value: 1,
    max: 50,
    key: 'field',
    cost: {
      give: [{key: 'land', value: 1}, {key: 'gold', value: 10}],
      gain: [{key: 'field', value: 1}]
    }
  },
  {
    value: 1,
    max: 50,
    key: 'bakery',
    cost: {
      give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'bricks', value: 2}],
      gain: [{key: 'bakery', value: 1}]
    }
  },
  {
    value: 1,
    key: 'well',
    cost: {
      give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'bricks', value: 5}],
      gain: [{key: 'well', value: 1}]
    }
  },
  {
    value: 1,
    key: 'forrester',
    cost: {
      give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'stone', value: 5}],
      gain: [{key: 'forrester', value: 1}]
    }
  },
  {
    value: 1,
    key: 'wood_mill',
    label: 'Wood mill',
    cost: {
      give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'bricks', value: 3}],
      gain: [{key: 'windmill', value: 1}]
    }
  },
  {
    value: 1,
    key: 'pasture',
    cost: {
      give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'bricks', value: 3}],
      gain: [{key: 'pasture', value: 1}]
    }
  },
];

const processed_resources: ResourceUpdateProps<ResourceKeys, ResourceTypes>[] = [
  {
    value: 1,
    key: 'meat',
    cost: {
      give: [{key: 'corn', value: 5}, {key: 'water', value: 5}],
      gain: [{key: 'meat', value: 1}],
    }
  },
  {
    value: 1,
    key: 'milk',
    cost: {
      give: [{key: 'corn', value: 5}, {key: 'water', value: 5}],
      gain: [{key: 'milk', value: 1}],
    }
  },
  {
    value: 1,
    key: 'wool',
    cost: {
      give: [{key: 'corn', value: 5}],
      gain: [{key: 'wool', value: 1}],
    }
  },
  {
    value: 1,
    key: 'flour',
    cost: {
      give: [{key: 'corn', value: 2}],
      gain: [{key: 'flour', value: 1}],
    }
  },
  {
    value: 1,
    key: 'bread',
    cost: {
      give: [{key: 'flour', value: 1}, {key: 'water', value: 2}],
      gain: [{key: 'bread', value: 1}],
    }
  },
  {
    value: 10,
    key: 'bricks',
    cost: {
      give: [{key: 'stone', value: 4}],
      gain: [{key: 'bricks', value: 1}],
    }
  },
  {
    value: 10,
    key: 'planks',
    cost: {
      give: [{key: 'wood', value: 2}],
      gain: [{key: 'planks', value: 1}],
    }
  },
];

const citizen_resources: ResourceUpdateProps<ResourceKeys, ResourceTypes>[] = [
  {value: 1, key: 'citizen'},
  {value: 1, key: 'engineer'},
  {value: 1, key: 'scientist'},
  {value: 1, key: 'artist'},
  {value: 1, key: 'magician'},
];

const currency_resources: ResourceUpdateProps<ResourceKeys, ResourceTypes>[] = [
  {value: 1000, key: 'money'},
];

export const uncategorized_resources: ResourceInit = [];

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
  new ResourceBase(rawResource).state
);
