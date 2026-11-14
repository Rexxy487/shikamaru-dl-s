import React from 'react';
import { VCardData } from '../../types/barcode';
import { SAMPLE_VCARD } from '../../utils/sampleData';
import { Contact, RotateCcw } from 'lucide-react';

interface VCardFormProps {
  data: VCardData;
  onChange: (data: VCardData) => void;
}

export const VCardForm: React.FC<VCardFormProps> = ({ data, onChange }) => {
  const updateField = (field: keyof VCardData, val: string) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  const handleResetSample = () => {
    onChange({ ...SAMPLE_VCARD });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">
            <Contact className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Digital Business Card (vCard)</h4>
            <p className="text-xs text-slate-400">Stores complete contact profile scanable by smartphones and tablets</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetSample}
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600/70 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Load Sample Card
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="Dr. Sarah Connor"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Organization / Company</label>
          <input
            type="text"
            value={data.organization}
            onChange={(e) => updateField('organization', e.target.value)}
            placeholder="Cyberdyne Systems"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Job Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Security Director"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+1 (555) 019-2834"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="sarah@example.com"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Website URL</label>
          <input
            type="url"
            value={data.website}
            onChange={(e) => updateField('website', e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1">Street Address</label>
          <input
            type="text"
            value={data.street}
            onChange={(e) => updateField('street', e.target.value)}
            placeholder="1844 Cyberdyne Way"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => updateField('city', e.target.value)}
            placeholder="Los Angeles"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">State / Zip</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={data.state}
              onChange={(e) => updateField('state', e.target.value)}
              placeholder="CA"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-sm text-white uppercase"
            />
            <input
              type="text"
              value={data.postalCode}
              onChange={(e) => updateField('postalCode', e.target.value)}
              placeholder="90028"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-sm text-white font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
