import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BarcodeSettings } from '../types/barcode';
import {
  generatePDF417Svg,
  renderPDF417ToCanvas,
  computeBarcodeMetrics,
} from '../utils/pdf417Engine';
import { errorMessage } from '../utils/errorMessage';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Check,
  Download,
  ScanLine,
  Gauge,
  Maximize,
  Sparkles,
  Info,
  AlertTriangle,
} from 'lucide-react';

interface BarcodePreviewProps {
  text: string;
  settings: BarcodeSettings;
  onOpenExportModal: () => void;
  onSaveToHistory?: () => void;
}

export const BarcodePreview: React.FC<BarcodePreviewProps> = ({
  text,
  settings,
  onOpenExportModal,
  onSaveToHistory,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [showLaser, setShowLaser] = useState<boolean>(false);
  const [showCheckered, setShowCheckered] = useState<boolean>(true);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const { svgString, error, metrics } = useMemo(() => {
    if (!text) {
      return {
        svgString: '',
        error: 'No data provided to encode',
        metrics: null,
      };
    }

    try {
      const svg = generatePDF417Svg(text, settings);
      return {
        svgString: svg,
        error: null,
        metrics: computeBarcodeMetrics(text, settings, svg),
      };
    } catch (err: unknown) {
      console.error('Barcode render error:', err);
      return {
        svgString: '',
        error: errorMessage(
          err,
          'Failed to render PDF417 symbol. Check column and row dimensions.'
        ),
        metrics: null,
      };
    }
  }, [text, settings]);

  useEffect(() => {
    if (!text || error) return;
    try {
      if (canvasRef.current) {
        renderPDF417ToCanvas(canvasRef.current, text, settings);
      }
    } catch (err: unknown) {
      console.error('Barcode render error:', err);
    }
  }, [text, settings, error]);

  const handleCopySvg = async () => {
    if (!svgString) return;
    try {
      await navigator.clipboard.writeText(svgString);
      setCopiedType('svg');
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.warn('Failed to copy SVG:', err);
    }
  };

  const handleCopyPng = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopiedType('png');
          setTimeout(() => setCopiedType(null), 2000);
        } catch {
          // Fallback to dataUrl text if image/png copy not permitted
          const dataUrl = canvasRef.current!.toDataURL('image/png');
          await navigator.clipboard.writeText(dataUrl);
          setCopiedType('png');
          setTimeout(() => setCopiedType(null), 2000);
        }
      });
    } catch (err) {
      console.warn('Failed to copy PNG:', err);
    }
  };

  const handleQuickDownloadPng = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `pdf417-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5 backdrop-blur-md shadow-2xl relative">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Rendered
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {metrics ? `${metrics.widthPx} × ${metrics.heightPx} px` : ''}
          </span>
        </div>

        {/* Zoom & Viewport controls */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.2).toFixed(1))))}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-slate-300 px-1 min-w-[40px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.2).toFixed(1))))}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          <span className="w-px h-4 bg-slate-800 mx-1" />

          {/* Toggle Laser scan simulation */}
          <button
            type="button"
            onClick={() => setShowLaser(!showLaser)}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
              showLaser
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle Scan Laser Simulator"
          >
            <ScanLine className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Checkerboard */}
          <button
            type="button"
            onClick={() => setShowCheckered(!showCheckered)}
            className={`p-1.5 rounded-lg text-xs font-mono transition ${
              showCheckered
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle Checkerboard Background"
          >
            🏁
          </button>

          {/* Fullscreen modal toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Expand View"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport Area */}
      <div
        className={`w-full min-h-[260px] sm:min-h-[300px] flex items-center justify-center p-6 rounded-xl border relative overflow-hidden transition-all ${
          showCheckered
            ? 'bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)] bg-[length:16px_16px] border-slate-800'
            : 'bg-slate-950 border-slate-800'
        }`}
      >
        {/* Animated Laser Sweep Line */}
        {showLaser && !error && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            <div
              className="w-full h-0.5 bg-rose-500 shadow-[0_0_12px_#f43f5e,0_0_24px_#ef4444] absolute"
              style={{
                animation: 'scanLaser 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              }}
            />
            <style>{`
              @keyframes scanLaser {
                0% { top: 5%; opacity: 0.2; }
                50% { top: 90%; opacity: 1; }
                100% { top: 5%; opacity: 0.2; }
              }
            `}</style>
          </div>
        )}

        {error ? (
          <div className="max-w-md text-center p-6 bg-rose-950/40 border border-rose-500/30 rounded-xl space-y-2">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-rose-300">Rendering Error</h4>
            <p className="text-xs text-rose-200/80 font-mono">{error}</p>
            <p className="text-[11px] text-slate-400 pt-2">
              Try setting Columns or Rows to &quot;Auto&quot; or reducing the volume of text.
            </p>
          </div>
        ) : (
          <div
            className="transition-transform duration-150 ease-out origin-center flex flex-col items-center justify-center"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Hidden canvas for PNG export & high-DPI rasterization */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Crisp SVG rendering */}
            {svgString ? (
              <div
                className="select-none inline-block shadow-2xl rounded-sm p-1"
                style={{
                  backgroundColor: settings.isTransparent
                    ? 'transparent'
                    : `#${settings.backgroundcolor || 'ffffff'}`,
                }}
                dangerouslySetInnerHTML={{ __html: svgString }}
              />
            ) : (
              <div className="text-slate-500 text-xs">Generating symbol...</div>
            )}
          </div>
        )}
      </div>

      {/* Export & Clipboard Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy PNG */}
          <button
            type="button"
            onClick={handleCopyPng}
            disabled={!svgString || !!error}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 hover:text-white flex items-center gap-1.5 transition"
          >
            {copiedType === 'png' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied Image!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                Copy PNG
              </>
            )}
          </button>

          {/* Copy SVG */}
          <button
            type="button"
            onClick={handleCopySvg}
            disabled={!svgString || !!error}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 hover:text-white flex items-center gap-1.5 transition"
          >
            {copiedType === 'svg' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied SVG!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                Copy SVG
              </>
            )}
          </button>

          {/* Save to History */}
          {onSaveToHistory && (
            <button
              type="button"
              onClick={onSaveToHistory}
              disabled={!svgString || !!error}
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition"
              title="Save current barcode into local workspace history"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Save to History
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick PNG download */}
          <button
            type="button"
            onClick={handleQuickDownloadPng}
            disabled={!svgString || !!error}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Quick PNG
          </button>

          {/* Full Export Suite Modal button */}
          <button
            type="button"
            onClick={onOpenExportModal}
            disabled={!svgString || !!error}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-4 h-4 text-slate-950" />
            Export Suite (PDF, SVG, High-Res)
          </button>
        </div>
      </div>

      {/* Technical Diagnostics & Metrics HUD */}
      {metrics && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-cyan-400" />
              Barcode Diagnostics & Scannability Specs
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  metrics.isHighQualityContrast
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                }`}
              >
                Contrast: {metrics.contrastRatio}:1 (
                {metrics.isHighQualityContrast ? 'Pass AAA' : 'Low Contrast'}
                )
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Encoded Payload</span>
              <span className="font-semibold text-white font-mono">
                {metrics.charCount} chars ({metrics.byteCount} B)
              </span>
            </div>

            <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Data Codewords</span>
              <span className="font-semibold text-cyan-300 font-mono">
                ~{metrics.estimatedCodewords} data + {metrics.eccCodewords} ECC
              </span>
            </div>

            <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Symbol Matrix</span>
              <span className="font-semibold text-white font-mono">
                {metrics.columns} Cols × {metrics.rows} Rows
              </span>
            </div>

            <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Print Size (300 DPI)</span>
              <span className="font-semibold text-white font-mono">
                {metrics.widthMm} × {metrics.heightMm} mm
              </span>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Info className="w-3 h-3 text-cyan-400" /> PDF417 Capacity Utilization
              </span>
              <span className="font-mono text-cyan-400 font-semibold">
                {metrics.capacityPercentage}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  metrics.capacityPercentage > 85
                    ? 'bg-rose-500'
                    : metrics.capacityPercentage > 60
                    ? 'bg-amber-400'
                    : 'bg-cyan-400'
                }`}
                style={{ width: `${metrics.capacityPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Modal View */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700"
          >
            Close Fullscreen (Esc)
          </button>
          <div className="max-w-4xl max-h-[85vh] p-8 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            {svgString && (
              <div
                className="w-full flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: svgString }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
