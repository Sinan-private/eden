// What's the idea here
// There will be way more stuff to animate than just the branches. There shall be clouds, mushrooms and even markets
// or cities. All of them will have to be aware of their position, the climbing height and also of their own
// z-axes since elements should move in different speed and possibly also react to their environment, like e.g.
// being blurred in the background or adjusting their color

// So the goal is to pass in objects here (can also be triggered by an event) so that the RenderEngine takes care
// on how to place and move them as well as the effects to trigger

import {GameBaseClasses} from "@/Game/Classes/Game/gameTypes.ts";
import {RenderImageKey} from "@/Game/RenderEngine/imageRegistry.ts";
import {RenderFactory} from "@/Game/RenderEngine/RenderFactory.ts";
import {Renderable} from "@/Game/RenderEngine/Renderable.ts";

export type RenderElement = {
  offset_x?: number;
  offset_y?: number;
  z: number;
  image: RenderImageKey;
  type: 'branch' | 'cloud' | 'mushroom' | 'market' | 'city'; // most likely own classes
  // width: number;
  // height: number;
  id?: string; // optional, for keyed rendering
  sticky?: boolean;
}

export class RenderEngine {
  private element: Renderable[] = [];
  private factories: RenderFactory[] = [];

  // private _starting_height: number
  // private _current_height: number
  constructor(private props: GameBaseClasses) {
    // this._starting_height = props.behemoth.climb_height.value
  }

  public add = (source: Renderable) => {
    this.element.push(source.initialize(0, this.props.behemoth.climb_height.value));
  }

  public addFactory = (factory: RenderFactory) => {
    this.factories.push(factory.initialize(0, this.props.behemoth.climb_height.value));
  }

  public remove = (source: Renderable) => {
    this.element = this.element.filter(s => s !== source);
  }

  public removeFactory = (source: RenderFactory) => {
    this.factories = this.factories.filter(s => s !== source);
  }

  public update = () => {
    this._updateElements()
    this._updateFactories()
  }

  private _updateElements = () => {
    for (const source of this.element) {
      if (source.left_viewport) {
        this.remove(source);
      } else {
        source.update(0, this.props.behemoth.climb_height.value);
      }
    }
  }

  private _updateFactories = () => {
    for (const factory of this.factories) {
      if (factory.left_viewport) {
        this.removeFactory(factory);
      } else {
        factory.update(0, this.props.behemoth.climb_height.value);
        factory.getElements().forEach(element => {

        })
      }
    }
  }

  getElements(): Renderable[] {
    const elements = this.element.flatMap(s => s.getElements());
    const factories = this.factories.flatMap(s => s.getElements());
    return [...elements, ...factories];
  }

}
