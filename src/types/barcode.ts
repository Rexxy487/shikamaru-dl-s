export type PDF417Bcid = 'pdf417' | 'pdf417compact' | 'micropdf417';

export type RotationOption = 'N' | 'R' | 'L' | 'I'; // 0, 90, 270, 180 deg

export type EclevelOption = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // -1 = auto

export interface BarcodeSettings {
  bcid: PDF417Bcid;
  eclevel: EclevelOption;
  columns: number; // 0 = auto, 1-30
  rows: number; // 0 = auto, 3-90
  rowmult: number; // 2, 3, 4, 5 (ratio)
  scale: number; // 1-8
  rotate: RotationOption;
  barcolor: string; // hex without #
  backgroundcolor: string; // hex without # or '' for transparent
  isTransparent: boolean;
  padding: number; // mm
  includetext: boolean;
  textxalign: 'left' | 'center' | 'right';
  customLabel: string;
}

export type TemplateType =
  | 'text'
  | 'driver_license'
  | 'boarding_pass'
  | 'shipping'
  | 'event_ticket'
  | 'vcard'
  | 'json';

export interface DriverLicenseData {
  jurisdiction: string;
  firstName: string;
  middleName: string;
  lastName: string;
  licenseNumber: string;
  dob: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  issueDate: string; // YYYY-MM-DD
  sex: '1' | '2' | '9'; // 1=Male, 2=Female, 9=Not specified
  height: string; // e.g., 5'-10" or 70 in
  eyeColor: string; // BLU, BRO, GRN, HAZ, etc.
  hairColor: string; // BLK, BRN, BLN, RED, etc.
  street: string;
  city: string;
  state: string;
  postalCode: string;
  licenseClass: string; // e.g. C, D
  endorsements: string; // NONE or codes
  restrictions: string; // NONE or codes
  discriminator: string; // document discriminator
}

export interface BoardingPassData {
  passengerName: string; // e.g. SMITH/JOHN MR
  pnr: string; // e.g. ABC123
  fromAirport: string; // e.g. JFK
  toAirport: string; // e.g. LHR
  carrier: string; // e.g. BA
  flightNumber: string; // e.g. 0178
  flightDate: string; // YYYY-MM-DD
  compartmentCode: string; // F, J, W, Y
  seatNumber: string; // e.g. 04A
  sequenceNumber: string; // e.g. 0018
  frequentFlyerNumber: string;
}

export interface ShippingLabelData {
  carrier: 'FedEx' | 'USPS' | 'UPS' | 'DHL' | 'Custom';
  trackingNumber: string;
  serviceType: string;
  weight: string;
  shipperName: string;
  shipperCompany: string;
  shipperStreet: string;
  shipperCity: string;
  shipperState: string;
  shipperZip: string;
  recipientName: string;
  recipientCompany: string;
  recipientStreet: string;
  recipientCity: string;
  recipientState: string;
  recipientZip: string;
  referenceNumber: string;
}

export interface EventTicketData {
  eventName: string;
  venue: string;
  dateTime: string;
  gate: string;
  section: string;
  row: string;
  seat: string;
  ticketId: string;
  attendeeName: string;
  ticketTier: string;
  price: string;
  securityHash: string;
}

export interface VCardData {
  fullName: string;
  organization: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface BarcodeMetrics {
  charCount: number;
  byteCount: number;
  estimatedCodewords: number;
  eccCodewords: number;
  columns: number;
  rows: number;
  totalModules: number;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  contrastRatio: number;
  isHighQualityContrast: boolean;
  capacityPercentage: number;
}

export interface BatchItem {
  id: string;
  label: string;
  data: string;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
  svg?: string;
  dataUrl?: string;
}

export interface SavedBarcode {
  id: string;
  title: string;
  createdAt: string;
  data: string;
  templateType: TemplateType;
  settings: BarcodeSettings;
}
