import {getGajaSize, getScreenSize, MediaQueryKey} from "@/Game/RenderEngine/media_queries.ts";

type SpawnEdge = 'top' | 'bottom' | 'left' | 'right';
type GajaSide = 'left' | 'right' | 'center';
type AnchorMode = 'random' | 'center' | 'fixed';

type SpawnAnchor = {
  target: 'gaja';
  side: GajaSide;
};

export type SpawnPosition =
  | SpawnEdge
  | {
  edge?: SpawnEdge;
  anchor?: SpawnAnchor;
  mode?: AnchorMode;
  offset_x?: number;
  offset_y?: number;
};

interface Point {
  x: number;
  y: number;
}


export class SpawnEngine {

  // My current idea is to provide the css class for a container here. This is the initial position of the spawning
  // And is only done by a fixed positioning
  // Animtaion is happening directly on element level using transform: translate()
  public cloud_position = () => {
    // Needs to be aware of the image size
    // Needs to be aware of the media queries
    return `fixed top-0 right-[571px]`
  }

  private resolveEdgePosition(spawn: SpawnPosition): Point {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const normalized = typeof spawn === 'string' ? { edge: spawn } : spawn;
    const {edge, anchor, mode} = normalized

    switch (edge) {
      case 'bottom':
        return { x: this.chooseX(w, mode), y: h };
      case 'left':
        return { x: 0, y: this.chooseY(h, mode) };
      case 'right':
        return { x: w, y: this.chooseY(h, mode) };
      case 'top':
      default:
        return { x: this.chooseX(w, mode), y: 0 };
    }
  }

  private width = (anchor?: SpawnAnchor): number => {
    const w = window.innerWidth;
    return anchor ? getGajaSize(w) : w
  }

  private x(w: number, mode: AnchorMode): number {
    if (mode === 'center') return w / 2;
    if (mode === 'fixed') return 0;
    return Math.random() * w;
  }

  // When I am using an anchor the positions should be limited to that anchors edges
  private chooseX(w: number, mode?: AnchorMode): number {
    if (mode === 'center') return w / 2;
    if (mode === 'fixed') return 0;
    return Math.random() * w;
  }

  private chooseY(h: number, mode?: AnchorMode): number {
    if (mode === 'center') return h / 2;
    if (mode === 'fixed') return 0;
    return Math.random() * h;
  }

  public getScreenSize = (): MediaQueryKey => getScreenSize(window.innerWidth);

}