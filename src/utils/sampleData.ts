import {
  DriverLicenseData,
  BoardingPassData,
  ShippingLabelData,
  EventTicketData,
  VCardData,
} from '../types/barcode';

export const SAMPLE_DRIVER_LICENSE: DriverLicenseData = {
  jurisdiction: 'CA',
  firstName: 'SARAH',
  middleName: 'ELIZABETH',
  lastName: 'CONNOR',
  licenseNumber: 'D8392019',
  dob: '1985-06-15',
  expiryDate: '2029-06-15',
  issueDate: '2024-06-15',
  sex: '2',
  height: '66 in',
  eyeColor: 'GRN',
  hairColor: 'BRN',
  street: '1844 CYBERDYNE WAY',
  city: 'LOS ANGELES',
  state: 'CA',
  postalCode: '90028',
  licenseClass: 'C',
  endorsements: 'NONE',
  restrictions: 'NONE',
  discriminator: 'CA994820194829',
};

export const SAMPLE_BOARDING_PASS: BoardingPassData = {
  passengerName: 'CONNOR/SARAH MS',
  pnr: 'W7KQ89',
  fromAirport: 'LAX',
  toAirport: 'JFK',
  carrier: 'UA',
  flightNumber: '0284',
  flightDate: '2026-09-18',
  compartmentCode: 'J',
  seatNumber: '03A',
  sequenceNumber: '0014',
  frequentFlyerNumber: 'UA-99382109',
};

export const SAMPLE_SHIPPING_LABEL: ShippingLabelData = {
  carrier: 'FedEx',
  trackingNumber: '7948291049281902',
  serviceType: 'PRIORITY OVERNIGHT',
  weight: '4.2',
  shipperName: 'Logistics Fulfillment Hub',
  shipperCompany: 'TechLogix Global Inc.',
  shipperStreet: '1000 Industrial Parkway',
  shipperCity: 'Memphis',
  shipperState: 'TN',
  shipperZip: '38118',
  recipientName: 'Sarah Connor',
  recipientCompany: 'Cyber Technologies LLC',
  recipientStreet: '1844 Cyberdyne Way',
  recipientCity: 'Los Angeles',
  recipientState: 'CA',
  recipientZip: '90028',
  referenceNumber: 'PO-2026-9938',
};

export const SAMPLE_EVENT_TICKET: EventTicketData = {
  eventName: 'Global Cyber Summit 2026',
  venue: 'Moscone Convention Center',
  dateTime: '2026-10-14 09:00 AM',
  gate: 'North Gate B',
  section: 'VIP',
  row: 'A',
  seat: '12',
  ticketId: 'GCS26-88392-VIP',
  attendeeName: 'Sarah Connor',
  ticketTier: 'VIP All-Access Pass',
  price: '899.00',
  securityHash: '8e4f9b2c3a1d0e57f8a9',
};

export const SAMPLE_VCARD: VCardData = {
  fullName: 'Dr. Sarah Connor',
  organization: 'Cyberdyne Systems Security',
  title: 'Lead Autonomous Systems Architect',
  email: 'sarah.connor@cyberdyne.org',
  phone: '+1 (555) 019-2834',
  website: 'https://cyberdyne.org',
  street: '1844 Cyberdyne Way',
  city: 'Los Angeles',
  state: 'CA',
  postalCode: '90028',
};

export const SAMPLE_JSON = {
  id: 'ASSET-2026-9921',
  type: 'Industrial Sensor Array',
  firmware: 'v4.18.2',
  calibrationDate: '2026-05-12',
  maintenanceCycleDays: 90,
  authorizedTechnician: 'ID-4402',
  telemetry: {
    maxTempC: 85.5,
    minTempC: -20.0,
    voltageNominal: 24.0,
  },
  digitalSignature: '9f83ac01948bd98201',
};

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC', 'PR',
];
