import React, { useState } from 'react';
import { BarcodeSettings, BatchItem } from '../types/barcode';
import { generatePDF417Svg, buildBwipOptions } from '../utils/pdf417Engine';
import { exportSheetPdf } from '../utils/pdfExport';
import { errorMessage } from '../utils/errorMessage';
import bwipjs from 'bwip-js';
import JSZip from 'jszip';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  Play,
  RotateCcw,
  Sparkles,
  FileArchive,
  Grid,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface BatchGeneratorProps {
  settings: BarcodeSettings;
}

const SAMPLE_BATCH_CSV = `Label,Tracking_Data
Package-001,PKG-99482-US-EXPRESS-101
Package-002,PKG-99483-US-GROUND-102
Package-003,PKG-99484-US-OVERNIGHT-103
Package-004,PKG-99485-US-PRIORITY-104
Package-005,PKG-99486-US-FREIGHT-105
Package-006,PKG-99487-US-STANDARD-106`;

export const BatchGenerator: React.FC<BatchGeneratorProps> = ({ settings }) => {
  const [rawInput, setRawInput] = useState<string>(SAMPLE_BATCH_CSV);
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [delimiter, setDelimiter] = useState<string>(',');

  // Parse rawInput into items
  const handleParse = (textToParse: string, delim = delimiter) => {
    const lines = textToParse
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setItems([]);
      return;
    }

    // Check if first line looks like header
    let startIndex = 0;
    if (lines[0].toLowerCase().includes('label') || lines[0].toLowerCase().includes('data') || lines[0].toLowerCase().includes('tracking')) {
      startIndex = 1;
    }

    const parsed: BatchItem[] = [];
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      const cols = line.split(delim);
      const label = cols[0] ? cols[0].trim() : `Item-${i + 1}`;
      const data = cols.length > 1 ? cols.slice(1).join(delim).trim() : line;

      parsed.push({
        id: `batch-${i + 1}`,
        label,
        data,
        status: 'pending',
      });
    }

    setItems(parsed);
  };

  // Generate barcodes for all parsed items
  const handleGenerateAll = async () => {
    if (items.length === 0) {
      handleParse(rawInput);
    }

    setIsProcessing(true);
    const updated = [...items];

    // Give UI time to update
    await new Promise((r) => setTimeout(r, 50));

    for (let i = 0; i < updated.length; i++) {
      const item = updated[i];
      try {
        const svg = generatePDF417Svg(item.data, settings);
        // Generate high res canvas for png/pdf
        const canvas = document.createElement('canvas');
        const opts = buildBwipOptions(item.data, settings, 3);
        bwipjs.toCanvas(canvas, opts);
        const dataUrl = canvas.toDataURL('image/png');

        updated[i] = {
          ...item,
          status: 'success',
          svg,
          dataUrl,
        };
      } catch (err: unknown) {
        updated[i] = {
          ...item,
          status: 'error',
          errorMessage: errorMessage(err, 'Failed to encode'),
        };
      }
    }

    setItems(updated);
    setIsProcessing(false);
  };

  // Download all as ZIP
  const handleDownloadZip = async () => {
    const readyItems = items.filter((i) => i.status === 'success' && i.dataUrl);
    if (readyItems.length === 0) {
      alert('Please generate the barcodes before downloading the ZIP.');
      return;
    }

    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('pdf417-barcodes');

      for (let i = 0; i < readyItems.length; i++) {
        const item = readyItems[i];
        if (item.dataUrl) {
          const base64Data = item.dataUrl.replace(/^data:image\/png;base64,/, '');
          const safeLabel = item.label.replace(/[^a-zA-Z0-9_-]/g, '_');
          folder?.file(`${safeLabel || `barcode-${i + 1}`}.png`, base64Data, { base64: true });
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `pdf417-batch-${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (e) {
      console.error('ZIP error:', e);
      alert('Failed to create ZIP file.');
    } finally {
      setIsZipping(false);
    }
  };

  // Export batch as printable sheet
  const handleDownloadSheet = () => {
    const readyItems = items.filter((i) => i.status === 'success' && i.dataUrl);
    if (readyItems.length === 0) {
      alert('Please generate the barcodes first.');
      return;
    }

    exportSheetPdf(
      readyItems.map((item) => ({
        dataUrl: item.dataUrl!,
        label: item.label,
      })),
      {
        layout: 'avery5163',
        includeBorder: true,
        includeLabels: true,
      },
      `pdf417-batch-sheet-${Date.now()}.pdf`
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawInput(content);
      handleParse(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Banner / Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Batch & Bulk PDF417 Generator</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Encode hundreds of records at once from CSV, Excel export, or multiline lists. Download all as a ZIP archive or print as a contact sheet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition">
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            Upload CSV / TXT
            <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            type="button"
            onClick={() => {
              setRawInput(SAMPLE_BATCH_CSV);
              handleParse(SAMPLE_BATCH_CSV, ',');
            }}
            className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Load Sample CSV
          </button>
        </div>
      </div>

      {/* Input area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Paste CSV / Text Data
            </label>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Delimiter:</span>
              <select
                value={delimiter}
                onChange={(e) => {
                  setDelimiter(e.target.value);
                  handleParse(rawInput, e.target.value);
                }}
                className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-white"
              >
                <option value=",">Comma (,)</option>
                <option value="&#9;">Tab (\t)</option>
                <option value=";">Semicolon (;)</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>
          </div>

          <textarea
            rows={9}
            value={rawInput}
            onChange={(e) => {
              setRawInput(e.target.value);
              handleParse(e.target.value);
            }}
            placeholder="Label,Data to encode&#10;Asset-01,SERIAL-992019&#10;Asset-02,SERIAL-992020"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono resize-y"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400 font-mono">
              {items.length} records parsed
            </span>
            <button
              type="button"
              onClick={handleGenerateAll}
              disabled={items.length === 0 || isProcessing}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              {isProcessing ? 'Generating...' : 'Generate All'}
            </button>
          </div>
        </div>

        {/* Live Records Table */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Batch Output Queue</h4>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                  {items.filter((i) => i.status === 'success').length} / {items.length} Ready
                </span>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={items.filter((i) => i.status === 'success').length === 0 || isZipping}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition"
                >
                  <FileArchive className="w-3.5 h-3.5 text-cyan-400" />
                  {isZipping ? 'Zipping...' : 'Download ZIP (.zip)'}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSheet}
                  disabled={items.filter((i) => i.status === 'success').length === 0}
                  className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-50 border border-cyan-500/40 rounded-lg text-xs font-semibold text-cyan-300 flex items-center gap-1.5 transition"
                >
                  <Grid className="w-3.5 h-3.5 text-cyan-400" />
                  Printable Sheet PDF
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="mt-4 max-h-[360px] overflow-y-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 sticky top-0 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-3 py-2.5">#</th>
                    <th className="px-3 py-2.5">Label</th>
                    <th className="px-3 py-2.5">Encoded Payload</th>
                    <th className="px-3 py-2.5 text-center">Status</th>
                    <th className="px-3 py-2.5 text-right">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-500 font-sans">
                        No batch items loaded. Paste CSV data on the left to begin.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-3 py-2 text-slate-500">{idx + 1}</td>
                        <td className="px-3 py-2 font-bold text-white truncate max-w-[120px]">
                          {item.label}
                        </td>
                        <td className="px-3 py-2 text-slate-400 truncate max-w-[200px]">
                          {item.data}
                        </td>
                        <td className="px-3 py-2 text-center font-sans">
                          {item.status === 'success' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                            </span>
                          ) : item.status === 'error' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-medium" title={item.errorMessage}>
                              <AlertCircle className="w-3.5 h-3.5" /> Error
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                              <Clock className="w-3.5 h-3.5" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {item.svg ? (
                            <div className="inline-flex items-center gap-2">
                              <div
                                className="h-7 w-20 bg-white rounded p-0.5 inline-block overflow-hidden"
                                dangerouslySetInnerHTML={{ __html: item.svg }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (item.dataUrl) {
                                    const a = document.createElement('a');
                                    a.download = `${item.label}.png`;
                                    a.href = item.dataUrl;
                                    a.click();
                                  }
                                }}
                                className="p-1 hover:text-cyan-400 transition"
                                title="Download this barcode"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 text-xs text-slate-400 font-sans border-t border-slate-800 mt-4">
            <span>All generated barcodes inherit the current Symbology & ECC settings.</span>
            <button
              type="button"
              onClick={() => {
                setRawInput('');
                setItems([]);
              }}
              className="text-slate-500 hover:text-rose-400 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" /> Clear Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
