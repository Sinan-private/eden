import {ResourceBase} from "../Resource";

export type ResourceKeys =
  | BaseResourceKeys
  | BuildResourceKeys
  | ProcessedResourceKeys
  | CitizenResourceKeys
  | CurrencyResourceKeys

export type TradeResourceKeys = BuildResourceKeys | ProcessedResourceKeys;

export type ResourceTypes =
  | 'base_resource'
  | 'processed_resource'
  | 'build_resource'
  | 'citizen_resource'
  | 'currency_resource'
  | ''

export type BaseResourceKeys =
  | 'iron'
  | 'gold'
  | 'corn'
  | 'water'
  | 'coal'
  | 'stone'
  | 'wood'

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

export type CitizenResourceKeys =
  | 'citizen'
  | 'engineer'
  | 'scientist'
  | 'artist'
  | 'magician'

export type CurrencyResourceKeys =
  | 'money'

export type ResourceClass = ResourceBase<ResourceKeys, ResourceTypes>
