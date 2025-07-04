

| Component       | Role                                                               |
| --------------- | ------------------------------------------------------------------ |
| `RenderEngine`  | Orchestrator: owns the main loop, manages what is visible and when |
| `Factory`       | Producer: knows how and when to spawn things                       |
| `SpawnEngine`   | Placer: decides where new things should appear                     |
| `ImageProvider` | Resource registry: knows about available images and their metadata |
| `Renderable`    | Actor: individual element being updated and drawn                  |


Every approach created its own confusion so this is the setting I am going for

# Placement
## `from`
from accepts `top` | `bottom` | `left` | `right` | `center`. The tricky part is that spawning should happen usually outside the visible area. 
So this is how the placement values work

```ts
const config = {
  from: 'top',
  x: 0,
  y: 0,
}
```
The image is rendered outside the screen x and y

```ts
const config = {
  from: 'top',
  x: 0,
  y: 50,
}
```
This would center the image vertically but it would still be outside the viewport on the x axes


```ts
const config = {
  from: 'top',
  x: 50,
  y: 50,
}
// Centers the image at the screen (or the anchor element). This creates the same result as 
const config2 = {
  from: 'center',
  x: 0,
  y: 0,
} // or even shorter in
const config3 = {
  from: 'center',
}
```
Each of the previous will center the image at the screen or its anchor element

```ts
const config = {
  from: 'top',
  x: 100,
  y: 50
}
```

This will result in the image being outside the viewport to the right. This may seem confusing first


The result is a class that offers different css

I think it makes sense to put the Spawn into the RenderEngine. This should handle all element creation and therefore can also own the spawn



---


- So RenderEngine does the cleaning of the props and normalization. I should just have one unified config for elements and factories.
- The Renderable is responsible to turn the config into a screen placement
- It does so by calling the screenPlacement

Downside
- This creates the need again to pass a lot of info into the renderable


I have 
- factory config
  - spawn config
  - element config
- element config

The placement doesn't receive an array, but a specific placement

```ts
type ElementConfig = {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number; // Derived from image
  height: number; // Derived from image
  image: RenderImageKey;
  type: RenderImageType;
  anchor: 'gaja' | '' // This is the prop.
  sticky?: boolean; // This can leave because it should be derived from the anchor. If none set, this is false
}
```
---
```ts
type ElementConfigProps = {
  id?: string;
  x?: number;
  y?: number;
  z?: number;
  image?: RenderImageKey; // Random one from type taken if not available
  type: RenderImageType;
  anchor?: 'gaja' | ''
}
```
---

```ts
type FactoryConfig = {
  // First the props that are shared
  id?: string; // optional, for keyed rendering
  x: [number, number];
  y: [number, number];
  z: [number, number];
  type: RenderImageType; // previously image_type
  image?: RenderImageKey; // If explicitly set, this only renders a specific elements. The default is to get a random image from the type
  anchor: 'gaja' | '',
  // ------------- After this the factory specific props
  unmount_on_leaving_viewport: boolean;
  initial_amount: number;
  spawn_min_distance: number; // Distance to the closest element in the list. Before min_distance is reached no new spawn is triggered
  spawn_chance: number; // 0 - 100. The percentage chance to spawn a new element. If the current amount is smaller than the min amount. A spawn is triggered, no matter the chance
}
```
---
```ts
type FactoryConfigProps = {
  // First the props that are shared
  id?: string;
  x?: number | [number, number];
  y?: number | [number, number];
  z?: number | [number, number];
  type: RenderImageType; // previously image_type
  image?: RenderImageKey; // If explicitly set, this only renders a specific elements. The default is to get a random image from the type
  anchor?: 'gaja' | '',
  // ------------- After this the factory specific props
  unmount_on_leaving_viewport?: boolean;
  initial_amount?: number;
  spawn_min_distance?: number; // Distance to the closest element in the list. Before min_distance is reached no new spawn is triggered
  spawn_chance?: number; // 0 - 100. The percentage chance to spawn a new element. If the current amount is smaller than the min amount. A spawn is triggered, no matter the chance
}
```

```ts
type SpawnConfig = {
  x: number;
  y: number;
  z: number;
  // width: number; // Let's see if they are really needed
  // height: number;
  anchor: {
    key: 'gaja',
    w: number;
    h: number;
  }
}
```

```ts
type SpawnConfigProps = {
  x: number;
  y: number;
  z: number;
  // width: number;
  // height: number;
  anchor?: 'gaja' | '',
}
```

