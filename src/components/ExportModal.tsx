import React, { useState } from 'react';
import { BarcodeSettings } from '../types/barcode';
import type { SinglePdfOptions, SheetPdfOptions } from '../utils/pdfExport';
import { exportSingleBarcodePdf, exportSheetPdf } from '../utils/pdfExport';
import { buildBwipOptions } from '../utils/pdf417Engine';
import bwipjs from 'bwip-js';
import {
  X,
  Download,
  FileImage,
  FileCode,
  FileText,
  Printer,
  Copy,
  Check,
  Grid,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  settings: BarcodeSettings;
  svgString: string;
}

const EXPORT_TABS = [
  { id: 'png', label: 'PNG Image', icon: FileImage },
  { id: 'svg', label: 'SVG Vector', icon: FileCode },
  { id: 'single_pdf', label: 'Single Label PDF', icon: FileText },
  { id: 'sheet_pdf', label: 'Multi-Label Sheet', icon: Grid },
] as const;

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  text,
  settings,
  svgString,
}) => {
  const [activeTab, setActiveTab] = useState<'png' | 'svg' | 'single_pdf' | 'sheet_pdf'>('png');
  const [pngScale, setPngScale] = useState<number>(4); // default 4x for high resolution
  const [copiedDataUrl, setCopiedDataUrl] = useState(false);

  // Single PDF state
  const [pdfPageSize, setPdfPageSize] = useState<'4x6' | '2x1' | 'letter' | 'a4'>('4x6');
  const [pdfOrientation, setPdfOrientation] = useState<'p' | 'l'>('l');
  const [pdfTitle, setPdfTitle] = useState<string>('PDF417 HIGH-DENSITY BARCODE');
  const [pdfSubtitle, setPdfSubtitle] = useState<string>('Standard 2D Symbology (ISO/IEC 15438)');
  const [pdfIncludeDate, setPdfIncludeDate] = useState<boolean>(true);

  // Sheet PDF state
  const [sheetLayout, setSheetLayout] = useState<'avery5160' | 'avery5163' | 'grid2x4' | 'grid1x3'>('avery5163');
  const [sheetCopies, setSheetCopies] = useState<number>(10);
  const [sheetIncludeBorder, setSheetIncludeBorder] = useState<boolean>(true);
  const [sheetLabel, setSheetLabel] = useState<string>('ASSET IDENTIFICATION');

  if (!isOpen) return null;

  // Helper to generate a dataURL canvas at specific scale
  const generateDataUrl = (scale: number): string => {
    const canvas = document.createElement('canvas');
    const opts = buildBwipOptions(text, settings, scale);
    bwipjs.toCanvas(canvas, opts);
    return canvas.toDataURL('image/png');
  };

  const handleDownloadPng = () => {
    const dataUrl = generateDataUrl(pngScale);
    const a = document.createElement('a');
    a.download = `pdf417-${pngScale}x-${Date.now()}.png`;
    a.href = dataUrl;
    a.click();
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `pdf417-vector-${Date.now()}.svg`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSinglePdf = () => {
    const dataUrl = generateDataUrl(4);
    exportSingleBarcodePdf(
      dataUrl,
      {
        pageSize: pdfPageSize,
        orientation: pdfOrientation,
        title: pdfTitle,
        subtitle: pdfSubtitle,
        includeDate: pdfIncludeDate,
      },
      `pdf417-label-${pdfPageSize}.pdf`
    );
  };

  const handleDownloadSheetPdf = () => {
    const dataUrl = generateDataUrl(3);
    const items = Array.from({ length: sheetCopies }, () => ({
      dataUrl,
      label: sheetLabel || 'PDF417',
    }));

    exportSheetPdf(
      items,
      {
        layout: sheetLayout,
        includeBorder: sheetIncludeBorder,
        includeLabels: true,
      },
      `pdf417-sheet-${sheetLayout}.pdf`
    );
  };

  const handleCopyBase64 = async () => {
    const dataUrl = generateDataUrl(3);
    try {
      await navigator.clipboard.writeText(dataUrl);
      setCopiedDataUrl(true);
      setTimeout(() => setCopiedDataUrl(false), 2000);
    } catch (e) {
      console.warn('Failed to copy data url:', e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl text-slate-950">
              <Download className="w-5 h-5 font-bold" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export & Download Suite</h3>
              <p className="text-xs text-slate-400">High-resolution raster, scalable vector, and printable PDF documents</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/40">
          {EXPORT_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-xs transition ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* PNG Tab */}
          {activeTab === 'png' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Resolution & Pixel Density (DPI)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { scale: 2, label: 'Standard (2x)', sub: '72-96 DPI' },
                    { scale: 3, label: 'Medium (3x)', sub: '150 DPI' },
                    { scale: 4, label: 'High-Res (4x)', sub: '300 DPI Print' },
                    { scale: 6, label: 'Ultra HD (6x)', sub: '600 DPI Master' },
                  ].map((preset) => (
                    <button
                      key={preset.scale}
                      type="button"
                      onClick={() => setPngScale(preset.scale)}
                      className={`p-3 rounded-xl border text-left transition ${
                        pngScale === preset.scale
                          ? 'bg-cyan-500/20 border-cyan-500 ring-1 ring-cyan-500/40'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="block text-xs font-bold text-white">{preset.label}</span>
                      <span className="text-[10px] text-cyan-400/90 font-mono">{preset.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <p>
                  <strong>Output Format:</strong> 32-bit PNG with crisp module edges.
                </p>
                <p className="text-slate-400">
                  Background mode:{' '}
                  <span className="text-cyan-400 font-mono">
                    {settings.isTransparent ? 'Transparent' : `#${settings.backgroundcolor || 'ffffff'}`}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  Download PNG Image ({pngScale}x)
                </button>
                <button
                  type="button"
                  onClick={handleCopyBase64}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition"
                >
                  {copiedDataUrl ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-cyan-400" />
                      Copy Base64 URL
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* SVG Tab */}
          {activeTab === 'svg' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
                <h4 className="font-bold text-white text-sm">Infinite Scalability Vector Graphic</h4>
                <p className="text-slate-400 leading-relaxed">
                  SVG defines the barcode mathematically using vector paths. It renders with zero pixelation at any resolution, making it the preferred format for professional offset printing, commercial packaging, Adobe Illustrator, and Laser engraving.
                </p>
                <div className="pt-2 text-slate-400">
                  <span className="font-mono text-cyan-300">ViewBox dimensions:</span> Natural module bounds with clean vector groups.
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadSvg}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
              >
                <Download className="w-4 h-4 text-slate-950" />
                Download SVG Vector File (.svg)
              </button>
            </div>
          )}

          {/* Single PDF Tab */}
          {activeTab === 'single_pdf' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Label / Document Format
                  </label>
                  <select
                    value={pdfPageSize}
                    onChange={(e) => setPdfPageSize(e.target.value as SinglePdfOptions['pageSize'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="4x6">4 x 6 inches (Standard Shipping Label)</option>
                    <option value="2x1">2 x 1 inches (Barcode Asset Tag)</option>
                    <option value="letter">US Letter (8.5 x 11 in)</option>
                    <option value="a4">A4 (210 x 297 mm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Page Orientation
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPdfOrientation('l')}
                      className={`py-2 text-xs rounded-xl border transition ${
                        pdfOrientation === 'l'
                          ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      Landscape
                    </button>
                    <button
                      type="button"
                      onClick={() => setPdfOrientation('p')}
                      className={`py-2 text-xs rounded-xl border transition ${
                        pdfOrientation === 'p'
                          ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      Portrait
                    </button>
                  </div>
                </div>
              </div>

              {pdfPageSize !== '2x1' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Document Header Title</label>
                    <input
                      type="text"
                      value={pdfTitle}
                      onChange={(e) => setPdfTitle(e.target.value)}
                      placeholder="Title on document"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Subtitle / Purpose</label>
                    <input
                      type="text"
                      value={pdfSubtitle}
                      onChange={(e) => setPdfSubtitle(e.target.value)}
                      placeholder="Subtitle"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={pdfIncludeDate}
                      onChange={(e) => setPdfIncludeDate(e.target.checked)}
                      className="accent-cyan-400 rounded"
                    />
                    <span>Include generation date & timestamp stamp</span>
                  </label>
                </div>
              )}

              <button
                type="button"
                onClick={handleDownloadSinglePdf}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
              >
                <Download className="w-4 h-4 text-slate-950" />
                Download PDF Label Document
              </button>
            </div>
          )}

          {/* Multi-Label Sheet Tab */}
          {activeTab === 'sheet_pdf' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Sheet Layout / Template
                  </label>
                  <select
                    value={sheetLayout}
                    onChange={(e) => setSheetLayout(e.target.value as SheetPdfOptions['layout'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="avery5163">Avery 5163 (10 labels • 2 x 4 in)</option>
                    <option value="avery5160">Avery 5160 (30 labels • 1 x 2.62 in)</option>
                    <option value="grid2x4">2 × 4 Grid (8 Shipping Labels)</option>
                    <option value="grid1x3">1 × 3 Strip (3 Jumbo Freight Labels)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Number of Labels to Fill
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={sheetCopies}
                    onChange={(e) => setSheetCopies(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Label Caption / Asset Heading</label>
                <input
                  type="text"
                  value={sheetLabel}
                  onChange={(e) => setSheetLabel(e.target.value)}
                  placeholder="Label header text"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={sheetIncludeBorder}
                  onChange={(e) => setSheetIncludeBorder(e.target.checked)}
                  className="accent-cyan-400 rounded"
                />
                <span>Draw dotted cut lines / peel border around each label</span>
              </label>

              <button
                type="button"
                onClick={handleDownloadSheetPdf}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
              >
                <Download className="w-4 h-4 text-slate-950" />
                Generate Printable PDF Sheet
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrint}
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            Print Page Directly
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
