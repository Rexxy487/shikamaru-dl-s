import { jsPDF } from 'jspdf';

export interface SinglePdfOptions {
  pageSize: '4x6' | '2x1' | 'letter' | 'a4';
  orientation: 'p' | 'l';
  title?: string;
  subtitle?: string;
  includeDate?: boolean;
}

export interface SheetPdfOptions {
  layout: 'avery5160' | 'avery5163' | 'grid2x4' | 'grid1x3';
  includeLabels?: boolean;
  includeBorder?: boolean;
}

export function exportSingleBarcodePdf(
  imgDataUrl: string,
  options: SinglePdfOptions,
  filename = 'pdf417-barcode.pdf'
): void {
  let doc: jsPDF;

  if (options.pageSize === '4x6') {
    doc = new jsPDF({
      orientation: options.orientation,
      unit: 'in',
      format: [4, 6],
    });
  } else if (options.pageSize === '2x1') {
    doc = new jsPDF({
      orientation: 'l',
      unit: 'in',
      format: [1, 2],
    });
  } else if (options.pageSize === 'letter') {
    doc = new jsPDF({
      orientation: options.orientation,
      unit: 'in',
      format: 'letter',
    });
  } else {
    doc = new jsPDF({
      orientation: options.orientation,
      unit: 'mm',
      format: 'a4',
    });
  }

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Draw Header if letter/a4 or 4x6
  let contentTop = 0.5;
  if (options.pageSize !== '2x1') {
    if (options.title) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(options.title, pageWidth / 2, contentTop, { align: 'center' });
      contentTop += 0.3;
    }
    if (options.subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(options.subtitle, pageWidth / 2, contentTop, { align: 'center' });
      contentTop += 0.3;
    }
    if (options.includeDate) {
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, contentTop, { align: 'center' });
      contentTop += 0.4;
    }
  }

  // Calculate image placement maintaining aspect ratio
  const imgProps = doc.getImageProperties(imgDataUrl);
  const imgAspect = imgProps.width / imgProps.height;

  const maxWidth = pageWidth * 0.85;
  const maxHeight = (pageHeight - contentTop) * 0.75;

  let renderWidth = maxWidth;
  let renderHeight = renderWidth / imgAspect;

  if (renderHeight > maxHeight) {
    renderHeight = maxHeight;
    renderWidth = renderHeight * imgAspect;
  }

  const x = (pageWidth - renderWidth) / 2;
  const y = contentTop + (pageHeight - contentTop - renderHeight) / 2;

  doc.addImage(imgDataUrl, 'PNG', x, y, renderWidth, renderHeight);

  // Footer for larger documents
  if (options.pageSize === 'letter' || options.pageSize === 'a4') {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(160);
    doc.text('Generated with PDF417 Studio — High Density 2D Barcode Engine', pageWidth / 2, pageHeight - 0.4, {
      align: 'center',
    });
  }

  doc.save(filename);
}

export function exportSheetPdf(
  items: Array<{ dataUrl: string; label: string }>,
  options: SheetPdfOptions,
  filename = 'pdf417-sheet.pdf'
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter', // 8.5 x 11
  });

  const pageWidth = 8.5;

  let cols = 2;
  let rows = 5;
  let labelWidth = 4.0;
  let labelHeight = 2.0;
  let marginLeft = 0.25;
  let marginTop = 0.5;

  if (options.layout === 'avery5160') {
    cols = 3;
    rows = 10;
    labelWidth = 2.625;
    labelHeight = 1.0;
    marginLeft = 0.1875;
    marginTop = 0.5;
  } else if (options.layout === 'grid2x4') {
    cols = 2;
    rows = 4;
    labelWidth = 3.8;
    labelHeight = 2.3;
    marginLeft = 0.45;
    marginTop = 0.6;
  } else if (options.layout === 'grid1x3') {
    cols = 1;
    rows = 3;
    labelWidth = 7.5;
    labelHeight = 3.0;
    marginLeft = 0.5;
    marginTop = 0.8;
  }

  const itemsPerPage = cols * rows;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemIndexOnPage = i % itemsPerPage;

    if (i > 0 && itemIndexOnPage === 0) {
      doc.addPage();
    }

    const col = itemIndexOnPage % cols;
    const row = Math.floor(itemIndexOnPage / cols);

    const x = marginLeft + col * labelWidth;
    const y = marginTop + row * labelHeight;

    // Optional border / cutline
    if (options.includeBorder) {
      doc.setDrawColor(210);
      doc.setLineDashPattern([0.05, 0.05], 0);
      doc.rect(x + 0.05, y + 0.05, labelWidth - 0.1, labelHeight - 0.1);
      doc.setLineDashPattern([], 0); // reset
    }

    // Label text
    let barcodeY = y + 0.15;
    let availableHeight = labelHeight - 0.25;

    if (options.includeLabels && item.label) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(50);
      const shortLabel = item.label.length > 30 ? item.label.substring(0, 28) + '...' : item.label;
      doc.text(shortLabel, x + labelWidth / 2, y + 0.25, { align: 'center' });
      barcodeY += 0.2;
      availableHeight -= 0.2;
    }

    // Draw barcode image inside label
    try {
      const imgProps = doc.getImageProperties(item.dataUrl);
      const aspect = imgProps.width / imgProps.height;
      const maxW = labelWidth - 0.3;
      let w = maxW;
      let h = w / aspect;
      if (h > availableHeight) {
        h = availableHeight;
        w = h * aspect;
      }
      const imgX = x + (labelWidth - w) / 2;
      const imgY = barcodeY + (availableHeight - h) / 2;
      doc.addImage(item.dataUrl, 'PNG', imgX, imgY, w, h);
    } catch (e) {
      console.warn('Failed to add image to sheet:', e);
    }
  }

  // Header / footer markings on first page
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.text(`PDF417 Studio — Printable Sheet (${items.length} items)`, marginLeft, 0.3);
  doc.text(`Page 1 of ${Math.ceil(items.length / itemsPerPage)}`, pageWidth - marginLeft, 0.3, { align: 'right' });

  doc.save(filename);
}
