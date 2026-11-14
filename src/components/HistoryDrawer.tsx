import React from 'react';
import { SavedBarcode } from '../types/barcode';
import {
  History,
  X,
  Trash2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plane,
  Package,
  Ticket,
  Contact,
  Type,
  Braces,
} from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedList: SavedBarcode[];
  onLoadBarcode: (barcode: SavedBarcode) => void;
  onDeleteBarcode: (id: string) => void;
  onClearAll: () => void;
}

const TEMPLATE_ICONS: Record<string, React.ElementType> = {
  text: Type,
  driver_license: ShieldCheck,
  boarding_pass: Plane,
  shipping: Package,
  event_ticket: Ticket,
  vcard: Contact,
  json: Braces,
};

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedList,
  onLoadBarcode,
  onDeleteBarcode,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Generation History</h3>
              <p className="text-xs text-slate-400">Locally saved barcodes ({savedList.length})</p>
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

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedList.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No saved barcodes in history yet.
              <p className="mt-1 text-[11px] text-slate-600">
                Click &quot;Save to History&quot; on any generated barcode to store it here.
              </p>
            </div>
          ) : (
            savedList.map((item) => {
              const Icon = TEMPLATE_ICONS[item.templateType] || Type;
              return (
                <div
                  key={item.id}
                  className="p-3.5 bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-xl space-y-2 group transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-800 text-cyan-400 rounded-lg">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-white truncate max-w-[180px]">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{item.createdAt}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-mono truncate bg-slate-900 px-2 py-1 rounded">
                    {item.data}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.settings.bcid.toUpperCase()} • ECC {item.settings.eclevel === -1 ? 'Auto' : item.settings.eclevel}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onDeleteBarcode(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onLoadBarcode(item);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg font-medium text-xs flex items-center gap-1 transition"
                      >
                        Load <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {savedList.length > 0 && (
          <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All History
            </button>
            <span className="text-[10px] text-slate-500">Stored in browser localStorage</span>
          </div>
        )}
      </div>
    </div>
  );
};
