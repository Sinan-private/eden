import {ResourceUpdateProps} from "../Resource/types.ts";
import {ResourceSingle} from "../NEW_Resource/ResourceSingle.ts";

export type ResourceKeys =
  | 'gold'
  | 'land'
  | 'corn'
  | 'water'
  | 'bread'
  | 'stone'
  | 'windmill'
  | 'field'
  | 'bakery'
  | 'citizen'
  | 'meat'
  | 'milk'
  | 'wool'

export type ResourceTypes =
  | 'base_resource'
  | 'processed_resource'
  | 'building'

export const gameInit: ResourceUpdateProps<ResourceKeys>[] = [
  {value: 100, key: 'gold', label: 'Gold', type: 'ba'},
  {value: 10, key: 'land', label: 'Land', max: 100},
  {value: 20, max: 50, key: 'corn', label: 'Corn', min: 0, type: 'test'},
  {value: 30, max: 50, key: 'water', label: 'Water', min: 0, type: 'test'},
  {value: 1, max: 50, key: 'bread', label: 'Bread', min: 0, type: 'test'},
  {value: 1, max: 50, key: 'stone', label: 'Stone', min: 0, type: 'test'},
  {value: 1, max: 50, key: 'windmill', label: 'Windmill'},
  {value: 1, max: 50, key: 'field', label: 'Field'},
  {value: 1, max: 50, key: 'bakery', label: 'Bakery'},
  {value: 1, max: 50, key: 'citizen'},
  {value: 1, key: 'meat'},
];

export const initialState = gameInit.map(rawResource =>
  new ResourceSingle(rawResource).state);