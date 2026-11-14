import { useState, useEffect, useMemo } from 'react';
import {
  BarcodeSettings,
  TemplateType,
  DriverLicenseData,
  BoardingPassData,
  ShippingLabelData,
  EventTicketData,
  VCardData,
  SavedBarcode,
} from './types/barcode';
import { DEFAULT_SETTINGS, generatePDF417Svg } from './utils/pdf417Engine';
import { generateAAMVAText, parseAAMVAText } from './utils/aamva';
import { generateBCBPText, parseBCBPText } from './utils/bcbp';
import {
  generateShippingText,
  generateEventTicketText,
  generateVCardText,
} from './utils/templateGenerators';
import {
  SAMPLE_DRIVER_LICENSE,
  SAMPLE_BOARDING_PASS,
  SAMPLE_SHIPPING_LABEL,
  SAMPLE_EVENT_TICKET,
  SAMPLE_VCARD,
  SAMPLE_JSON,
} from './utils/sampleData';

import { Header, AppMode } from './components/Header';
import { TemplateSelector } from './components/TemplateSelector';
import { TextForm } from './components/TemplateForms/TextForm';
import { DriverLicenseForm } from './components/TemplateForms/DriverLicenseForm';
import { BoardingPassForm } from './components/TemplateForms/BoardingPassForm';
import { ShippingLabelForm } from './components/TemplateForms/ShippingLabelForm';
import { EventTicketForm } from './components/TemplateForms/EventTicketForm';
import { VCardForm } from './components/TemplateForms/VCardForm';
import { JsonForm } from './components/TemplateForms/JsonForm';
import { SettingsPanel } from './components/SettingsPanel';
import { BarcodePreview } from './components/BarcodePreview';
import { ExportModal } from './components/ExportModal';
import { BatchGenerator } from './components/BatchGenerator';
import { BarcodeScanner } from './components/BarcodeScanner';
import { KnowledgeBase } from './components/KnowledgeBase';
import { HistoryDrawer } from './components/HistoryDrawer';

const LOCAL_STORAGE_KEY = 'pdf417_studio_saved_barcodes';

export function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('generator');
  const [templateType, setTemplateType] = useState<TemplateType>('driver_license');
  const [settings, setSettings] = useState<BarcodeSettings>({ ...DEFAULT_SETTINGS });

  // Template Data states
  const [rawText, setRawText] = useState<string>(
    'https://github.com/metafloor/bwip-js\nISO/IEC 15438 Standard High-Density 2D Barcode\nVerification Code: 99482-TX-4401'
  );
  const [driverLicenseData, setDriverLicenseData] = useState<DriverLicenseData>({
    ...SAMPLE_DRIVER_LICENSE,
  });
  const [boardingPassData, setBoardingPassData] = useState<BoardingPassData>({
    ...SAMPLE_BOARDING_PASS,
  });
  const [shippingData, setShippingData] = useState<ShippingLabelData>({
    ...SAMPLE_SHIPPING_LABEL,
  });
  const [eventTicketData, setEventTicketData] = useState<EventTicketData>({
    ...SAMPLE_EVENT_TICKET,
  });
  const [vcardData, setVCardData] = useState<VCardData>({
    ...SAMPLE_VCARD,
  });
  const [jsonData, setJsonData] = useState<string>(
    JSON.stringify(SAMPLE_JSON, null, 2)
  );

  // Modals & Drawers
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState<boolean>(false);
  const [savedBarcodes, setSavedBarcodes] = useState<SavedBarcode[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved barcodes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        // Loading persisted browser state is the purpose of this mount effect.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSavedBarcodes(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage:', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compute active payload text depending on template
  const activePayload = useMemo(() => {
    switch (templateType) {
      case 'text':
        return rawText;
      case 'driver_license':
        return generateAAMVAText(driverLicenseData);
      case 'boarding_pass':
        return generateBCBPText(boardingPassData);
      case 'shipping':
        return generateShippingText(shippingData);
      case 'event_ticket':
        return generateEventTicketText(eventTicketData);
      case 'vcard':
        return generateVCardText(vcardData);
      case 'json':
        return jsonData;
      default:
        return rawText;
    }
  }, [
    templateType,
    rawText,
    driverLicenseData,
    boardingPassData,
    shippingData,
    eventTicketData,
    vcardData,
    jsonData,
  ]);

  // Compute SVG string for modals
  const activeSvg = useMemo(() => {
    try {
      return generatePDF417Svg(activePayload, settings);
    } catch {
      return '';
    }
  }, [activePayload, settings]);

  // Save current barcode into history
  const handleSaveToHistory = () => {
    const title =
      templateType === 'driver_license'
        ? `DL: ${driverLicenseData.lastName}, ${driverLicenseData.firstName}`
        : templateType === 'boarding_pass'
        ? `Flight: ${boardingPassData.carrier}${boardingPassData.flightNumber} (${boardingPassData.fromAirport}→${boardingPassData.toAirport})`
        : templateType === 'shipping'
        ? `${shippingData.carrier}: ${shippingData.trackingNumber}`
        : templateType === 'event_ticket'
        ? `Ticket: ${eventTicketData.eventName}`
        : templateType === 'vcard'
        ? `vCard: ${vcardData.fullName}`
        : `PDF417 Payload (${activePayload.length} chars)`;

    const newItem: SavedBarcode = {
      id: `saved-${Date.now()}`,
      title,
      createdAt: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      data: activePayload,
      templateType,
      settings: { ...settings },
    };

    const updated = [newItem, ...savedBarcodes.slice(0, 29)];
    setSavedBarcodes(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
    showToast('Saved to local history!');
  };

  const handleDeleteBarcode = (id: string) => {
    const updated = savedBarcodes.filter((b) => b.id !== id);
    setSavedBarcodes(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleClearAllHistory = () => {
    setSavedBarcodes([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    showToast('Cleared history.');
  };

  const handleLoadBarcode = (saved: SavedBarcode) => {
    setSettings(saved.settings);
    setTemplateType(saved.templateType);
    if (saved.templateType === 'text') {
      setRawText(saved.data);
    } else if (saved.templateType === 'json') {
      setJsonData(saved.data);
    } else {
      setRawText(saved.data);
      setTemplateType('text');
    }
    setCurrentMode('generator');
    showToast(`Loaded "${saved.title}"`);
  };

  // When a barcode is decoded in the Scanner component
  const handleLoadFromScanner = (text: string) => {
    // Check if it's AAMVA DL
    const aamva = parseAAMVAText(text);
    if (aamva.isAamva && aamva.data) {
      setDriverLicenseData((prev) => ({
        ...prev,
        ...aamva.data,
      }));
      setTemplateType('driver_license');
    } else {
      // Check if it's BCBP
      const bcbp = parseBCBPText(text);
      if (bcbp.isBcbp && bcbp.data) {
        setBoardingPassData((prev) => ({
          ...prev,
          ...bcbp.data,
        }));
        setTemplateType('boarding_pass');
      } else {
        setRawText(text);
        setTemplateType('text');
      }
    }
    setCurrentMode('generator');
    showToast('Loaded scanned barcode into generator!');
  };

  const handleResetDefaults = () => {
    setSettings({ ...DEFAULT_SETTINGS });
    setTemplateType('text');
    setRawText('PDF417 Studio — High-Density 2D Barcode Generator');
    showToast('Reset settings to standard defaults.');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        savedCount={savedBarcodes.length}
        onOpenHistory={() => setHistoryDrawerOpen(true)}
        onReset={handleResetDefaults}
      />

      {/* Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* MODE 1: Single Barcode Generator */}
        {currentMode === 'generator' && (
          <div className="space-y-6">
            {/* Template Selector Banner */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-xl">
              <TemplateSelector
                currentTemplate={templateType}
                onSelectTemplate={setTemplateType}
              />
            </div>

            {/* Split Grid: Left = Template Form & Controls; Right = Live Barcode Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form & Settings (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Form based on active template */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
                  {templateType === 'text' && (
                    <TextForm value={rawText} onChange={setRawText} />
                  )}
                  {templateType === 'driver_license' && (
                    <DriverLicenseForm
                      data={driverLicenseData}
                      onChange={setDriverLicenseData}
                    />
                  )}
                  {templateType === 'boarding_pass' && (
                    <BoardingPassForm
                      data={boardingPassData}
                      onChange={setBoardingPassData}
                    />
                  )}
                  {templateType === 'shipping' && (
                    <ShippingLabelForm
                      data={shippingData}
                      onChange={setShippingData}
                    />
                  )}
                  {templateType === 'event_ticket' && (
                    <EventTicketForm
                      data={eventTicketData}
                      onChange={setEventTicketData}
                    />
                  )}
                  {templateType === 'vcard' && (
                    <VCardForm data={vcardData} onChange={setVCardData} />
                  )}
                  {templateType === 'json' && (
                    <JsonForm value={jsonData} onChange={setJsonData} />
                  )}
                </div>

                {/* Barcode Tuning & Settings Panel */}
                <SettingsPanel settings={settings} onChange={setSettings} />
              </div>

              {/* Right Column: Live Barcode Center Stage (5 cols sticky) */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
                <BarcodePreview
                  text={activePayload}
                  settings={settings}
                  onOpenExportModal={() => setExportModalOpen(true)}
                  onSaveToHistory={handleSaveToHistory}
                />
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: Batch Generator */}
        {currentMode === 'batch' && <BatchGenerator settings={settings} />}

        {/* MODE 3: Barcode Scanner & Parser */}
        {currentMode === 'scanner' && (
          <BarcodeScanner onLoadIntoGenerator={handleLoadFromScanner} />
        )}

        {/* MODE 4: Knowledge Base & Specifications */}
        {currentMode === 'knowledge' && <KnowledgeBase />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-slate-300">
              PDF417 Studio
            </span>
            <span>•</span>
            <span>ISO/IEC 15438 Compliant</span>
            <span>•</span>
            <span>Reed-Solomon ECC Levels 0–8</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-side Pure JS Engine (Offline Ready)</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setCurrentMode('knowledge')}
              className="text-cyan-400 hover:text-cyan-300 transition"
            >
              PDF417 Spec Guide
            </button>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        text={activePayload}
        settings={settings}
        svgString={activeSvg}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        savedList={savedBarcodes}
        onLoadBarcode={handleLoadBarcode}
        onDeleteBarcode={handleDeleteBarcode}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}

export default App;
