import React from 'react';
import { TemplateType } from '../types/barcode';
import { Type, ShieldCheck, Plane, Package, Ticket, Contact, Braces } from 'lucide-react';

interface TemplateSelectorProps {
  currentTemplate: TemplateType;
  onSelectTemplate: (template: TemplateType) => void;
}

const TEMPLATES: Array<{
  id: TemplateType;
  label: string;
  badge?: string;
  icon: React.ElementType;
  description: string;
}> = [
  {
    id: 'text',
    label: 'Plain / Raw',
    icon: Type,
    description: 'Freeform text, escape codes & URLs',
  },
  {
    id: 'driver_license',
    label: "Driver's License",
    badge: 'AAMVA',
    icon: ShieldCheck,
    description: 'US & Canada official DMV standard',
  },
  {
    id: 'boarding_pass',
    label: 'Boarding Pass',
    badge: 'IATA',
    icon: Plane,
    description: 'Airline BCBP Resolution 792',
  },
  {
    id: 'shipping',
    label: 'Shipping Label',
    icon: Package,
    description: 'FedEx, UPS, USPS & Logistics',
  },
  {
    id: 'event_ticket',
    label: 'Event Ticket',
    icon: Ticket,
    description: 'Concerts, sports & admission',
  },
  {
    id: 'vcard',
    label: 'Digital vCard',
    icon: Contact,
    description: 'Scan-to-save contact info',
  },
  {
    id: 'json',
    label: 'JSON / Objects',
    icon: Braces,
    description: 'Structured payloads & telemetry',
  },
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  currentTemplate,
  onSelectTemplate,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Template & Encoding Standard
        </label>
        <span className="text-[11px] text-cyan-400/90 font-medium">Standardized Schemes</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {TEMPLATES.map((item) => {
          const Icon = item.icon;
          const isSelected = currentTemplate === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTemplate(item.id)}
              className={`group relative text-left p-2.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-500/10 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`p-1.5 rounded-lg ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
                      isSelected
                        ? 'bg-cyan-500 text-black font-extrabold'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <div>
                <span
                  className={`block text-xs font-semibold leading-tight truncate ${
                    isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {item.label}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {item.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
