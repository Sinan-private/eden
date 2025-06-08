# ResourceStore

The `ResourceEngine` is a MobX-powered state management class designed for use in resource-based game mechanics. It handles the creation, access, update, deletion, and trading of resources. It also provides utilities for grouping, leveling, and dependency tracking.

## 🧱 Core Concepts

- **Generic Design**: Works with typed resource keys (`K`) and types (`T`).
- **MobX Observability**: Automatically makes resources reactive.
- **Trades & Levels**: Encapsulates logic for trading and leveling based on resource availability.
- **Extensible**: Designed to integrate into a larger game system, or to act as a self-contained simulation.


## Documentation

### 🧮 Getters
| Method                | propType | Return          | Description                            |
|-----------------------|----------|-----------------|----------------------------------------|
| **🔍 Access & Query** |          |                 |                                        |
| `allResources`        |          | Resource[]      | Returns a list of all resources        |
| `state`               |          | ResourceState[] | Returns a list of all resource states. |


### 📖 Methods

| Method                               | propType                  | Return                               | Description                                                                                                                                   |
|--------------------------------------|---------------------------|--------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| **🔍 Access & Query**                |                           |                                      |                                                                                                                                               |
| `get(id)`                            | `string`                  | Resource                             | Returns the resource by its internal ID.                                                                                                      |
| `getByKey(key)`                      | `K (string)`              | Resource                             | Returns the resource by the (unique) key                                                                                                      |
| `getByType(type?)`                   | `T (string)`              | Resource[]                           | Returns all resources of a specific type. If no type is given, returns all.                                                                   |
| `getTypes()`                         |                           | T[]                                  | Returns a unique list of all types available from the store.                                                                                  |
| `getResourcesByType()`               |                           | { type: T, resources: Resource[] }[] | Groups all resources by their type and returns them as type-resource pairs.                                                                   |
| **⚖️ Trading & Production**          |                           |                                      |
| `produce(key, amount)`               | `K (string)`, `number`    |                                      | Produce a resource from the `cost`description                                                                                                 |
| `trade(give, gain, amount)`          | `TradeChange[]`, `number` |                                      | This will execute as much as possible of the given trade.                                                                                     |
| `getTradeChange(give, gain, amount)` | `TradeChange[]`, `number` | Trade                                | Creates a new Trade instance for deeper evaluation. Used internally to check possibilities and amounts of trades                              |
| `hasEnough(to_check?)`               | `UpdateProps & {key: K}`  | boolean                              | Checks whether the store has enough resources to fulfill a required cost.                                                                     |
| **➕ Modification & Cloning**         |                           |                                      |                                                                                                                                               |
| `addResource(resource)`              | `UpdateProps & {key: K}`  | Resource                             | Adds a new resource to the store and returns the newly created resource instance.                                                             |
| `removeResource(id)`                 | string                    |                                      | Removes a resource by ID, only if no other resource references it (e.g., via cost or revealedAt).                                             |
| `clone(caller?)`                     | string                    |                                      | Creates a deep copy of the resource store, assigning new IDs to each resource. The caller is just to reference the different stores           |
| **🛠 Resource Relationships**        |                           |                                      |                                                                                                                                               |
| `resourceReferences(key)`            | `K (string)`              | K[]                                  | Checks whether any other resource references the given key. If a resource is referenced the `removeResource()` will be disabled.              |
| `replaceTradeKeys(key, newKey)`      | `K (string)`, `string`    | (ResourceState & { id: string })[]`  | Replaces all occurrences of a specific key in cost.give and cost.gain with a new key. This is used to enforce consistency when changing keys. |
| **➗ Utilities**                      |                           |                                      |                                                                                                                                               |
| `getTypeSum(type)`                   | T                         | number                               | Returns the sum of sessionEarned values of all resources of a specific type.                                                                  |
| `getTypeSessionSum(type)`            | T                         | number                               | Returns the sum of sessionEarned values of all resources of a specific type.                                                                  |
| Todo: `resetSession(type)`           | T                         |                                      | This should reset all sessions from all resources of that type                                                                                |

#### Type description

```ts
type UpdateProps = Partial<Resource['state']>
type ChangeKey = 'give' | 'gain'
type TradeChange = {key: K; value: number}

```




# Resource

The `Resource` class represents a single game resource (e.g. wood, gold, energy) and encapsulates all logic related to value tracking, constraints, trading cost, visibility conditions, and display formatting.


## Documentation

### 🗝 Keys

| key            |    type    | Description                                                                                                           |
|----------------|:----------:|:----------------------------------------------------------------------------------------------------------------------|
| `key`          | K (string) | The primary identifier for human readability                                                                          |
| `type`         | T (string) | Category or type (e.g. "material", "currency")                                                                        |
| `value`        |   number   | The available amount                                                                                                  |
| `min`          |   number   | Minimum value (default: 0)                                                                                            |
| `max`          |   number   | Maximum value (default: Infinity)                                                                                     |
| `label`        |   string   | Human-readable label (falls back to key)                                                                              |
| `cost`         |    Cost    | Resources required to produce this. The cost offers a simple way to transform one resource (or multiple) into another |
| `revealedAt`   |    Cost    | Resources needed to reveal this                                                                                       |
| `iconName`     |   string   | Not for use. The icon getter provides the icon. The icon name is used for internal storage                            |
| `reference_id` |   string   | When a resource is cloned the reference_id will point to its origin                                                   |

### 🧮 Getters

| key          |  type   | Description                                                          |
|--------------|:-------:|:---------------------------------------------------------------------|
| `icon`       | string  | The icon to use in your app                                          |
| `percentage` | number  | The percentage of the value compared to the max                      |
| `beautify`   | object  | Beautified values for better readability                             |
| `state`      | object  | The raw resource (without methods) for passing and storing in states |
| `is_max`     | boolean | Is the value at max                                                  |
| `is_min`     | boolean | Is the value at min                                                  |

## 📖 Methods

| Method                               | propType                   | Return     | Description                                                                                                                                                                                |
|--------------------------------------|----------------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **🔧 Value Management**              |                            |            |                                                                                                                                                                                            |
| `updateBy(update)`                   | `UpdateProps`              |            | Updates the value while respecting `min` and `max` constraints. If constraints and value are changed, the constraints are applied first.                                                   |
| `updateValueBy(amount)`              | `number`                   | `boolean`  | Increases or decreases the value by a given amount. Equivalent to `updateBy({ value })`. Returns `true` if the value changed, otherwise `false`.                                           |
| `setTo(update)`                      | `UpdateProps`              |            | Fully updates the resource properties (`key`, `type`, `value`, `min`, `max`, `cost`, etc.). Used for every internal change to ensure consistency. Also updates lifetime and session stats. |
| `setValueTo(value:)`                 | `number`                   | `boolean`  | Sets the value directly, respecting constraints. This is the core method for any change in value.                                                                                          |
| `setToMin()`                         |                            |            | Sets the value to the minimum (`min`).                                                                                                                                                     |
| `respectConstraints(value)`          | `number`                   | `number`   | Returns a version of the value clamped between `min` and `max`, without mutating the resource.                                                                                             |
| `hasEnough(value: number)`           |                            | `boolean`  | Returns `true` if subtracting `value` still keeps the resource at or above its `min`.                                                                                                      |
| **🔄 Cost Management**               |                            |            |                                                                                                                                                                                            |
| `addCost(changeKey, extraCost)`      | `ChangeKey`, `TradeChange` |            | Ads a new cost to the give or gain cost list.                                                                                                                                              |
| `updateCost(changeKey, change)`      | `ChangeKey`, `TradeChange` |            | Updates the cost entry for give or gain where the key matches. Modifies the value of the matching entry.                                                                                   |
| `removeCost(changeKey, resourceKey)` | `ChangeKey`, `K`           |            | Removes a cost entry with the specified key from give or gain.                                                                                                                             |
| **♻️ Session & Cloning**             |                            |            |                                                                                                                                                                                            |
| `resetSession()`                     |                            |            | Resets session-based earned and spent counters.                                                                                                                                            |
| `clone()`                            |                            | `Resource` | Creates a deep copy of the resource with a new ID and links the reference one via reference_id.                                                                                            |

#### Type description

```ts
type UpdateProps = Partial<Resource['state']>
type ChangeKey = 'give' | 'gain'
type TradeChange = {key: K; value: number}

```


## ResourceKeys
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

# Setting up your app
This ResourceSystem works best with fully controlled resources. But it can also be used with a custom setup

## Fully controlled
- The `GameEngine` creates a singleton store that offers a `tick` and an `admin`
- The `admin` expects these folders to work  `assets`, `Admin`, `generated`, `helpers`, `hooks` and `server` to be copied. Basically you need to copy the full `GameController` folder
- You can use the `ResourceAdmin` component to render all the helpers that are needed, or create your own system for rendering

### <ResourceAdmin />

```ts
import {ResourceAdmin} from "@/GameEngine/ResourceEngine/Admin/ResourceAdmin.tsx";

```


## 🧪 Example Usage

### Initial call

```tsx
import {resourceEngine} from '@ResourceEngine'

const App = () => {
    useComponentMount(() => {
      resourceEngine([
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
import {resourceEngine} from '@ResourceEngine'

const Game = observer(() => {
    const {getByKey} = resourceEngine
    const wheat = getByKey('wood')
    console.log(wheat.value)
    const onIncrease = (amount: number) => wheat.updateValueBy(amount)
})
```

>The `observer` should live at the lowest possible level because this will trigger the re-render.

<br/>
<br/>
<br/>