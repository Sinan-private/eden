# 📘 EventTrigger System – Usage Guide
This guide explains how to use the `EventTrigger` system to create events based on resource conditions. You'll define what should happen and when, based on the resources available in your game or simulation.

# 🧠 Concept
An event trigger defines when an event becomes active based on resource values.

Each event contains:

- A `type` that determines how conditions are evaluated. 
- A list of `resources` with conditions like `key`, `value`, and comparison `factor`.

When all conditions are fulfilled (depending on type), the event becomes ready.

---

# 🧩 Trigger Types

| Type           | Description                                                         |
| -------------- | ------------------------------------------------------------------- |
| `simultaneous` | All resource conditions must be met **at the same time**            |
| `sequence`     | Resource conditions must be fulfilled **in the defined order**      |
| `progressive`  | Any resource condition can be fulfilled **over time**, in any order |

```ts
const myEvent: TriggerProps = {
  type: 'progressive',
  resources: [
    { key: 'wood', value: 10, factor: 'min' },
    { key: 'stone', value: 5 }, // default factor is 'min'
    { key: 'water', value: 2, factor: 'max' },
  ]
};
```

## Explanation:
This event becomes ready once:

- You have at least 10 wood 
- At least 5 stone
- And no more than 2 water

Resources can be fulfilled in any order and are tracked individually.

---

# 🛠 Defining Your Own Events

```ts
const events: TriggerProps[] = [
  {
    type: 'simultaneous',
    resources: [
      { key: 'gold', value: 100 },
      { key: 'reputation', value: 50 }
    ]
  },
  {
    type: 'sequence',
    resources: [
      { key: 'wood', value: 10 },
      { key: 'stone', value: 10 },
      { key: 'gold', value: 5 }
    ]
  }
];

```
The evaluation of events happens in the GameBaseClass, which also provides active events.

---

# 🧼 Tips
- You don’t need to set factor: 'min' explicitly — it’s the default 
- You don’t need to manually track progress — that’s handled internally
- Triggers are designed to be fire-once by default. Once fulfilled, they won’t re-evaluate.

