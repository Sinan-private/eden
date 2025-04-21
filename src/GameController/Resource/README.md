# ResourceStore

The `ResourceStore` is a MobX-powered state management class designed for use in resource-based game mechanics. It handles the creation, access, update, deletion, and trading of resources. It also provides utilities for grouping, leveling, and dependency tracking.

## 🧱 Core Concepts

- **Generic Design**: Works with typed resource keys (`K`) and types (`T`).
- **MobX Observability**: Automatically makes resources reactive.
- **Trades & Levels**: Encapsulates logic for trading and leveling based on resource availability.
- **Extensible**: Designed to integrate into a larger game system, or to act as a self-contained simulation.


---

## 🧪 Example Usage


### Initial call

```tsx
import {resourceStore} from '@Resource'

const App = () => {
    useComponentMount(() => {
      resourceStore([
        { key: 'wheat', type: 'material', value: 10 },
        { key: 'water', type: 'material', value: 5 }
        ]) 
    })
    return (<Game />)
}
```

### Consecutive calls

```ts
import {observer} from "mobx-react";
import {resourceStore} from '@Resource'

const Game = observer(() => {
    const {getByKey} = resourceStore
    const wheat = getByKey('wood')
    console.log(wheat.value)
    const onIncrease = (amount: number) => wheat.updateValueBy(amount)
})
```

The `observer` should live at the lowest possible level because this will trigger the re-render.

---


# ResourceStore-Methods

## 📖 Methods
### 🔍 Access & Query
`get(id: string): Resource`
<br/>
Returns the resource by its internal ID.

`getByKey(key: K): Resource`
<br/>
Returns a resource by its human-readable key. This eases editing with an auto-completion

`getByType(type?: T): Resource[]`
<br/>
Returns all resources of a specific type. If no type is given, returns all.

`getTypes(): T[]`
<br/>
Returns a unique list of all types available from the store.

`getResourcesByType(): { type: T, resources: Resource[] }[]`
<br/>
Groups all resources by their type and returns them as type-resource pairs.

`allResources: Resource[]`
<br/>
Returns all resources as an array.

`state: ResourceState[]`
<br/>
Returns a simplified representation of all resources' current state.

---

## ⚖️ Trading & Production

`produce(key: K, amount?: number): void`
Simple cost structures can be directly handled in the cost of each resource.
- 1 flour could cost 2 wheat to produce.
- If the resource has a cost, executes the trade as much as possible.
- If there is no cost, simply increases the resource value.

### Understanding the structure
`give` & `gain` both expect an array of changes like

```ts
const give = [
    {key: 'flour', value: 2},
    {key: 'water', value: 1},
]
const gain = [{key: 'bread', value: 1}]
```

`trade(give, gain, amount): void`
This will execute as much as possible of the given trade. 
- With the above example we are trying to create 10 bread.
- We only have 5 water though.
- So it will only create 5 bread and consume the other resources accordingly

`getTradeChange(give, gain, amount): Trade`
Creates a new Trade instance for deeper evaluation. Used internally to check possibilities and amounts of trades

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
---
## ➕ Modification & Cloning
`addResource(resource: ResourceUpdateProps): Resource`
<br/>
Adds a new resource to the store and returns the newly created resource instance.

`removeResource(id: string): void`
<br/>
Removes a resource by ID, only if no other resource references it (e.g., via cost or revealedAt).

`clone(caller = 'clone'): ResourceStore`
<br/>
Creates a deep copy of the resource store, assigning new IDs to each resource.
This is used e.g. to decouple the admin store from the game's resources

---

## 🛠 Resource Relationships
`resourceReferences(key: K): K[]`
<br/>
Returns all resource keys that reference the given key through costs or dependencies. Can be used to indicate the blockers to remove a resource

`isResourceReferenced(key: K): boolean`
<br/>
Checks whether any other resource references the given key. If a resource is referenced the `removeResource()` will be disabled.

`replaceTradeKeys(key: K, newKey: string): (ResourceState & { id: string })[]`
<br/>
Replaces all occurrences of a specific key in cost.give and cost.gain with a new key. This is used to enforce consistency when changing keys.
The admin panel also uses this to write all according changes.
Returns the updated resource states.

---

# ResourceKeys
```ts
type ResourceTypeRaw<K, T> = {
  value: number;
  min: number;
  max: number;
  label: string;
  type?: T;
  cost: ResourceCostUpdate<K, T> | null;
  revealedAt: ResourceCostUpdate<K, T> | null;
  iconName?: string;
}
type TradeChange<K, T> = {key: K; value: number} & Partial<ResourceTypeRaw<K, T>>;
type ResourceCostUpdate<K, T> = {
  give: TradeChange<K, T>[];
  gain: TradeChange<K, T>[];
}
```