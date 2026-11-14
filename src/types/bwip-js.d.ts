declare module 'bwip-js' {
  export interface RenderOptions {
    bcid: string;
    text: string;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    rotate?: 'N' | 'R' | 'L' | 'I';
    paddingwidth?: number;
    paddingheight?: number;
    paddingleft?: number;
    paddingright?: number;
    paddingtop?: number;
    paddingbottom?: number;
    barcolor?: string;
    backgroundcolor?: string;
    bordercolor?: string;
    textcolor?: string;
    rowmult?: number;
    columns?: number;
    rows?: number;
    eclevel?: number;
    includetext?: boolean;
    textxalign?: 'offleft' | 'left' | 'center' | 'right' | 'offright' | 'justify';
    textyalign?: 'below' | 'center' | 'above';
    textsize?: number;
    alttext?: string;
  }

  export function toSVG(opts: RenderOptions): string;
  export function toCanvas(canvas: string | HTMLCanvasElement, opts: RenderOptions): HTMLCanvasElement;
  export function toDataURL(opts: RenderOptions): Promise<{ width: number; height: number; uri: string }>;

  const bwipjs: {
    toSVG(opts: RenderOptions): string;
    toCanvas(canvas: string | HTMLCanvasElement, opts: RenderOptions): HTMLCanvasElement;
    toDataURL(opts: RenderOptions): Promise<{ width: number; height: number; uri: string }>;
  };

  export default bwipjs;
}
