import React, { useState } from 'react';
import { SAMPLE_JSON } from '../../utils/sampleData';
import { Braces, RotateCcw, Check, AlertCircle, Wand2 } from 'lucide-react';
import { errorMessage } from '../../utils/errorMessage';

interface JsonFormProps {
  value: string;
  onChange: (val: string) => void;
}

export const JsonForm: React.FC<JsonFormProps> = ({ value, onChange }) => {
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleChange = (text: string) => {
    onChange(text);
    try {
      JSON.parse(text);
      setIsValid(true);
      setErrorMsg('');
    } catch (err: unknown) {
      setIsValid(false);
      setErrorMsg(errorMessage(err, 'Invalid JSON'));
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
      setIsValid(true);
      setErrorMsg('');
    } catch (err: unknown) {
      setIsValid(false);
      setErrorMsg(errorMessage(err, 'Invalid JSON'));
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed));
      setIsValid(true);
      setErrorMsg('');
    } catch (err: unknown) {
      setIsValid(false);
      setErrorMsg(errorMessage(err, 'Invalid JSON'));
    }
  };

  const loadSample = () => {
    onChange(JSON.stringify(SAMPLE_JSON, null, 2));
    setIsValid(true);
    setErrorMsg('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <Braces className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">JSON / Structured Data</h4>
            <p className="text-xs text-slate-400">Encodes compact objects, hardware telemetry, and API payloads</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={formatJson}
            className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600/70 transition flex items-center gap-1"
            title="Prettify JSON"
          >
            <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
            Format
          </button>
          <button
            type="button"
            onClick={minifyJson}
            className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600/70 transition"
            title="Minify JSON to save barcode capacity"
          >
            Minify
          </button>
          <button
            type="button"
            onClick={loadSample}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600/70 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Sample
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          rows={7}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder='{"key": "value"}'
          className={`w-full bg-slate-900/90 border rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 font-mono transition shadow-inner resize-y ${
            isValid
              ? 'border-slate-700 focus:ring-cyan-500/50 focus:border-cyan-500'
              : 'border-rose-500 focus:ring-rose-500/50 focus:border-rose-500'
          }`}
        />
        <div className="absolute top-3 right-3">
          {isValid ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3" /> Valid JSON
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/80 border border-rose-500/30 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3" /> Syntax Error
            </span>
          )}
        </div>
      </div>

      {!isValid && errorMsg && (
        <p className="text-xs text-rose-400 font-mono bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg">
          {errorMsg}
        </p>
      )}

      <p className="text-xs text-slate-400">
        💡 <strong className="text-slate-300">Tip:</strong> Clicking <span className="text-cyan-400">Minify</span> strips whitespace and drastically reduces symbol size, making the PDF417 faster and easier to scan.
      </p>
    </div>
  );
};
