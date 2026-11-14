import React from 'react';
import { Type, Sparkles, AlertCircle } from 'lucide-react';

interface TextFormProps {
  value: string;
  onChange: (val: string) => void;
}

export const TextForm: React.FC<TextFormProps> = ({ value, onChange }) => {
  const insertEscape = (code: string) => {
    onChange(value + code);
  };

  const loadSample = (sample: string) => {
    onChange(sample);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Type className="w-4 h-4 text-cyan-400" />
          Raw Content / Text / URL / Escape Sequences
        </label>
        <span className="text-xs font-mono text-gray-400">
          {value.length} chars • {new TextEncoder().encode(value).length} bytes
        </span>
      </div>

      <textarea
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter plain text, URL, multiline data, or binary escape sequences to encode..."
        className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 font-mono resize-y transition shadow-inner"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-gray-400 font-medium mr-1">Insert Escape:</span>
          <button
            type="button"
            onClick={() => insertEscape('\n')}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-cyan-300 font-mono transition"
            title="Line feed (\n)"
          >
            \n (LF)
          </button>
          <button
            type="button"
            onClick={() => insertEscape('\r\n')}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-cyan-300 font-mono transition"
            title="Carriage Return + Line Feed"
          >
            \r\n (CRLF)
          </button>
          <button
            type="button"
            onClick={() => insertEscape('\t')}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-cyan-300 font-mono transition"
            title="Tab"
          >
            \t (TAB)
          </button>
          <button
            type="button"
            onClick={() => insertEscape('\x1e')}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-cyan-300 font-mono transition"
            title="Record Separator (0x1E)"
          >
            \x1E (RS)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadSample('https://github.com/metafloor/bwip-js?spec=pdf417&version=4.11')}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            <Sparkles className="w-3.5 h-3.5" /> Sample URL
          </button>
          <span className="text-slate-600">|</span>
          <button
            type="button"
            onClick={() =>
              loadSample(
                'ITEM-ID: 9482-TX-4401\nBATCH: 2026-Q3\nLOC: WH-BAY-42\nINSP: PASSED\nEXP: 2028-12-31'
              )
            }
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            <Sparkles className="w-3.5 h-3.5" /> Sample Warehouse Tag
          </button>
        </div>
      </div>

      {value.length > 1800 && (
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Text length is approaching PDF417 theoretical capacity (~1,850 alphanumeric chars). Consider lowering error correction level or using Byte mode if needed.
          </span>
        </div>
      )}
    </div>
  );
};
