import React, { useState, useRef, useEffect, useCallback } from 'react';
import NextImage from 'next/image';
import { analyzeScanResult, decodeFromImage, decodeFromImageUrl, ScanResult, getVideoInputDevices } from '../utils/scannerEngine';
import { generateAAMVAText } from '../utils/aamva';
import { generateBCBPText } from '../utils/bcbp';
import { generateShippingText } from '../utils/templateGenerators';
import {
  SAMPLE_DRIVER_LICENSE,
  SAMPLE_BOARDING_PASS,
  SAMPLE_SHIPPING_LABEL,
} from '../utils/sampleData';
import { buildBwipOptions } from '../utils/pdf417Engine';
import { DEFAULT_SETTINGS } from '../utils/pdf417Engine';
import bwipjs from 'bwip-js';
import {
  Scan,
  Upload,
  Camera,
  RotateCcw,
  CheckCircle,
  Copy,
  ShieldCheck,
  Plane,
  Package,
  ArrowRight,
  AlertTriangle,
  StopCircle,
} from 'lucide-react';
import { BrowserPDF417Reader } from '@zxing/library';
import { errorMessage } from '../utils/errorMessage';

interface BarcodeScannerProps {
  onLoadIntoGenerator: (text: string) => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onLoadIntoGenerator }) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'camera'>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const cameraReaderRef = useRef<BrowserPDF417Reader | null>(null);

  const stopCamera = useCallback(() => {
    if (cameraReaderRef.current) {
      cameraReaderRef.current.reset();
      cameraReaderRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    // List cameras
    getVideoInputDevices().then((devices) => {
      setCameras(devices);
      if (devices.length > 0) {
        setSelectedCameraId(devices[0].deviceId);
      }
    });

    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleImageUpload = (file: File) => {
    if (!file) return;
    setScanError(null);
    setScanResult(null);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result;
      if (typeof result !== 'string') {
        setScanError('The selected file could not be read as an image.');
        setIsLoading(false);
        return;
      }
      const url = result;
      setImagePreview(url);

      const img = new Image();
      img.onload = async () => {
        try {
          const result = await decodeFromImage(img);
          setScanResult(result);
          setIsLoading(false);
        } catch (err: unknown) {
          setScanError(errorMessage(err, 'Could not find a valid PDF417 barcode in this image.'));
          setIsLoading(false);
        }
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  // Helper to load sample synthetic barcodes for testing
  const loadTestSample = async (type: 'license' | 'boarding' | 'shipping') => {
    setIsLoading(true);
    setScanError(null);

    let text = '';
    if (type === 'license') {
      text = generateAAMVAText(SAMPLE_DRIVER_LICENSE);
    } else if (type === 'boarding') {
      text = generateBCBPText(SAMPLE_BOARDING_PASS);
    } else {
      text = generateShippingText(SAMPLE_SHIPPING_LABEL);
    }

    try {
      const canvas = document.createElement('canvas');
      const opts = buildBwipOptions(text, { ...DEFAULT_SETTINGS, scale: 3 });
      bwipjs.toCanvas(canvas, opts);
      const dataUrl = canvas.toDataURL('image/png');
      setImagePreview(dataUrl);

      const res = await decodeFromImageUrl(dataUrl);
      setScanResult(res);
    } catch (e: unknown) {
      setScanError(errorMessage(e, 'Sample generation failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const startCamera = async () => {
    if (!videoRef.current) return;
    setScanError(null);
    setIsCameraActive(true);

    try {
      const codeReader = new BrowserPDF417Reader();
      cameraReaderRef.current = codeReader;

      await codeReader.decodeFromVideoDevice(
        selectedCameraId || null,
        videoRef.current,
        (result, err) => {
          if (result) {
            const raw = result.getText();
            setScanResult(analyzeScanResult(raw, result.getBarcodeFormat().toString()));
            stopCamera();
          }
          if (err) {
            // normal searching frame
          }
        }
      );
    } catch (err: unknown) {
      console.error('Camera error:', err);
      setScanError(errorMessage(err, 'Unable to access webcam. Please check permissions.'));
      setIsCameraActive(false);
    }
  };

  const handleCopyResult = async () => {
    if (!scanResult) return;
    await navigator.clipboard.writeText(scanResult.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <Scan className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">PDF417 Barcode Scanner & Parser</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Decode PDF417 symbols from photos, screen captures, or live video. Automatically parses AAMVA Driver&apos;s Licenses and IATA Boarding Passes.
          </p>
        </div>

        {/* Test sample buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Quick Test Sample:</span>
          <button
            type="button"
            onClick={() => loadTestSample('license')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-cyan-300 flex items-center gap-1 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Driver&apos;s License
          </button>
          <button
            type="button"
            onClick={() => loadTestSample('boarding')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-cyan-300 flex items-center gap-1 transition"
          >
            <Plane className="w-3.5 h-3.5 text-sky-400" />
            Boarding Pass
          </button>
          <button
            type="button"
            onClick={() => loadTestSample('shipping')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-cyan-300 flex items-center gap-1 transition"
          >
            <Package className="w-3.5 h-3.5 text-emerald-400" />
            Shipping Tag
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Input (Upload / Camera) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setActiveMode('upload');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeMode === 'upload'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Image
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('camera')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeMode === 'camera'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                Live Camera
              </button>
            </div>

            {imagePreview && activeMode === 'upload' && (
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setScanResult(null);
                  setScanError(null);
                }}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          {activeMode === 'upload' ? (
            <div>
              {imagePreview ? (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
                  <NextImage
                    src={imagePreview}
                    alt="Uploaded barcode"
                    width={800}
                    height={600}
                    unoptimized
                    className="max-h-56 max-w-full rounded object-contain border border-slate-800 bg-white"
                  />
                  <div className="text-center">
                    <label className="cursor-pointer text-xs text-cyan-400 hover:text-cyan-300 font-medium">
                      Select a different image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="flex flex-col items-center justify-center min-h-[260px] p-6 border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl bg-slate-950/40 cursor-pointer transition group"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Drop PDF417 barcode photo here
                  </span>
                  <span className="text-xs text-slate-400 mt-1">or click to browse files</span>
                  <span className="text-[10px] text-slate-500 mt-3 font-mono">
                    PNG, JPEG, WebP, SVG supported
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          ) : (
            /* Camera Mode */
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[260px] flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover rounded-xl"
                  playsInline
                  muted
                />

                {!isCameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-950/80">
                    <Camera className="w-10 h-10 text-slate-500 mb-2" />
                    <p className="text-xs text-slate-400 text-center mb-4">
                      Allow webcam access to scan PDF417 barcodes in real-time
                    </p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                    >
                      <Camera className="w-4 h-4" /> Start Camera
                    </button>
                  </div>
                )}

                {/* Reticle guide */}
                {isCameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-4/5 h-28 border-2 border-cyan-400/80 rounded-xl relative shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-rose-500/80 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>

              {isCameraActive && (
                <div className="flex items-center justify-between">
                  {cameras.length > 1 && (
                    <select
                      value={selectedCameraId}
                      onChange={(e) => setSelectedCameraId(e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2 py-1"
                    >
                      {cameras.map((c) => (
                        <option key={c.deviceId} value={c.deviceId}>
                          {c.label || `Camera ${c.deviceId.slice(0, 5)}`}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="ml-auto px-3 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <StopCircle className="w-3.5 h-3.5" /> Stop Camera
                  </button>
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-xs text-cyan-400 py-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Scanning image and analyzing codewords...
            </div>
          )}

          {scanError && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div>
                <strong>Scan Unsuccessful:</strong> {scanError}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Decoded Results & Parsed Inspection */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Decoded Inspection</h4>
              </div>

              {scanResult && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase font-semibold">
                  Format: {scanResult.detectedType}
                </span>
              )}
            </div>

            {scanResult ? (
              <div className="mt-4 space-y-4">
                {/* Special AAMVA Driver's License Card Visualizer */}
                {scanResult.detectedType === 'aamva' && scanResult.aamvaDetails?.data && (
                  <div className="p-4 bg-gradient-to-br from-slate-950 to-blue-950/40 border border-blue-500/30 rounded-xl space-y-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-500 text-white font-black text-xs rounded">
                          {scanResult.aamvaDetails.data.state || 'DL'}
                        </span>
                        <span className="text-xs font-bold text-white tracking-wider">
                          DRIVER LICENSE / IDENTIFICATION CARD
                        </span>
                      </div>
                      <span className="text-[10px] text-blue-300 font-mono">ANSI 6360 VERIFIED</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">CARDHOLDER NAME</span>
                        <span className="font-bold text-white">
                          {scanResult.aamvaDetails.data.firstName} {scanResult.aamvaDetails.data.middleName} {scanResult.aamvaDetails.data.lastName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">LICENSE NUMBER (DAQ)</span>
                        <span className="font-bold text-cyan-400 font-mono">
                          {scanResult.aamvaDetails.data.licenseNumber || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">DATE OF BIRTH (DBB)</span>
                        <span className="font-semibold text-slate-200">
                          {scanResult.aamvaDetails.data.dob || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">EXPIRES (DBA)</span>
                        <span className="font-semibold text-rose-300">
                          {scanResult.aamvaDetails.data.expiryDate || 'N/A'}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 block">ADDRESS</span>
                        <span className="text-slate-300">
                          {scanResult.aamvaDetails.data.street}, {scanResult.aamvaDetails.data.city}, {scanResult.aamvaDetails.data.state} {scanResult.aamvaDetails.data.postalCode}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Special IATA BCBP Boarding Pass Visualizer */}
                {scanResult.detectedType === 'bcbp' && scanResult.bcbpDetails?.data && (
                  <div className="p-4 bg-gradient-to-br from-slate-950 to-sky-950/40 border border-sky-500/30 rounded-xl space-y-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-sky-400" />
                        <span className="text-xs font-bold text-white tracking-wider">
                          IATA ELECTRONIC BOARDING PASS
                        </span>
                      </div>
                      <span className="text-xs font-mono text-sky-300 font-bold">
                        PNR: {scanResult.bcbpDetails.data.pnr}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block">ORIGIN</span>
                        <span className="text-2xl font-black text-white font-mono">
                          {scanResult.bcbpDetails.data.fromAirport}
                        </span>
                      </div>
                      <div className="text-center px-4">
                        <span className="text-[10px] text-slate-400 block">FLIGHT</span>
                        <span className="text-xs font-bold text-sky-400 font-mono">
                          {scanResult.bcbpDetails.data.carrier} {scanResult.bcbpDetails.data.flightNumber}
                        </span>
                        <div className="w-16 h-px bg-sky-500/40 my-1 mx-auto" />
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">DESTINATION</span>
                        <span className="text-2xl font-black text-white font-mono">
                          {scanResult.bcbpDetails.data.toAirport}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">PASSENGER</span>
                        <span className="font-semibold text-white">
                          {scanResult.bcbpDetails.data.passengerName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">SEAT</span>
                        <span className="font-black text-cyan-300 font-mono text-sm">
                          {scanResult.bcbpDetails.data.seatNumber || '01A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">CABIN</span>
                        <span className="font-semibold text-white">
                          Class {scanResult.bcbpDetails.data.compartmentCode}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Raw Decoded Stream Display */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-300">Raw Decoded Payload</span>
                    <span className="text-xs font-mono text-slate-400">
                      {scanResult.text.length} characters
                    </span>
                  </div>
                  <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-gray-200 font-mono overflow-x-auto max-h-48 whitespace-pre-wrap select-all">
                    {scanResult.text}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Upload or capture a PDF417 barcode to inspect decoded payload details here.
              </div>
            )}
          </div>

          {/* Action buttons */}
          {scanResult && (
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCopyResult}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    Copy Raw
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onLoadIntoGenerator(scanResult.text)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition"
              >
                <span>Load in Generator</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
