# Trade and Resource Classes Documentation

Written by ChatGPT, need revision

## Overview
This document provides an overview of the `Trade` and `Resource` classes, their structure, functionality, and key methods. These classes are designed to manage resource transactions and constraints within a game-like resource management system.

---

## `Resource` Class

The `Resource` class represents a game resource with properties such as value, constraints, and costs. It provides methods to manage, update, and query the state of a resource.

### Properties
- **id**: Unique identifier for the resource.
- **key**: Key representing the resource type (e.g., `"mana"`).
- **value**: Current value of the resource.
- **min**: Minimum allowable value for the resource.
- **max**: Maximum allowable value for the resource.
- **label**: Human-readable name for the resource.
- **type**: Type of the resource (e.g., category).
- **cost**: Cost associated with the resource.
- **revealedAt**: Conditions under which the resource is revealed.
- **iconName**: Icon name for visual representation.

### Methods
- **updateBy(update: UpdateProps<K, T>)**: Updates constraints and value in an immutable manner.
- **setToMin()**: Sets the resource value to its minimum.
- **updateValueBy(value: number)**: Updates the resource value by a given amount while respecting constraints.
- **setTo(update: UpdateProps<K, T>)**: Updates resource properties directly.
- **setValueTo(value: number)**: Sets the resource value to a specific value, respecting constraints.
- **respectConstraints(value: number)**: Ensures the value stays within the defined `min` and `max` range.
- **updateCost(changeKey: 'give' | 'gain', change: TradeChange<K>)**: Updates specific resource costs.
- **addCost(changeKey: 'give' | 'gain', extraCost: TradeChange<K>)**: Adds new cost entries.
- **removeCost(changeKey: 'give' | 'gain', resourceKey: ResourceKeys)**: Removes a cost entry by key.
- **hasEnough(value: number)**: Checks if the resource has at least the specified value.

### Getters
- **percentage**: Percentage of the resource's value relative to its maximum.
- **beautify**: Object containing human-readable representations of the resource's state.
- **icon**: Icon path for the resource.
- **state**: Object representation of the resource's state.
- **is_max**: Boolean indicating if the resource is at its maximum.
- **is_min**: Boolean indicating if the resource is at its minimum.

---

## `Trade` Class

The `Trade` class models a transaction involving resource costs and gains. It handles resource constraints, calculates feasible trade amounts, and executes trades.

### Properties
- **costs**: Array of resources required for the trade.
- **gains**: Array of resources obtained from the trade.
- **amount**: The base amount for the trade.

### Methods
- **constructor(costs: ResourceTrade<K, T>[], gains: ResourceTrade<K, T>[], amount: number = 1)**: Initializes a trade with specified costs, gains, and amount.
- **getMaxPossibleAmount()**: Calculates the maximum tradeable amount based on resource constraints.
- **isTradePossible()**: Checks if the trade can be partially or fully executed.
- **executeTrade()**: Executes the trade for the maximum feasible amount, updating resources accordingly.
- **tradeIfPossible()**: Executes the trade only if it is possible.
- **evaluateTrade()**: Simulates the trade to evaluate its impact on resources without applying changes.

### Usage Example
```typescript
const trade = new Trade(
  [
    { resource: manaResource, amount: 10 },
  ],
  [
    { resource: healthResource, amount: 5 },
  ]
);

if (trade.isTradePossible()) {
  const executedAmount = trade.executeTrade();
  console.log(`Executed trade for ${executedAmount} units.`);
} else {
  console.log('Trade not possible.');
}
```

---

## Integration
### Resource Update During Trade
When updating a resource within a trade, the `updateBy()` method ensures all properties, such as `value`, `min`, and `max`, are adjusted correctly. Multipliers can be applied dynamically to update values during the trade.

### Example
```typescript
this.gains.forEach(({ resource, ...update }) => {
  const multiplier = 1.5;
  const adjustedUpdate = Object.fromEntries(
    Object.entries(update).map(([key, value]) => {
      if (typeof value === 'number') {
        return [key, value * multiplier];
      }
      return [key, value];
    })
  );
  resource.update(adjustedUpdate);
});
```

---

## Notes
- Ensure the `Resource` class constraints (`min` and `max`) are respected during updates.
- The `Trade` class assumes resources have been properly initialized and validated before use.
- Customize multipliers and constraints logic as needed to fit game design requirements.

