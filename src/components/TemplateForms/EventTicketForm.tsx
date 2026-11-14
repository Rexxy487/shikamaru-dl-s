import React from 'react';
import { EventTicketData } from '../../types/barcode';
import { SAMPLE_EVENT_TICKET } from '../../utils/sampleData';
import { Ticket, RotateCcw } from 'lucide-react';

interface EventTicketFormProps {
  data: EventTicketData;
  onChange: (data: EventTicketData) => void;
}

export const EventTicketForm: React.FC<EventTicketFormProps> = ({ data, onChange }) => {
  const updateField = (field: keyof EventTicketData, val: string) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  const handleResetSample = () => {
    onChange({ ...SAMPLE_EVENT_TICKET });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Event & Admission Ticket</h4>
            <p className="text-xs text-slate-400">Secure entry barcode for stadiums, concerts, and conventions</p>
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
          <label className="block text-xs font-medium text-slate-300 mb-1">Event Name</label>
          <input
            type="text"
            value={data.eventName}
            onChange={(e) => updateField('eventName', e.target.value)}
            placeholder="Global Cyber Summit 2026"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Venue / Location</label>
          <input
            type="text"
            value={data.venue}
            onChange={(e) => updateField('venue', e.target.value)}
            placeholder="Moscone Convention Center"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Gate / Entry</label>
          <input
            type="text"
            value={data.gate}
            onChange={(e) => updateField('gate', e.target.value)}
            placeholder="Gate B"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Section</label>
          <input
            type="text"
            value={data.section}
            onChange={(e) => updateField('section', e.target.value)}
            placeholder="VIP-101"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Row</label>
          <input
            type="text"
            value={data.row}
            onChange={(e) => updateField('row', e.target.value)}
            placeholder="A"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Seat</label>
          <input
            type="text"
            value={data.seat}
            onChange={(e) => updateField('seat', e.target.value)}
            placeholder="12"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Attendee Name</label>
          <input
            type="text"
            value={data.attendeeName}
            onChange={(e) => updateField('attendeeName', e.target.value)}
            placeholder="Sarah Connor"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Ticket ID / Code</label>
          <input
            type="text"
            value={data.ticketId}
            onChange={(e) => updateField('ticketId', e.target.value)}
            placeholder="TCK-99201"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Security Token / Hash</label>
          <input
            type="text"
            value={data.securityHash}
            onChange={(e) => updateField('securityHash', e.target.value)}
            placeholder="a4f89d..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
          />
        </div>
      </div>
    </div>
  );
};
