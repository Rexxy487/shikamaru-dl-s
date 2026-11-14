import { ShippingLabelData, EventTicketData, VCardData } from '../types/barcode';

export function generateShippingText(data: ShippingLabelData): string {
  return [
    `[CARRIER:${data.carrier.toUpperCase()}]`,
    `TRACKING:${data.trackingNumber}`,
    `SERVICE:${data.serviceType}`,
    `WEIGHT:${data.weight} LBS`,
    `REF:${data.referenceNumber || 'N/A'}`,
    `SHIPPER:${data.shipperName} | ${data.shipperCompany}`,
    `FROM:${data.shipperStreet}, ${data.shipperCity}, ${data.shipperState} ${data.shipperZip}`,
    `RECIPIENT:${data.recipientName} | ${data.recipientCompany}`,
    `TO:${data.recipientStreet}, ${data.recipientCity}, ${data.recipientState} ${data.recipientZip}`,
  ].join('\n');
}

export function generateEventTicketText(data: EventTicketData): string {
  return [
    `TICKET-ID:${data.ticketId}`,
    `EVENT:${data.eventName}`,
    `VENUE:${data.venue}`,
    `DATE-TIME:${data.dateTime}`,
    `TIER:${data.ticketTier}`,
    `GATE:${data.gate} SEC:${data.section} ROW:${data.row} SEAT:${data.seat}`,
    `ATTENDEE:${data.attendeeName}`,
    `PRICE:$${data.price}`,
    `TOKEN:${data.securityHash}`,
  ].join('\n');
}

export function generateVCardText(data: VCardData): string {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${data.fullName}`,
    `ORG:${data.organization}`,
    `TITLE:${data.title}`,
    `TEL:${data.phone}`,
    `EMAIL:${data.email}`,
    `URL:${data.website}`,
    `ADR:;;${data.street};${data.city};${data.state};${data.postalCode};USA`,
    'END:VCARD',
  ].join('\n');
}
