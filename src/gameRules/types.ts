import {Resource} from "./Resource.ts";

export type ResourceKeys = BaseResourceKeys | BuildResourceKeys | ProcessedResourceKeys;
export type TradeResourceKeys = BuildResourceKeys | ProcessedResourceKeys;

export type ResourceTypes =
  | 'base_resource'
  | 'processed_resource'
  | 'build_resource'
  | ''

type BaseResourceKeys =
  | 'money'
  | 'iron'
  | 'gold'
  | 'corn'
  | 'water'
  | 'stone'
  | 'wood'
  | 'citizen'
  | 'engineer'
  | 'scientist'
  | 'artist'
  | 'magician'

export type BuildResourceKeys =
  | 'land'
  | 'windmill'
  | 'field'
  | 'bakery'
  | 'well'
  | 'forrester'
  | 'wood_mill'
  | 'pasture'

export type ProcessedResourceKeys =
  | 'bread'
  | 'meat'
  | 'milk'
  | 'wool'
  | 'flour'
  | 'planks'
  | 'bricks'

export type ResourceClass = Resource<ResourceKeys, ResourceTypes>