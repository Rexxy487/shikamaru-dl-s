import { BrowserPDF417Reader, NotFoundException } from '@zxing/library';
import { parseAAMVAText } from './aamva';
import { parseBCBPText } from './bcbp';
import { errorMessage } from './errorMessage';

let readerInstance: BrowserPDF417Reader | null = null;

function getReader(): BrowserPDF417Reader {
  if (!readerInstance) {
    readerInstance = new BrowserPDF417Reader();
  }
  return readerInstance;
}

export interface ScanResult {
  text: string;
  format: string;
  detectedType: 'aamva' | 'bcbp' | 'vcard' | 'json' | 'url' | 'plain';
  aamvaDetails?: ReturnType<typeof parseAAMVAText>;
  bcbpDetails?: ReturnType<typeof parseBCBPText>;
  timestamp: string;
}

export async function decodeFromImage(imgElement: HTMLImageElement): Promise<ScanResult> {
  const reader = getReader();
  try {
    const result = await reader.decodeFromImageElement(imgElement);
    const text = result.getText();
    return analyzeScanResult(text, result.getBarcodeFormat().toString());
  } catch (err: unknown) {
    if (err instanceof NotFoundException) {
      throw new Error('No PDF417 barcode could be detected in this image. Please ensure the barcode is clearly visible, well-lit, and in focus.');
    }
    throw new Error(errorMessage(err, 'Failed to decode barcode from image.'));
  }
}

export async function decodeFromImageUrl(url: string): Promise<ScanResult> {
  const reader = getReader();
  try {
    const result = await reader.decodeFromImageUrl(url);
    const text = result.getText();
    return analyzeScanResult(text, result.getBarcodeFormat().toString());
  } catch (err: unknown) {
    if (err instanceof NotFoundException) {
      throw new Error('No PDF417 barcode could be detected in this image.');
    }
    throw new Error(errorMessage(err, 'Failed to decode barcode.'));
  }
}

export function analyzeScanResult(text: string, format = 'PDF_417'): ScanResult {
  const aamva = parseAAMVAText(text);
  if (aamva.isAamva) {
    return {
      text,
      format,
      detectedType: 'aamva',
      aamvaDetails: aamva,
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  const bcbp = parseBCBPText(text);
  if (bcbp.isBcbp) {
    return {
      text,
      format,
      detectedType: 'bcbp',
      bcbpDetails: bcbp,
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  if (text.includes('BEGIN:VCARD')) {
    return {
      text,
      format,
      detectedType: 'vcard',
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  try {
    JSON.parse(text);
    return {
      text,
      format,
      detectedType: 'json',
      timestamp: new Date().toLocaleTimeString(),
    };
  } catch {
    // not json
  }

  if (/^https?:\/\//i.test(text.trim())) {
    return {
      text,
      format,
      detectedType: 'url',
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  return {
    text,
    format,
    detectedType: 'plain',
    timestamp: new Date().toLocaleTimeString(),
  };
}

export async function getVideoInputDevices(): Promise<MediaDeviceInfo[]> {
  const reader = getReader();
  try {
    const devices = await reader.listVideoInputDevices();
    return devices;
  } catch (e) {
    console.warn('Failed to list video input devices:', e);
    return [];
  }
}
