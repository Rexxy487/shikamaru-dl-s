import { BoardingPassData } from '../types/barcode';

// Calculate Julian Day (day of the year 001-366)
export function getJulianDay(dateStr: string): string {
  const date = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(date.getTime())) return '120';
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day.toString().padStart(3, '0');
}

/**
 * Generates an IATA standard BCBP (Bar Coded Passenger Boarding Pass) PDF417 string
 */
export function generateBCBPText(bp: BoardingPassData): string {
  // Format code: 'M' (Multiple legs or single), number of legs: '1'
  const formatCode = 'M1';

  // Passenger Name: max 20 chars, padded with spaces (LAST/FIRST TITLE)
  const name = (bp.passengerName || 'PASSENGER/TEST').toUpperCase().padEnd(20, ' ').substring(0, 20);

  // Electronic ticket indicator: 'E'
  const eTicket = 'E';

  // PNR / Booking code: 7 chars
  const pnr = (bp.pnr || 'ABC1234').toUpperCase().padEnd(7, ' ').substring(0, 7);

  // From Airport: 3 chars
  const from = (bp.fromAirport || 'JFK').toUpperCase().padEnd(3, ' ').substring(0, 3);

  // To Airport: 3 chars
  const to = (bp.toAirport || 'LHR').toUpperCase().padEnd(3, ' ').substring(0, 3);

  // Operating Carrier: 3 chars
  const carrier = (bp.carrier || 'AA').toUpperCase().padEnd(3, ' ').substring(0, 3);

  // Flight number: 5 chars (numeric or alphanumeric)
  const flightNum = (bp.flightNumber || '0100').toUpperCase().padEnd(5, ' ').substring(0, 5);

  // Date of flight: 3 chars (Julian day 001-366)
  const julian = getJulianDay(bp.flightDate);

  // Compartment code: 1 char (F = First, J = Business, W = Premium Economy, Y = Economy)
  const compartment = (bp.compartmentCode || 'Y').toUpperCase().substring(0, 1);

  // Seat number: 4 chars (e.g. 014B)
  const seat = (bp.seatNumber || '14B').toUpperCase().padStart(4, '0').substring(0, 4);

  // Sequence number: 4 or 5 chars
  const seq = (bp.sequenceNumber || '0024').toUpperCase().padStart(4, '0').substring(0, 4);

  // Passenger status: 1 char (1 = Normal check-in)
  const status = '1';

  // Size of variable size field: 2 chars hex (00 if none)
  const varSize = '00';

  return `${formatCode}${name}${eTicket}${pnr}${from}${to}${carrier}${flightNum}${julian}${compartment}${seat}${seq}${status}${varSize}`;
}

/**
 * Parses raw text to check if it's an IATA BCBP string and extract fields
 */
export function parseBCBPText(raw: string): { isBcbp: boolean; data?: Partial<BoardingPassData> } {
  if (!raw || !raw.startsWith('M1') || raw.length < 50) {
    return { isBcbp: false };
  }

  try {
    const passengerName = raw.substring(2, 22).trim();
    const pnr = raw.substring(23, 30).trim();
    const fromAirport = raw.substring(30, 33).trim();
    const toAirport = raw.substring(33, 36).trim();
    const carrier = raw.substring(36, 39).trim();
    const flightNumber = raw.substring(39, 44).trim();
    const julian = raw.substring(44, 47).trim();
    const compartmentCode = raw.substring(47, 48).trim();
    const seatNumber = raw.substring(48, 52).trim().replace(/^0+/, '');
    const sequenceNumber = raw.substring(52, 56).trim();

    return {
      isBcbp: true,
      data: {
        passengerName,
        pnr,
        fromAirport,
        toAirport,
        carrier,
        flightNumber,
        compartmentCode,
        seatNumber,
        sequenceNumber,
        flightDate: `Day ${julian} of year`,
      },
    };
  } catch {
    return { isBcbp: false };
  }
}
