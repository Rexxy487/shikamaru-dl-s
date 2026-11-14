import React, { useState } from 'react';
import { BarcodeSettings, EclevelOption, RotationOption } from '../types/barcode';
import {
  Sliders,
  Shield,
  Palette,
  Maximize2,
  Layers,
  RotateCw,
  HelpCircle,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SettingsPanelProps {
  settings: BarcodeSettings;
  onChange: (settings: BarcodeSettings) => void;
}

const COLOR_PRESETS = [
  { name: 'Black', hex: '000000', label: '#000000' },
  { name: 'Navy', hex: '0A2540', label: '#0A2540' },
  { name: 'Slate', hex: '1E293B', label: '#1E293B' },
  { name: 'Forest', hex: '064E3B', label: '#064E3B' },
  { name: 'Crimson', hex: '881337', label: '#881337' },
];

const BG_COLOR_PRESETS = [
  { name: 'White', hex: 'FFFFFF', label: '#FFFFFF' },
  { name: 'Ghost', hex: 'F8FAFC', label: '#F8FAFC' },
  { name: 'Cream', hex: 'FEFCE8', label: '#FEFCE8' },
  { name: 'Muted', hex: 'F1F5F9', label: '#F1F5F9' },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = <K extends keyof BarcodeSettings>(key: K, val: BarcodeSettings[K]) => {
    onChange({
      ...settings,
      [key]: val,
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-6 backdrop-blur-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-wide">PDF417 Parameters</h3>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800 px-2 py-0.5 rounded-full">
          {settings.bcid === 'pdf417' ? 'Standard' : settings.bcid === 'pdf417compact' ? 'Compact' : 'Micro'}
        </span>
      </div>

      {/* Symbology Type */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Symbology Variant
          </span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => update('bcid', 'pdf417')}
            className={`px-3 py-2 text-xs font-medium rounded-xl border text-center transition ${
              settings.bcid === 'pdf417'
                ? 'bg-cyan-500/20 border-cyan-500 text-white font-semibold shadow-sm'
                : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white'
            }`}
          >
            PDF417 (Full)
          </button>
          <button
            type="button"
            onClick={() => update('bcid', 'pdf417compact')}
            className={`px-3 py-2 text-xs font-medium rounded-xl border text-center transition ${
              settings.bcid === 'pdf417compact'
                ? 'bg-cyan-500/20 border-cyan-500 text-white font-semibold shadow-sm'
                : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white'
            }`}
          >
            Compact (Truncated)
          </button>
          <button
            type="button"
            onClick={() => update('bcid', 'micropdf417')}
            className={`px-3 py-2 text-xs font-medium rounded-xl border text-center transition ${
              settings.bcid === 'micropdf417'
                ? 'bg-cyan-500/20 border-cyan-500 text-white font-semibold shadow-sm'
                : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white'
            }`}
          >
            MicroPDF417
          </button>
        </div>
      </div>

      {/* Error Correction Level */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            Error Correction (Reed-Solomon)
          </label>
          <span className="text-[11px] font-mono text-cyan-300">
            {settings.eclevel === -1 ? 'Auto (Recommended)' : `Level ${settings.eclevel}`}
          </span>
        </div>
        <select
          value={settings.eclevel}
          onChange={(e) => update('eclevel', parseInt(e.target.value, 10) as EclevelOption)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
        >
          <option value="-1">Auto — Automatically picked by data density</option>
          <option value="0">ECC Level 0 (2 codewords • No redundancy)</option>
          <option value="1">ECC Level 1 (4 codewords • Low redundancy)</option>
          <option value="2">ECC Level 2 (8 codewords • Recommended Default)</option>
          <option value="3">ECC Level 3 (16 codewords • Standard ID cards)</option>
          <option value="4">ECC Level 4 (32 codewords • ~25% recovery)</option>
          <option value="5">ECC Level 5 (64 codewords • ~35% recovery)</option>
          <option value="6">ECC Level 6 (128 codewords • Harsh logistics)</option>
          <option value="7">ECC Level 7 (256 codewords • Severe damage proof)</option>
          <option value="8">ECC Level 8 (512 codewords • Maximum security)</option>
        </select>
      </div>

      {/* Grid of Columns, Rows, Aspect Ratio, Scale */}
      <div className="grid grid-cols-2 gap-4">
        {/* Scale */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
              <Maximize2 className="w-3 h-3 text-cyan-400" />
              Scale
            </label>
            <span className="text-xs font-mono text-cyan-400">{settings.scale}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            step="1"
            value={settings.scale}
            onChange={(e) => update('scale', parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Row Multiplier / Aspect Ratio */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300">Module Aspect</label>
            <span className="text-xs font-mono text-cyan-400">{settings.rowmult}x height</span>
          </div>
          <select
            value={settings.rowmult}
            onChange={(e) => update('rowmult', parseInt(e.target.value, 10))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="2">2:1 (Slightly compact)</option>
            <option value="3">3:1 (Standard ISO ratio)</option>
            <option value="4">4:1 (Taller bars)</option>
            <option value="5">5:1 (Ultra readable)</option>
          </select>
        </div>
      </div>

      {/* Rotation & Padding */}
      <div className="grid grid-cols-2 gap-4">
        {/* Rotation */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
            <RotateCw className="w-3 h-3 text-cyan-400" />
            Orientation
          </label>
          <div className="grid grid-cols-4 gap-1">
            {[
              { id: 'N', label: '0°' },
              { id: 'R', label: '90°' },
              { id: 'I', label: '180°' },
              { id: 'L', label: '270°' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => update('rotate', r.id as RotationOption)}
                className={`py-1.5 text-xs rounded-lg border font-mono transition ${
                  settings.rotate === r.id
                    ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quiet Zone Padding */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300">Quiet Zone</label>
            <span className="text-xs font-mono text-cyan-400">{settings.padding} pt</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="2"
            value={settings.padding}
            onChange={(e) => update('padding', parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>
      </div>

      {/* Colors & Palette */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            Colors & Background
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={settings.isTransparent}
              onChange={(e) => update('isTransparent', e.target.checked)}
              className="accent-cyan-400 rounded"
            />
            <span>Transparent BG</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Bar Color */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-slate-400">Bar Color</span>
              <span className="text-[10px] font-mono text-slate-300">#{settings.barcolor}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={`#${settings.barcolor}`}
                onChange={(e) => update('barcolor', e.target.value.replace('#', ''))}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
              />
              <div className="flex items-center gap-1">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => update('barcolor', p.hex)}
                    style={{ backgroundColor: `#${p.hex}` }}
                    title={p.name}
                    className={`w-5 h-5 rounded-md border transition ${
                      settings.barcolor.toUpperCase() === p.hex
                        ? 'border-cyan-400 ring-2 ring-cyan-500/50 scale-110'
                        : 'border-slate-600 hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Background Color */}
          {!settings.isTransparent ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate-400">Background</span>
                <span className="text-[10px] font-mono text-slate-300">#{settings.backgroundcolor}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={`#${settings.backgroundcolor}`}
                  onChange={(e) => update('backgroundcolor', e.target.value.replace('#', ''))}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                />
                <div className="flex items-center gap-1">
                  {BG_COLOR_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => update('backgroundcolor', p.hex)}
                      style={{ backgroundColor: `#${p.hex}` }}
                      title={p.name}
                      className={`w-5 h-5 rounded-md border transition ${
                        settings.backgroundcolor.toUpperCase() === p.hex
                          ? 'border-cyan-400 ring-2 ring-cyan-500/50 scale-110'
                          : 'border-slate-600 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="text-xs text-slate-400 italic">Background is transparent</span>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Matrix Controls Collapsible */}
      <div className="pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-white py-1 transition"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            Advanced Matrix & Dimensions (Columns / Rows)
          </span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="mt-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Columns: {settings.columns === 0 ? 'Auto' : settings.columns}
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={settings.columns}
                  onChange={(e) => update('columns', parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="text-[10px] text-slate-500">0 = Auto (1-30)</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Rows: {settings.rows === 0 ? 'Auto' : settings.rows}
                </label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={settings.rows}
                  onChange={(e) => update('rows', parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="text-[10px] text-slate-500">0 = Auto (3-90)</span>
              </div>
            </div>

            {/* Human Readable Text */}
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 mb-2">
                <input
                  type="checkbox"
                  checked={settings.includetext}
                  onChange={(e) => update('includetext', e.target.checked)}
                  className="accent-cyan-400 rounded"
                />
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  Print Human-Readable Text Caption
                </span>
              </label>

              {settings.includetext && (
                <div className="space-y-2 mt-2">
                  <input
                    type="text"
                    value={settings.customLabel}
                    onChange={(e) => update('customLabel', e.target.value)}
                    placeholder="Custom caption text (optional)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Align:</span>
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => update('textxalign', align)}
                        className={`px-2 py-0.5 rounded capitalize ${
                          settings.textxalign === align
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                            : 'bg-slate-800 hover:text-white'
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
