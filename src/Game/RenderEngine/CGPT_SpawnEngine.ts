import {getScreenSize, MediaQueryKey} from "@/Game/RenderEngine/media_queries.ts";

type SpawnEdge = 'top' | 'bottom' | 'left' | 'right';
type GajaSide = 'left' | 'right' | 'center';

type SpawnAnchor = {
  target: 'gaja';
  side: GajaSide;
};

type SpawnPosition =
  | SpawnEdge
  | {
  edge?: SpawnEdge;
  anchor?: SpawnAnchor;
  mode?: 'random' | 'center' | 'fixed';
  offset_x?: number;
  offset_y?: number;
};

interface Point {
  x: number;
  y: number;
}


export class CGPT_SpawnEngine {
  private spawn_position: 'top' | 'bottom' | 'left' | 'right' = 'top'

  resolvePosition(spawn: SpawnPosition): Point {
    const normalized = typeof spawn === 'string' ? { edge: spawn } : spawn;

    const base = normalized.anchor
      ? this.resolveAnchorPosition(normalized.anchor, normalized.mode)
      : this.resolveEdgePosition(normalized.edge ?? 'top', normalized.mode);

    return this.applyOffsets(base, normalized.offset_x, normalized.offset_y);
  }

  public getScreenSize = (): MediaQueryKey => getScreenSize(window.innerWidth);

  private resolveEdgePosition(edge: SpawnEdge, mode: 'random' | 'center' | 'fixed' = 'random'): Point {
    const w = window.innerWidth;
    const h = window.innerHeight;

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

  private resolveGajaX(rect: DOMRect, side: GajaSide): number {
    if (side === 'left') return rect.left;
    if (side === 'right') return rect.right;
    return rect.left + rect.width / 2;
  }

  private resolveGajaY(rect: DOMRect, mode: 'random' | 'center' | 'fixed'): number {
    if (mode === 'center') return rect.top + rect.height / 2;
    if (mode === 'fixed') return rect.top;
    return rect.top + Math.random() * rect.height;
  }

  private resolveAnchorPosition(
    anchor: SpawnAnchor,
    mode: 'random' | 'center' | 'fixed' = 'random'
  ): Point {
    const rect = this.getGajaRect();

    const x = this.resolveGajaX(rect, anchor.side);
    const y = this.resolveGajaY(rect, mode);

    return { x, y };
  }

  private chooseX(w: number, mode: 'random' | 'center' | 'fixed'): number {
    if (mode === 'center') return w / 2;
    if (mode === 'fixed') return 0;
    return Math.random() * w;
  }

  private chooseY(h: number, mode: 'random' | 'center' | 'fixed'): number {
    if (mode === 'center') return h / 2;
    if (mode === 'fixed') return 0;
    return Math.random() * h;
  }

  private applyOffsets(point: Point, offsetX = 0, offsetY = 0): Point {
    return {
      x: point.x + offsetX,
      y: point.y + offsetY,
    };
  }

  get screen_edges() {
    return {
      left: 0,
    }
  }
}