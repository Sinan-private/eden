import {ImageEntry, RenderImageType} from "@/Game/RenderEngine/imageRegistry.ts";
import {Renderable, RenderableProps} from "@/Game/RenderEngine/Renderable.ts";

export type InitialPosition = {top: number; left: number}

type SpawnProps = {
  // amount: number | [number, number]; // A number say between 0 and the value. An array means between x and y
  min_distance: number; // Distance to the closest element in the list. Before min_distance is reached no new spawn is triggered
  chance: number; // 0 - 100. The percentage chance to spawn a new element. If the current amount is smaller than the min amount. A spawn is triggered, no matter the chance
  from: 'top' | 'bottom' | 'left' | 'right';
  anchor: 'gaja' | '',
}

export type AnchorProps = ('gaja' | '') | {
  w: number;
  h: number;
};
export const tupledFields: readonly ['x', 'y', 'z', 'spawn_amount'] = ['x', 'y', 'z', 'spawn_amount'] as const;
export type TupledFields = typeof tupledFields[number];
export type RenderFactoryConfig = {
  id: string;
  x: number | [number, number];
  y: number | [number, number];
  z: number | [number, number];
  type: RenderImageType; // previously image_type
  image?: ImageEntry; // If explicitly set, this only renders a specific elements. The default is to get a random image from the type
  anchor?: AnchorProps;
  // place: 'inside' | 'outside';
  // ------------- After this the factory specific props
  unmount_on_leaving_viewport?: boolean;
  initial_amount: number;
  spawn_amount: number | [number, number]; // Distance to the closest element in the list. Before min_distance is reached no new spawn is triggered
  spawn_min_distance: number; // Distance to the closest element in the list. Before min_distance is reached no new spawn is triggered
  spawn_chance: number; // 0 - 100. The percentage chance to spawn a new element. If the current amount is smaller than the min amount. A spawn is triggered, no matter the chance
}
export type RenderFactoryConfigProps = Partial<RenderFactoryConfig>
// The normalized version
export type NormalizedRenderFactoryConfig = {
  [K in keyof RenderFactoryConfig]: K extends TupledFields ? [number, number] : K extends 'spawn' ? SpawnProps : RenderFactoryConfig[K];
};
export type PlacementProps = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  anchor?: AnchorProps;
}

export type ElementCreation = new (config: RenderableProps, initialPosition: InitialPosition) => Renderable
