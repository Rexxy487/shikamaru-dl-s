import bwipjs from 'bwip-js';
import type { RenderOptions } from 'bwip-js';
import { BarcodeSettings, BarcodeMetrics } from '../types/barcode';
import { errorMessage } from './errorMessage';

export const ECC_LEVEL_CODEWORDS: Record<number, number> = {
  0: 2,
  1: 4,
  2: 8,
  3: 16,
  4: 32,
  5: 64,
  6: 128,
  7: 256,
  8: 512,
};

export const DEFAULT_SETTINGS: BarcodeSettings = {
  bcid: 'pdf417',
  eclevel: 2,
  columns: 0, // auto
  rows: 0, // auto
  rowmult: 3,
  scale: 3,
  rotate: 'N',
  barcolor: '000000',
  backgroundcolor: 'ffffff',
  isTransparent: false,
  padding: 10,
  includetext: false,
  textxalign: 'center',
  customLabel: '',
};

/**
 * Calculates relative luminance for WCAG contrast ratio
 */
function getRelativeLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculates barcode contrast ratio
 */
export function calculateContrastRatio(barHex: string, bgHex: string, isTransparent: boolean): number {
  if (isTransparent) {
    bgHex = 'ffffff';
  }
  const l1 = getRelativeLuminance(barHex);
  const l2 = getRelativeLuminance(bgHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

/**
 * Builds bwip-js options from our BarcodeSettings
 */
export function buildBwipOptions(text: string, settings: BarcodeSettings, scaleOverride?: number): RenderOptions {
  const opts: RenderOptions = {
    bcid: settings.bcid,
    text: text || ' ',
    scale: scaleOverride !== undefined ? scaleOverride : settings.scale,
    rotate: settings.rotate,
    barcolor: settings.barcolor.replace('#', ''),
  };

  if (!settings.isTransparent && settings.backgroundcolor) {
    opts.backgroundcolor = settings.backgroundcolor.replace('#', '');
  }

  if (settings.padding > 0) {
    opts.paddingwidth = settings.padding;
    opts.paddingheight = settings.padding;
  }

  if (settings.rowmult && settings.rowmult > 0) {
    opts.rowmult = settings.rowmult;
  }

  if (settings.eclevel >= 0) {
    opts.eclevel = settings.eclevel;
  }

  if (settings.columns > 0) {
    opts.columns = settings.columns;
  }
  if (settings.rows > 0) {
    opts.rows = settings.rows;
  }

  if (settings.includetext) {
    opts.includetext = true;
    opts.textxalign = settings.textxalign;
    if (settings.customLabel) {
      opts.alttext = settings.customLabel;
    }
  }

  return opts;
}

/**
 * Generates an SVG string using bwip-js
 */
export function generatePDF417Svg(text: string, settings: BarcodeSettings): string {
  try {
    const opts = buildBwipOptions(text, settings);
    return bwipjs.toSVG(opts);
  } catch (err: unknown) {
    console.error('Error in generatePDF417Svg:', err);
    throw new Error(errorMessage(err, 'Failed to generate PDF417 SVG barcode.'));
  }
}

/**
 * Renders PDF417 onto a canvas element
 */
export function renderPDF417ToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  settings: BarcodeSettings,
  scaleOverride?: number
): void {
  try {
    const opts = buildBwipOptions(text, settings, scaleOverride);
    bwipjs.toCanvas(canvas, opts);
  } catch (err: unknown) {
    console.error('Error in renderPDF417ToCanvas:', err);
    throw new Error(errorMessage(err, 'Failed to render PDF417 on canvas.'));
  }
}

/**
 * Parses SVG width and height
 */
export function extractSvgDimensions(svgString: string): { width: number; height: number } {
  const match = /viewBox="0 0 (\d+(\.\d+)?) (\d+(\.\d+)?)"/.exec(svgString);
  if (match) {
    return {
      width: parseFloat(match[1]),
      height: parseFloat(match[3]),
    };
  }
  const widthMatch = /width="(\d+(\.\d+)?)"/.exec(svgString);
  const heightMatch = /height="(\d+(\.\d+)?)"/.exec(svgString);
  return {
    width: widthMatch ? parseFloat(widthMatch[1]) : 300,
    height: heightMatch ? parseFloat(heightMatch[1]) : 150,
  };
}

/**
 * Computes deep barcode metrics
 */
export function computeBarcodeMetrics(
  text: string,
  settings: BarcodeSettings,
  svgString?: string
): BarcodeMetrics {
  const charCount = text.length;
  const byteCount = new TextEncoder().encode(text).length;

  const isAllDigits = /^\d+$/.test(text);
  const estimatedCodewords = isAllDigits
    ? Math.ceil(charCount / 2.93)
    : Math.ceil(charCount / 1.8);

  const eccLevel =
    settings.eclevel >= 0
      ? settings.eclevel
      : charCount < 40
      ? 1
      : charCount < 160
      ? 2
      : charCount < 320
      ? 3
      : charCount < 863
      ? 4
      : 5;
  const eccCodewords = ECC_LEVEL_CODEWORDS[eccLevel] || 8;

  const maxCapacityCodewords = 928;
  const capacityPercentage = Math.min(
    100,
    Number(((estimatedCodewords / maxCapacityCodewords) * 100).toFixed(1))
  );

  let widthPx = 320;
  let heightPx = 160;
  if (svgString) {
    const dims = extractSvgDimensions(svgString);
    widthPx = dims.width;
    heightPx = dims.height;
  }

  const mmPerPixelAt300Dpi = 25.4 / 300;
  const widthMm = Number((widthPx * mmPerPixelAt300Dpi).toFixed(1));
  const heightMm = Number((heightPx * mmPerPixelAt300Dpi).toFixed(1));

  let calculatedCols = settings.columns;
  let calculatedRows = settings.rows;
  if (calculatedCols === 0) {
    calculatedCols = Math.max(3, Math.min(30, Math.ceil(Math.sqrt((estimatedCodewords + eccCodewords) * 3))));
  }
  if (calculatedRows === 0) {
    calculatedRows = Math.max(3, Math.min(90, Math.ceil((estimatedCodewords + eccCodewords + 2) / calculatedCols)));
  }

  const isCompact = settings.bcid === 'pdf417compact';
  const widthModules = isCompact
    ? 17 + 17 + 17 * calculatedCols + 1
    : 17 + 17 + 17 * calculatedCols + 17 + 18;
  const totalModules = widthModules * calculatedRows;

  const contrastRatio = calculateContrastRatio(settings.barcolor, settings.backgroundcolor, settings.isTransparent);
  const isHighQualityContrast = contrastRatio >= 4.5;

  return {
    charCount,
    byteCount,
    estimatedCodewords,
    eccCodewords,
    columns: calculatedCols,
    rows: calculatedRows,
    totalModules,
    widthMm,
    heightMm,
    widthPx,
    heightPx,
    contrastRatio,
    isHighQualityContrast,
    capacityPercentage,
  };
}
