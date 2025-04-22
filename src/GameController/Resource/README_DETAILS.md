## Keys
`key`: K
<br/>
Human readable resource identifier (unique)
<br/>
---
`type`: T
<br/>
Category or type (e.g. "material", "currency")
<br/>
---
`value`: number
<br/>
The available amount (initially defaults to 1)
<br/>
---
`min`: number
<br/>
Minimum value (default: 0)
<br/>
---
`max`: number
<br/>
Maximum value (default: Infinity)
<br/>
---
`label`: string
<br/>
Human-readable label (falls back to key)
<br/>
---
`cost`: ResourceCostUpdate
<br/>
Resources required to produce this. The cost offers a simple way to transform one resource (or multiple) into another
<br/>
```ts
type ResourceCostUpdate = {
  give: {key: K; value: number}[];
  gain: {key: K; value: number}[];
}
```
---
`revealedAt`: ResourceCostUpdate
<br/>
Resources needed to reveal this
<br/>
---
`iconName`: string
<br/>
Raw icon asset name (default: 'empty'). This is used to set the icon `get icon()` will provide the one to render
<br/>
---
`reference_id`: string
<br/>
Used for cloning history tracking. When creating a clone the it will have its own new id, while the reference_id is pointing to the original resource

<br/>
<br/>

## 📖 Methods
### 🔧 Value Management
`updateBy(update: UpdateProps): void`
<br/>
This updates the value while respecting the constraints of min and max
<br/>
If constraints and value are changed this will make sure to update the constraints first
---
`updateValueBy(amount: number): boolean`
<br/>
Increases or decreases the value by amount. Basically the simplification. Instead of `updateBy({value: 1})` you can write `updateValueBy(1)`
Returns true if the value changed, false otherwise.
---
`setTo(update: UpdateProps<K, T>): void`
<br/>
Fully updates the resource properties (e.g. key, type, value, min, max, cost, etc.)
This is a hard set. Under the hood this is used for every change to ensure consistency
Also updates session and lifetime earned/spent stats.
---
`setValueTo(value: number): boolean`
<br/>
Sets the value directly while respecting constraints (min/max). Same as `updateBy()` to `updateValueBy()`
---
`setToMin(): void`
<br/>
Sets the resource value to its minimum (min).
---
`respectConstraints(value: number): number`
<br/>
A helper to clamp a value between min and max. This will return the new value and not mutate the resource `value`
---
`hasEnough(value: number): boolean`
<br/>
Returns true if subtracting value keeps the resource above or equal to min.

<br/>
<br/>


## 🔄 Cost Management
`addCost(changeKey: 'give' | 'gain', extraCost: {key: K; value: number}): void`
<br/>
Ads a new cost to the give or gain cost list.
---
`updateCost(changeKey: 'give' | 'gain', change: {key: K; value: number}): void`
<br/>
Updates the cost entry for give or gain where the key matches.
Modifies the value of the matching entry.
---
`removeCost(changeKey: 'give' | 'gain', resourceKey: K): void`
<br/>
Removes a cost entry with the specified key from give or gain.

<br/>
<br/>

## ♻️ Session & Cloning
`resetSession(): void`
Resets session-based earned and spent counters.
---
`clone(): Resource`
Creates a deep copy of the resource with a new ID and links the reference one via reference_id.

<br/>
<br/>


## 🧮 Getters
`percentage: number`
<br/>
Returns the percentage fill relative to max value.
---
`beautify: ResourceBeautyType`
<br/>
Returns the main numbers beautified for better reading. Also formats big numbers
- 1000 -> 1.000
- 14000 -> 14k
---
`icon: string`
<br/>
Returns the icon source path based on iconName.
---
`state: ResourceState<K, T>`
<br/>
Returns a serializable representation of the resource.
---
`is_max: boolean`
<br/>
Returns true if value >= max.
---
`is_min: boolean`
<br/>
Returns true if value <= min.


# ResourceStore


## 📖 Methods
### 🔍 Access & Query
`get(id: string): Resource`
<br/>
Returns the resource by its internal ID.
---
`getByKey(key: K): Resource`
<br/>
Returns a resource by its human-readable key. This eases editing with an auto-completion
---
`getByType(type?: T): Resource[]`
<br/>
Returns all resources of a specific type. If no type is given, returns all.
---
`getTypes(): T[]`
<br/>
Returns a unique list of all types available from the store.
---
`getResourcesByType(): { type: T, resources: Resource[] }[]`
<br/>
Groups all resources by their type and returns them as type-resource pairs.
---
`allResources: Resource[]`
<br/>
Returns all resources as an array.
---
`state: ResourceState[]`
<br/>
Returns a simplified representation of all resources' current state.

<br/>
<br/>

## ⚖️ Trading & Production

`produce(key: K, amount?: number): void`
Simple cost structures can be directly handled in the cost of each resource.
- 1 flour could cost 2 wheat to produce.
- If the resource has a cost, executes the trade as much as possible.
- If there is no cost, simply increases the resource value.
---
`trade(give, gain, amount): void`
This will execute as much as possible of the given trade.
- With the above example we are trying to create 10 bread.
- We only have 5 water though.
- So it will only create 5 bread and consume the other resources accordingly

#### Understanding the structure
`give` & `gain` both expect an array of changes like

```ts
const give = [
    {key: 'flour', value: 2},
    {key: 'water', value: 1},
]
const gain = [{key: 'bread', value: 1}]
```
---
`getTradeChange(give, gain, amount): Trade`
Creates a new Trade instance for deeper evaluation. Used internally to check possibilities and amounts of trades
---
`hasEnough(to_check?: LevelUpdate['gain']): boolean`
Checks whether the store has enough resources to fulfill a required cost.

```ts
type LevelUpdateSingle<K, T> = {key: K} & Partial<ResourceTypeRaw<K, T>>;
type LevelUpdate<K, T> = {
    give?: LevelUpdateSingle<K, T>[];
    need?: LevelUpdateSingle<K, T>[];
    gain?: LevelUpdateSingle<K, T>[];
}

```

<br/>
<br/>

## ➕ Modification & Cloning
`addResource(resource: ResourceUpdateProps): Resource`
<br/>
Adds a new resource to the store and returns the newly created resource instance.
---
`removeResource(id: string): void`
<br/>
Removes a resource by ID, only if no other resource references it (e.g., via cost or revealedAt).
---
`clone(caller = 'clone'): ResourceStore`
<br/>
Creates a deep copy of the resource store, assigning new IDs to each resource.
This is used e.g. to decouple the admin store from the game's resources

<br/>
<br/>

## 🛠 Resource Relationships
`resourceReferences(key: K): K[]`
<br/>
Returns all resource keys that reference the given key through costs or dependencies. Can be used to indicate the blockers to remove a resource
---
`isResourceReferenced(key: K): boolean`
<br/>
Checks whether any other resource references the given key. If a resource is referenced the `removeResource()` will be disabled.
---
`replaceTradeKeys(key: K, newKey: string): (ResourceState & { id: string })[]`
<br/>
Replaces all occurrences of a specific key in cost.give and cost.gain with a new key. This is used to enforce consistency when changing keys.
The admin panel also uses this to write all according changes.
Returns the updated resource states.

<br/>
<br/>

## ➗ Utilities

`getTypeSum(type: T): number`
<br/>
Returns the sum of values of all resources of a specific type.
---
`getTypeSessionSum(type: T): number`
<br/>
Returns the sum of sessionEarned values of all resources of a specific type.
---
    //-> Todo

`resetSession(type: T): void`
<br/>
This should reset all sessions from all resources of that type

<br/>
<br/>
<br/>