import React, { useState } from 'react';
import {
  BookOpen,
  Info,
  ShieldAlert,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

type KnowledgeSection = 'anatomy' | 'ecc' | 'variants' | 'standards' | 'guidelines';

const KNOWLEDGE_SECTIONS: { id: KnowledgeSection; label: string }[] = [
  { id: 'anatomy', label: 'Symbol Anatomy' },
  { id: 'ecc', label: 'Error Correction' },
  { id: 'variants', label: 'Symbology Variants' },
  { id: 'standards', label: 'Industry Standards' },
  { id: 'guidelines', label: 'Print Best Practices' },
];

export const KnowledgeBase: React.FC = () => {
  const [activeSection, setActiveSection] = useState<KnowledgeSection>('anatomy');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">PDF417 Technical Reference & Standards Guide</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Learn the inner engineering of the world&apos;s leading high-capacity stacked 2D barcode standard (ISO/IEC 15438).
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800 text-xs">
          {KNOWLEDGE_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                activeSection === sec.id
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Anatomy Section */}
      {activeSection === 'anatomy' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="max-w-3xl space-y-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              What Does &quot;PDF417&quot; Stand For?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-300">PDF</strong> stands for{' '}
              <strong className="text-white">Portable Data File</strong>. The numeral{' '}
              <strong className="text-cyan-300">417</strong> refers to the fundamental structure of each codeword in the barcode:
              every codeword consists of <strong className="text-white">4 bars</strong> and{' '}
              <strong className="text-white">4 spaces</strong> within a total width of{' '}
              <strong className="text-white">17 modules</strong>.
            </p>
          </div>

          {/* Interactive Visual Anatomy Breakdown */}
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Architectural Anatomy of a PDF417 Row
            </span>

            {/* Colored Segment Diagram */}
            <div className="grid grid-cols-12 gap-1 text-center font-mono text-[10px] select-none">
              <div className="col-span-1 p-2 bg-slate-800/80 border border-slate-700 rounded text-slate-400">
                Quiet Zone
              </div>
              <div className="col-span-2 p-2 bg-blue-950/80 border border-blue-500/40 rounded text-blue-300 font-bold">
                Start Pattern (17m)
              </div>
              <div className="col-span-2 p-2 bg-purple-950/80 border border-purple-500/40 rounded text-purple-300 font-bold">
                Left Row Indicator (17m)
              </div>
              <div className="col-span-3 p-2 bg-cyan-950/80 border border-cyan-500/40 rounded text-cyan-300 font-bold">
                Data Columns 1..N (17m each)
              </div>
              <div className="col-span-2 p-2 bg-purple-950/80 border border-purple-500/40 rounded text-purple-300 font-bold">
                Right Row Indicator (17m)
              </div>
              <div className="col-span-1 p-2 bg-blue-950/80 border border-blue-500/40 rounded text-blue-300 font-bold">
                Stop Pattern (18m)
              </div>
              <div className="col-span-1 p-2 bg-slate-800/80 border border-slate-700 rounded text-slate-400">
                Quiet Zone
              </div>
            </div>

            {/* Details for each part */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-blue-400">1. Start & Stop Patterns</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Fixed bar-space sequences (Start: 81111140, Stop: 711311121) that establish barcode boundaries and scan angle.
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-purple-400">2. Row Indicators (Left & Right)</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Encode the current row number, total symbol rows, total columns, and error correction level across three cyclic clusters.
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-400">3. Data Codewords</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  929 possible codeword values divided into 3 mathematically distinct clusters (Cluster 0, 3, 6) preventing vertical misreads.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Correction Section */}
      {activeSection === 'ecc' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Reed-Solomon Error Correction</h4>
              <p className="text-xs text-slate-400">
                PDF417 uses polynomial Reed-Solomon math to reconstruct missing or corrupted data.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">ECC Level</th>
                  <th className="px-4 py-3">EC Codewords</th>
                  <th className="px-4 py-3">Erasures Correctable</th>
                  <th className="px-4 py-3">Errors Correctable</th>
                  <th className="px-4 py-3">Recommended Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {[
                  { level: 0, ec: 2, er: 2, err: 1, use: 'Error detection only (clean laboratory testing)' },
                  { level: 1, ec: 4, er: 4, err: 2, use: 'Clean laser-printed short tags (< 40 chars)' },
                  { level: 2, ec: 8, er: 8, err: 4, use: 'Standard Default (40-160 chars, general packaging)' },
                  { level: 3, ec: 16, er: 16, err: 8, use: 'Identification cards, driver licenses (160-320 chars)' },
                  { level: 4, ec: 32, er: 32, err: 16, use: 'International shipping & airline boarding passes' },
                  { level: 5, ec: 64, er: 64, err: 32, use: 'Harsh industrial logistics, outdoor weathering' },
                  { level: 6, ec: 128, er: 128, err: 64, use: 'Heavy wear, wrinkled freight documents' },
                  { level: 7, ec: 256, er: 256, err: 128, use: 'Severe damage resilience (torn labels)' },
                  { level: 8, ec: 512, er: 512, err: 256, use: 'Maximum security & defense contracts' },
                ].map((row) => (
                  <tr key={row.level} className="hover:bg-slate-800/40">
                    <td className="px-4 py-2.5 font-bold text-cyan-400">Level {row.level}</td>
                    <td className="px-4 py-2.5">{row.ec}</td>
                    <td className="px-4 py-2.5">{row.er}</td>
                    <td className="px-4 py-2.5">{row.err}</td>
                    <td className="px-4 py-2.5 font-sans text-slate-300">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Variants Section */}
      {activeSection === 'variants' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold uppercase">
                ISO/IEC 15438
              </span>
              <h4 className="text-sm font-bold text-white">Standard PDF417</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full standard stacked symbology with both left and right row indicators and full stop pattern. Highest fault tolerance and omnidirectional read capabilities.
              </p>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside pt-2">
                <li>1 to 30 data columns</li>
                <li>3 to 90 rows</li>
                <li>Up to 1,850 text characters</li>
              </ul>
            </div>

            <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase">
                Truncated
              </span>
              <h4 className="text-sm font-bold text-white">Compact PDF417</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Removes the right-side row indicator and compresses the stop pattern down to a single 1-module bar. Saves substantial horizontal space when barcodes are read in clean environments.
              </p>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside pt-2">
                <li>Narrower footprint (~18 modules saved)</li>
                <li>Ideal for point-of-sale & badge cards</li>
                <li>Requires good print contrast</li>
              </ul>
            </div>

            <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold uppercase">
                ISO/IEC 24728
              </span>
              <h4 className="text-sm font-bold text-white">MicroPDF417</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A 2D matrix symbology derived from PDF417 designed specifically for direct-part marking and small electrical component labeling with predetermined column configurations (1 to 4 columns).
              </p>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside pt-2">
                <li>Ultra-compact module size</li>
                <li>Integrated fixed error correction</li>
                <li>Automotive & medical specimens</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Standards Section */}
      {activeSection === 'standards' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4" /> AAMVA DL/ID Standard
                </span>
                <span className="text-[10px] text-slate-500 font-mono">ANSI-6360</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standardized by the American Association of Motor Vehicle Administrators. Encodes driver identification, biometrics, organ donor status, and jurisdictional security codes on the back of all 50 US State and Canadian Provincial driver licenses.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4" /> IATA BCBP (Resolution 792)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Airline Industry</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                International Air Transport Association Bar Coded Passenger Boarding Pass standard used at airport check-in counters and boarding gates worldwide. Contains passenger name, PNR, flight route, compartment, and seat allocation.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4" /> FedEx & USPS Shipping
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Global Logistics</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Used on package labels and international customs declarations (e.g. USPS Form 2976-A) to encapsulate multi-line consignee, shipper, customs classification, and routing codes on thermal shipping labels.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4" /> DoD CAC & NATO STANAG
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Military Defense</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Common Access Cards (CAC) and military credentialing systems encode the DoD Electronic Data Interchange Personal Identifier (EDIPI), branch of service, and Geneva Convention status on physical identification cards.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Guidelines Section */}
      {activeSection === 'guidelines' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="max-w-2xl space-y-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              Printing & Scannability Guidelines
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ensure 100% first-pass read rates in high-throughput environments by adhering to the following ISO/IEC specifications:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-white block">1. Minimum Quiet Zone (Margins)</span>
              <p className="text-slate-400 leading-relaxed">
                Always maintain a clear, unprinted white quiet zone of at least <strong className="text-cyan-300">2X to 4X module width</strong> (minimum 2.5 mm) on all four sides of the barcode. Lack of quiet zone is the #1 cause of scanner failure.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-white block">2. Module Aspect Ratio (Row Multiplier)</span>
              <p className="text-slate-400 leading-relaxed">
                Standard PDF417 modules have a vertical height that is <strong className="text-cyan-300">3 times</strong> their horizontal width (3:1 ratio). Lowering below 2:1 is discouraged as standard laser beam scanners may miss rows when swept at an angle.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-white block">3. Contrast Ratio & Ink Bleed</span>
              <p className="text-slate-400 leading-relaxed">
                Optical scanners operate with red illuminators (630–670 nm). Never print barcodes with red or yellow bars. Maintain a contrast ratio of at least <strong className="text-cyan-300">4.5:1</strong> (black bars on white substrate is ideal).
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-white block">4. Direct Thermal Printing Resolution</span>
              <p className="text-slate-400 leading-relaxed">
                When printing on thermal label printers (Zebra, Citizen, Rollo), use a minimum of <strong className="text-cyan-300">203 DPI or 300 DPI</strong> to prevent bar distortion and module rounding artifacts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
