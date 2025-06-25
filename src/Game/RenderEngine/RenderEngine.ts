// What's the idea here
// There will be way more stuff to animate than just the branches. There shall be clouds, mushrooms and even markets
// or cities. All of them will have to be aware of their position, the climbing height and also of their own
// z-axes since elements should move in different speed and possibly also react to their environment, like e.g.
// being blurred in the background or adjusting their color

// So the goal is to pass in objects here (can also be triggered by an event) so that the RenderEngine takes care
// on how to place and move them as well as the effects to trigger

import {Factory as RenderFactory} from "@/Game/RenderEngine/Factory.ts";
import {Renderable} from "@/Game/RenderEngine/Renderable.ts";
import {GameClass} from "@/Game";
import {ElementCreation, RenderFactoryConfigProps} from "@/Game/RenderEngine/types.ts";
// import {Placement} from "@/Game/RenderEngine/Placement.ts";


export class RenderEngine {
  private elements: Renderable[] = [];
  private factories: RenderFactory[] = [];
  // private spawnEngine = new Placement();

  // private _starting_height: number
  // private _current_height: number
  constructor(private props: GameClass) {
    // this._starting_height = props.behemoth.climb_height.value
    // makeAutoObservable(this)
  }

  public add = (source: Renderable) => {
    this.elements.push(source.initialize(0, this.props.behemoth.climb_height.value));
  }

  // public normalizeFactoryConfig = (config: RenderFactoryConfigProps) => {
  //
  // }

  public addFactory = (
    config: RenderFactoryConfigProps,
    Element: ElementCreation
    ) => {
    console.log('add factory')
    // Pass normalized config here
    const factory = new RenderFactory(Element, config)
    // Add here the props normalization and the initial positioning?
    this.factories.push(factory.initialize(0, this.props.behemoth.climb_height.value));
  }

  public remove = (source: Renderable) => {
    this.elements = this.elements.filter(s => s !== source);
  }

  public removeFactory = (source: RenderFactory) => {
    this.factories = this.factories.filter(s => s !== source);
  }

  public update = () => {
    this._updateElements()
    this._updateFactories()
  }

  private _updateElements = () => {
    for (const source of this.elements) {
      if (source.left_viewport) {
        this.remove(source);
      } else {
        source.update(0, this.props.behemoth.climb_height.value);
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
        factory.update(0, this.props.behemoth.climb_height.value, this.props.tick);
      }
    }
  }

  public getElements(): Renderable[] {
    const elements = this.elements.flatMap(s => s.getElements());
    const factories = this.factories.flatMap(s => s.getElements());
    return [...elements, ...factories];
  }

}
