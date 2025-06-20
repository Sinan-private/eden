import {getGajaSize, getScreenSize, MediaQueryKey} from "@/Game/RenderEngine/media_queries.ts";

type SpawnEdge = 'top' | 'bottom' | 'left' | 'right';
type GajaSide = 'left' | 'right' | 'center';
type AnchorMode = 'random' | 'center' | 'fixed';

type SpawnAnchor = {
  target: 'gaja';
  side: GajaSide;
};

type SpawnPosition =
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

  private resolveEdgePosition(spawn: SpawnPosition): Point {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const normalized = typeof spawn === 'string' ? { edge: spawn } : spawn;
    const {edge, anchor, mode} = normalized

    switch (edge) {
      case 'top':
        return { x: this.chooseX(w, mode), y: 0 };
      case 'bottom':
        return { x: this.chooseX(w, mode), y: h };
      case 'left':
        return { x: 0, y: this.chooseY(h, mode) };
      case 'right':
        return { x: w, y: this.chooseY(h, mode) };
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
}