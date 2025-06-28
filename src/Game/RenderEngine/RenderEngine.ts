// What's the idea here
// There will be way more stuff to animate than just the branches. There shall be clouds, mushrooms and even markets
// or cities. All of them will have to be aware of their position, the climbing height and also of their own
// z-axes since elements should move in different speed and possibly also react to their environment, like e.g.
// being blurred in the background or adjusting their color

// So the goal is to pass in objects here (can also be triggered by an event) so that the RenderEngine takes care
// on how to place and move them as well as the effects to trigger

// Todo I want to have the handling of the danger level here. So each component has a central truth for
//  their danger state

import {Factory as RenderFactory} from "@/Game/RenderEngine/Factory.ts";
import {Renderable} from "@/Game/RenderEngine/Renderable.ts";
import {GameClass} from "@/Game";
import {ElementCreation, RenderFactoryConfigProps} from "@/Game/RenderEngine/types.ts";
// import {Placement} from "@/Game/RenderEngine/Placement.ts";

const GAJA_TRUNK_IMAGE_HEIGHT = 600;

export class RenderEngine {
  private elements: Renderable[] = [];
  private factories: RenderFactory[] = [];
  constructor(private game: GameClass) {
  }

  get world_x(): number {
    return 0
  }

  get world_y(): number {
    return this.game.behemoth.climb_height.value
  }

  get trunk_position(): number {
    const trunkDisplacement = this.world_y - GAJA_TRUNK_IMAGE_HEIGHT * 3
    return (trunkDisplacement % GAJA_TRUNK_IMAGE_HEIGHT) - GAJA_TRUNK_IMAGE_HEIGHT
  }

  public add = (source: Renderable) => {
    this.elements.push(source.initialize(this.world_x, this.world_y));
  }

  public addFactory = (
    config: RenderFactoryConfigProps,
    Element: ElementCreation
    ) => {
    const factory = new RenderFactory(Element, config, this.game)
    this.factories.push(factory.initialize(this.world_x, this.world_y));
  }

  public remove = (id: string) => {
    this.elements = this.elements.filter(s => s.id !== id);
  }

  public removeFactory = (id: string) => {
    this.factories = this.factories.filter(s => s.id !== id);
  }

  public update = () => {
    this._updateElements()
    this._updateFactories()
  }

  private _updateElements = () => {
    for (const source of this.elements) {
      if (source.left_viewport) {
        this.remove(source.id);
      } else {
        source.update(this.world_x, this.world_y);
      }
    }
  }

  private _updateFactories = () => {
    for (const factory of this.factories) {
      if (factory.unmount_on_leaving_viewport) {
        console.log('left viewport')
        // This should only happen with unmount_on_leaving_viewport
        // this.removeFactory(factory);
      } else {
        factory.update(this.world_x, this.world_y);
      }
    }
  }

  public getElements(): Renderable[] {
    const elements = this.elements.flatMap(s => s.getElements());
    const factories = this.factories.flatMap(s => s.getElements());
    return [...elements, ...factories];
  }

}
