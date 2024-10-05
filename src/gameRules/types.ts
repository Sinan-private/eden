export type ResourceKeys = BaseResourceKeys | BuildResourceKeys | ProcessedResourceKeys

export type ResourceTypes =
  | 'base_resource'
  | 'processed_resource'
  | 'build_resource'
  | ''

type BaseResourceKeys =
  | 'gold'
  | 'corn'
  | 'water'
  | 'stone'
  | 'wood'
  | 'iron'
  | 'citizen'

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

