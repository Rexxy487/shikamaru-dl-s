import React from 'react';
import { BoardingPassData } from '../../types/barcode';
import { SAMPLE_BOARDING_PASS } from '../../utils/sampleData';
import { Plane, RotateCcw, Calendar } from 'lucide-react';
import { getJulianDay } from '../../utils/bcbp';

interface BoardingPassFormProps {
  data: BoardingPassData;
  onChange: (data: BoardingPassData) => void;
}

export const BoardingPassForm: React.FC<BoardingPassFormProps> = ({ data, onChange }) => {
  const updateField = (field: keyof BoardingPassData, val: string) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  const handleResetSample = () => {
    onChange({ ...SAMPLE_BOARDING_PASS });
  };

  const julian = getJulianDay(data.flightDate);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-400">
            <Plane className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">IATA BCBP Boarding Pass</h4>
            <p className="text-xs text-slate-400">Standard Resolution 792 for airline passenger boarding pass 2D barcodes</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetSample}
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600/70 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Load Sample Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Passenger Name (LAST/FIRST MR/MS)
          </label>
          <input
            type="text"
            value={data.passengerName}
            onChange={(e) => updateField('passengerName', e.target.value.toUpperCase())}
            placeholder="SMITH/JOHN MR"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono uppercase"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            PNR / Record Locator (6-7 chars)
          </label>
          <input
            type="text"
            value={data.pnr}
            maxLength={7}
            onChange={(e) => updateField('pnr', e.target.value.toUpperCase())}
            placeholder="ABC1234"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono uppercase"
          />
        </div>
      </div>

      {/* Flight Route */}
      <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Carrier (IATA 2-3 code)</label>
          <input
            type="text"
            value={data.carrier}
            maxLength={3}
            onChange={(e) => updateField('carrier', e.target.value.toUpperCase())}
            placeholder="AA / UA / BA"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono uppercase"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Flight Number</label>
          <input
            type="text"
            value={data.flightNumber}
            maxLength={5}
            onChange={(e) => updateField('flightNumber', e.target.value.toUpperCase())}
            placeholder="0178"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">From Airport (3-letter)</label>
          <input
            type="text"
            value={data.fromAirport}
            maxLength={3}
            onChange={(e) => updateField('fromAirport', e.target.value.toUpperCase())}
            placeholder="JFK"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono uppercase"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">To Airport (3-letter)</label>
          <input
            type="text"
            value={data.toAirport}
            maxLength={3}
            onChange={(e) => updateField('toAirport', e.target.value.toUpperCase())}
            placeholder="LHR"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono uppercase"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Flight Date</label>
          <input
            type="date"
            value={data.flightDate}
            onChange={(e) => updateField('flightDate', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <span className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-cyan-400" /> Julian Day: {julian}
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Cabin Compartment</label>
          <select
            value={data.compartmentCode}
            onChange={(e) => updateField('compartmentCode', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="F">F - First Class</option>
            <option value="J">J - Business Class</option>
            <option value="W">W - Premium Economy</option>
            <option value="Y">Y - Economy</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Seat Number</label>
          <input
            type="text"
            value={data.seatNumber}
            maxLength={4}
            onChange={(e) => updateField('seatNumber', e.target.value.toUpperCase())}
            placeholder="03A"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono uppercase"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Sequence #</label>
          <input
            type="text"
            value={data.sequenceNumber}
            maxLength={4}
            onChange={(e) => updateField('sequenceNumber', e.target.value)}
            placeholder="0014"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
          />
        </div>
      </div>
    </div>
  );
};
