import { DriverLicenseData } from '../types/barcode';

// Standard US IIN (Issuer Identification Numbers) mapping for states
const JURISDICTION_IIN: Record<string, string> = {
  CA: '636014',
  NY: '636001',
  TX: '636015',
  FL: '636010',
  IL: '636035',
  PA: '636025',
  OH: '636023',
  GA: '636055',
  NC: '636003',
  MI: '636037',
  WA: '636043',
  VA: '636000',
  AZ: '636026',
  MA: '636002',
  TN: '636053',
  IN: '636034',
  MO: '636030',
  MD: '636005',
  WI: '636038',
  CO: '636020',
  DEFAULT: '636000',
};

export function formatAAMVADate(dateStr: string): string {
  // Converts YYYY-MM-DD to MMDDYYYY or YYYYMMDD (AAMVA 2016 uses YYYYMMDD or MMDDYYYY)
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${month}${day}${year}`;
  }
  return dateStr.replace(/\D/g, '');
}

export function parseAAMVADate(raw: string): string {
  if (!raw) return '';
  const clean = raw.trim();
  // Check MMDDYYYY (8 chars)
  if (clean.length === 8) {
    // If year is first (YYYYMMDD)
    if (parseInt(clean.substring(0, 4), 10) > 1900 && parseInt(clean.substring(0, 4), 10) < 2100) {
      return `${clean.substring(0, 4)}-${clean.substring(4, 6)}-${clean.substring(6, 8)}`;
    }
    // Else MMDDYYYY
    return `${clean.substring(4, 8)}-${clean.substring(0, 2)}-${clean.substring(2, 4)}`;
  }
  return raw;
}

/**
 * Builds standard compliant AAMVA 2016/2020 driver license text stream
 */
export function generateAAMVAText(dl: DriverLicenseData): string {
  const iin = JURISDICTION_IIN[dl.state.toUpperCase()] || JURISDICTION_IIN.DEFAULT;
  const aamvaVersion = '08'; // 08 corresponds to AAMVA 2016-2020 spec
  const jurVersion = '00';

  // Subfile entries
  const entries: string[] = [];
  entries.push(`DCA${dl.licenseClass.toUpperCase() || 'C'}`);
  entries.push(`DCB${dl.restrictions.toUpperCase() || 'NONE'}`);
  entries.push(`DCD${dl.endorsements.toUpperCase() || 'NONE'}`);
  entries.push(`DBA${formatAAMVADate(dl.expiryDate)}`);
  entries.push(`DCS${dl.lastName.toUpperCase()}`);
  entries.push(`DAC${dl.firstName.toUpperCase()}`);
  entries.push(`DAD${dl.middleName.toUpperCase()}`);
  entries.push(`DBD${formatAAMVADate(dl.issueDate)}`);
  entries.push(`DBB${formatAAMVADate(dl.dob)}`);
  entries.push(`DBC${dl.sex}`);
  entries.push(`DAY${dl.eyeColor.toUpperCase()}`);
  entries.push(`DAU${dl.height.replace(/[^0-9]/g, '') || '070'} IN`);
  entries.push(`DAG${dl.street.toUpperCase()}`);
  entries.push(`DAI${dl.city.toUpperCase()}`);
  entries.push(`DAJ${dl.state.toUpperCase()}`);
  entries.push(`DAK${dl.postalCode.toUpperCase().replace(/[^0-9A-Z]/g, '')}`);
  entries.push(`DAQ${dl.licenseNumber.toUpperCase()}`);
  entries.push(`DCF${dl.discriminator || 'A10992384729'}`);
  entries.push(`DCGUSA`);
  entries.push(`DAZ${dl.hairColor.toUpperCase() || 'BRO'}`);

  // Construct subfile content with line feeds
  const subfileData = 'DL' + entries.join('\n') + '\n';
  const subfileLength = subfileData.length.toString().padStart(4, '0');
  const subfileOffset = '0039'; // Length of header + subfile designator

  // AAMVA Header (39 bytes):
  // @ + \n + \x1e + \r + 'ANSI ' + IIN(6) + AAMVA_VER(2) + JUR_VER(2) + NUM_SUBFILES(2) + TYPE(2) + OFFSET(4) + LENGTH(4)
  const header = `@\n\x1e\rANSI ${iin}${aamvaVersion}${jurVersion}01DL${subfileOffset}${subfileLength}`;

  return header + subfileData;
}

/**
 * Checks if raw text is an AAMVA compliant string and parses into fields
 */
export function parseAAMVAText(raw: string): { isAamva: boolean; data?: Partial<DriverLicenseData>; rawFields: Record<string, string> } {
  const rawFields: Record<string, string> = {};
  if (!raw) return { isAamva: false, rawFields };

  const isAamva = raw.includes('ANSI ') || raw.startsWith('@\n') || raw.includes('DAQ') || raw.includes('DCS');
  if (!isAamva) return { isAamva: false, rawFields };

  // Common element identifiers in AAMVA
  const fieldMap: Record<string, string> = {
    DCS: 'Family Name',
    DAC: 'First Name',
    DAD: 'Middle Name',
    DAQ: 'Customer ID / DL#',
    DBA: 'Expiration Date',
    DBB: 'Date of Birth',
    DBD: 'Issue Date',
    DBC: 'Sex',
    DAY: 'Eye Color',
    DAZ: 'Hair Color',
    DAU: 'Height',
    DAG: 'Street Address',
    DAI: 'City',
    DAJ: 'State',
    DAK: 'Postal Code',
    DCA: 'Class',
    DCB: 'Restrictions',
    DCD: 'Endorsements',
    DCF: 'Document Discriminator',
    DCG: 'Country',
  };

  // Find all field matches with 3 uppercase letters followed by characters until newline or next tag
  const regex = /([A-Z]{3})([^\n\r]+)/g;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    const code = match[1];
    const value = match[2].trim();
    if (fieldMap[code] || code.startsWith('D')) {
      rawFields[code] = value;
    }
  }

  const parsed: Partial<DriverLicenseData> = {
    lastName: rawFields['DCS'] || '',
    firstName: rawFields['DAC'] || '',
    middleName: rawFields['DAD'] || '',
    licenseNumber: rawFields['DAQ'] || '',
    expiryDate: parseAAMVADate(rawFields['DBA'] || ''),
    dob: parseAAMVADate(rawFields['DBB'] || ''),
    issueDate: parseAAMVADate(rawFields['DBD'] || ''),
    sex: (rawFields['DBC'] === '1' ? '1' : rawFields['DBC'] === '2' ? '2' : '9') as '1' | '2' | '9',
    height: rawFields['DAU'] || '',
    eyeColor: rawFields['DAY'] || '',
    hairColor: rawFields['DAZ'] || '',
    street: rawFields['DAG'] || '',
    city: rawFields['DAI'] || '',
    state: rawFields['DAJ'] || '',
    postalCode: rawFields['DAK'] || '',
    licenseClass: rawFields['DCA'] || 'C',
    restrictions: rawFields['DCB'] || 'NONE',
    endorsements: rawFields['DCD'] || 'NONE',
    discriminator: rawFields['DCF'] || '',
  };

  return { isAamva: true, data: parsed, rawFields };
}
