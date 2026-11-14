import React from 'react';
import { DriverLicenseData } from '../../types/barcode';
import { US_STATES, SAMPLE_DRIVER_LICENSE } from '../../utils/sampleData';
import { ShieldCheck, RotateCcw } from 'lucide-react';

interface DriverLicenseFormProps {
  data: DriverLicenseData;
  onChange: (data: DriverLicenseData) => void;
}

export const DriverLicenseForm: React.FC<DriverLicenseFormProps> = ({ data, onChange }) => {
  const updateField = <K extends keyof DriverLicenseData>(field: K, val: DriverLicenseData[K]) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  const handleResetSample = () => {
    onChange({ ...SAMPLE_DRIVER_LICENSE });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">AAMVA Driver&apos;s License / ID</h4>
            <p className="text-xs text-slate-400">Encodes compliant ANSI-6360 subfile format used by DMV & Law Enforcement</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetSample}
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600/70 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Load Sample DL
        </button>
      </div>

      {/* Grid of inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">State / Jurisdiction</label>
          <select
            value={data.state}
            onChange={(e) => {
              updateField('state', e.target.value);
              updateField('jurisdiction', e.target.value);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            {US_STATES.map((st) => (
              <option key={st} value={st}>
                {st} (IIN Standard)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">License Number (DAQ)</label>
          <input
            type="text"
            value={data.licenseNumber}
            onChange={(e) => updateField('licenseNumber', e.target.value.toUpperCase())}
            placeholder="D1234567"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Class (DCA)</label>
          <input
            type="text"
            value={data.licenseClass}
            onChange={(e) => updateField('licenseClass', e.target.value.toUpperCase())}
            placeholder="C"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">First Name (DAC)</label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => updateField('firstName', e.target.value.toUpperCase())}
            placeholder="JOHN"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 uppercase"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Middle Name (DAD)</label>
          <input
            type="text"
            value={data.middleName}
            onChange={(e) => updateField('middleName', e.target.value.toUpperCase())}
            placeholder="MICHAEL"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 uppercase"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Last Name (DCS)</label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => updateField('lastName', e.target.value.toUpperCase())}
            placeholder="DOE"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 uppercase"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth (DBB)</label>
          <input
            type="date"
            value={data.dob}
            onChange={(e) => updateField('dob', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Expiration Date (DBA)</label>
          <input
            type="date"
            value={data.expiryDate}
            onChange={(e) => updateField('expiryDate', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Issue Date (DBD)</label>
          <input
            type="date"
            value={data.issueDate}
            onChange={(e) => updateField('issueDate', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Sex (DBC)</label>
          <select
            value={data.sex}
            onChange={(e) => updateField('sex', e.target.value as DriverLicenseData['sex'])}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="1">1 - Male</option>
            <option value="2">2 - Female</option>
            <option value="9">9 - Not specified</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Height (DAU)</label>
          <input
            type="text"
            value={data.height}
            onChange={(e) => updateField('height', e.target.value)}
            placeholder="68 in"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Eye Color (DAY)</label>
          <select
            value={data.eyeColor}
            onChange={(e) => updateField('eyeColor', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="BLU">BLU - Blue</option>
            <option value="BRO">BRO - Brown</option>
            <option value="GRN">GRN - Green</option>
            <option value="HAZ">HAZ - Hazel</option>
            <option value="GRY">GRY - Gray</option>
            <option value="BLK">BLK - Black</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Hair Color (DAZ)</label>
          <select
            value={data.hairColor}
            onChange={(e) => updateField('hairColor', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="BRN">BRN - Brown</option>
            <option value="BLK">BLK - Black</option>
            <option value="BLN">BLN - Blond</option>
            <option value="RED">RED - Red</option>
            <option value="GRY">GRY - Gray</option>
            <option value="WHI">WHI - White</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1">Street Address (DAG)</label>
          <input
            type="text"
            value={data.street}
            onChange={(e) => updateField('street', e.target.value.toUpperCase())}
            placeholder="123 MAIN STREET"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 uppercase"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">City (DAI)</label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => updateField('city', e.target.value.toUpperCase())}
            placeholder="SAN FRANCISCO"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 uppercase"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Postal Code (DAK)</label>
          <input
            type="text"
            value={data.postalCode}
            onChange={(e) => updateField('postalCode', e.target.value)}
            placeholder="94103"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Restrictions (DCB)</label>
          <input
            type="text"
            value={data.restrictions}
            onChange={(e) => updateField('restrictions', e.target.value.toUpperCase())}
            placeholder="NONE"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Doc Discriminator (DCF)</label>
          <input
            type="text"
            value={data.discriminator}
            onChange={(e) => updateField('discriminator', e.target.value)}
            placeholder="CA994820194829"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
          />
        </div>
      </div>
    </div>
  );
};
