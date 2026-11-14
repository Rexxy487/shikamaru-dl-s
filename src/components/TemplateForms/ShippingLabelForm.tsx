import React from 'react';
import { ShippingLabelData } from '../../types/barcode';
import { SAMPLE_SHIPPING_LABEL } from '../../utils/sampleData';
import { Package, RotateCcw } from 'lucide-react';

interface ShippingLabelFormProps {
  data: ShippingLabelData;
  onChange: (data: ShippingLabelData) => void;
}

export const ShippingLabelForm: React.FC<ShippingLabelFormProps> = ({ data, onChange }) => {
  const updateField = <K extends keyof ShippingLabelData>(field: K, val: ShippingLabelData[K]) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  const handleResetSample = () => {
    onChange({ ...SAMPLE_SHIPPING_LABEL });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Logistics & Shipping Label</h4>
            <p className="text-xs text-slate-400">High-capacity label format used in warehousing, FedEx, UPS & freight</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetSample}
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600/70 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Load Sample
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Carrier</label>
          <select
            value={data.carrier}
            onChange={(e) => updateField('carrier', e.target.value as ShippingLabelData['carrier'])}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="FedEx">FedEx Express / Ground</option>
            <option value="USPS">USPS Intelligent Mail</option>
            <option value="UPS">UPS Worldwide</option>
            <option value="DHL">DHL Express</option>
            <option value="Custom">Custom Logistics Carrier</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Tracking Number</label>
          <input
            type="text"
            value={data.trackingNumber}
            onChange={(e) => updateField('trackingNumber', e.target.value)}
            placeholder="794829104928"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Service Level</label>
          <input
            type="text"
            value={data.serviceType}
            onChange={(e) => updateField('serviceType', e.target.value)}
            placeholder="PRIORITY OVERNIGHT"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Shipper & Recipient */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shipper */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Shipper (Origin)</span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={data.shipperName}
              onChange={(e) => updateField('shipperName', e.target.value)}
              placeholder="Contact Name"
              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
            />
            <input
              type="text"
              value={data.shipperCompany}
              onChange={(e) => updateField('shipperCompany', e.target.value)}
              placeholder="Company"
              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
            />
          </div>
          <input
            type="text"
            value={data.shipperStreet}
            onChange={(e) => updateField('shipperStreet', e.target.value)}
            placeholder="Street Address"
            className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={data.shipperCity}
              onChange={(e) => updateField('shipperCity', e.target.value)}
              placeholder="City"
              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
            />
            <input
              type="text"
              value={data.shipperState}
              onChange={(e) => updateField('shipperState', e.target.value)}
              placeholder="State"
              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white uppercase"
            />
            <input
              type="text"
              value={data.shipperZip}
              onChange={(e) => updateField('shipperZip', e.target.value)}
              placeholder="Zip"
              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>
        </div>

        {/* Recipient */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Recipient (Destination)</span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={data.recipientName}
              onChange={(e) => updateField('recipientName', e.target.value)}
              placeholder="Contact Name"
              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
            />
            <input
              type="text"
              value={data.recipientCompany}
              onChange={(e) => updateField('recipientCompany', e.target.value)}
              placeholder="Company"
              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
            />
          </div>
          <input
            type="text"
            value={data.recipientStreet}
            onChange={(e) => updateField('recipientStreet', e.target.value)}
            placeholder="Street Address"
            className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={data.recipientCity}
              onChange={(e) => updateField('recipientCity', e.target.value)}
              placeholder="City"
              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
            />
            <input
              type="text"
              value={data.recipientState}
              onChange={(e) => updateField('recipientState', e.target.value)}
              placeholder="State"
              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white uppercase"
            />
            <input
              type="text"
              value={data.recipientZip}
              onChange={(e) => updateField('recipientZip', e.target.value)}
              placeholder="Zip"
              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
