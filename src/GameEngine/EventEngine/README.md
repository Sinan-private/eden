# 🧠 EventEngine Guide
The `EventEngine` allows you to define ***dynamic, condition-based events*** that can trigger, repeat, and reward players based on their game state. Each event can include resource triggers, rewards, penalties, and even randomized chance logic.

---

# 📦 Basic Structure: ``GameEvent``

A game event is created with a simple config object. The engine handles:

- Trigger evaluation (simultaneous, sequential, progressive or random)
- Resource gain/loss 
- Optional recurring behavior 
- Optional random chance conditions 
- Visibility and state tracking

Each event object must include at minimum:

```
{
  key: "unique_event_id",
  label: "Visible Title",
  description: "What this event means or does",
  trigger: Trigger | Trigger[],
}
```

You may optionally include:

```
  resource_gain: Resource[] | ((game, turnsPassed) => void),
  resource_loss: Resource[] | ((game, turnsPassed) => void),
  recurring: { delay: number }, // seconds
  preventClose: true,
```

---

# 🎯 Trigger Types
You can define multiple triggers per event. They will ***all need to be fulfilled*** to activate the event.

### `simultaneous`
All listed resources must be available at the same time.

```
{
  type: "simultaneous",
  resources: [{ key: "bread", value: 10 }, { key: "water", value: 10 }]
}
```

### `sequence`
Resources must be fulfilled one after the other in order.
```
{
  type: "sequence",
  resources: [{ key: "bread", value: 30 }, { key: "wheat", value: 15 }]
}
```

### `progressive`
All resources must eventually be fulfilled, but the order doesn’t matter.
```
{
  type: "progressive",
  resources: [{ key: "bread", value: 21 }, { key: "grapes", value: 20 }]
}
```

### `random`
Adds a chance-based trigger. It only begins evaluation once resource requirements are met.

```
{
  type: "random",
  resources: [{ key: "wheat", value: 20 }],
  chance: {
    base_chance_per_second: 10,
    increase_chance_per_second: 1,
    calculateChance: (game, turns_passed) => {
      const wheat = game.resources.getByKey('wheat')
      return wheat.value + turns_passed
    }
  }
}
```
You can:
- Use a constant or function for `base_chance_per_second` and `increase_chance_per_second` 
- Or skip them and define your own logic via `calculateChance`

---

# 🚀 Resource Changes
You can reward or penalize the player with:

```ts
resource_gain: [{ key: "money", value: 10 }]
resource_loss: [{ key: "power", value: 5 }]
```

Alternatively, define them dynamically:
```ts
resource_gain: (game, turnsPassed) => {
  if (turnsPassed > 10) {
    game.resources.getByKey("gold").updateValueBy(100)
  }
}
```

---

# 🔐 Prevent Event Dismissal
If you want to block user interaction with an event (e.g. game over, required alert):

```ts
preventClose: true
```

---

# 📌 Example
```
{
  key: "my_new_structure",
  label: "New Structure",
  description: "Unlocks once certain resource thresholds are met",
  trigger: [
    {
      type: "simultaneous",
      resources: [{ key: "bread", value: 10 }, { key: "water", value: 10 }]
    },
    {
      type: "sequence",
      resources: [{ key: "bread", value: 30 }, { key: "wheat", value: 15 }]
    },
    {
      type: "progressive",
      resources: [{ key: "bread", value: 21 }, { key: "grapes", value: 20 }]
    }
  ],
  resource_gain: [{ key: "money", value: 10 }],
  resource_loss: [{ key: "power", value: 10 }]
}
```

# ✅ Best Practices
- Keep event keys unique 
- Combine different trigger types to create engaging complexity 
- Use `random` triggers for emergent gameplay 
- Use `recurring` for ambient world logic or periodic challenges

# QTNAYBIUTBR
Questions that nobody asked yet but I assume to be relevant

### I want to raise the max value of a resource
There is no flag for this, just use a callback like
```ts
resource_gain: (game) => game.resources.getByKey('gold').updateBy({max: 5})
```