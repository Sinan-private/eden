

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