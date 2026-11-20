// A4 sheet of QR stickers: 5 columns x 8 rows = 40 per page, no text.
export const QR_SHEET = {
  pageWidth: 210,
  pageHeight: 297,
  margin: 10,
  columns: 5,
  rows: 8,
  qrSize: 30, // mm, includes the quiet zone
  quietModules: 4,
} as const;

export const QR_PER_PAGE = QR_SHEET.columns * QR_SHEET.rows;

const cellWidth =
  (QR_SHEET.pageWidth - QR_SHEET.margin * 2) / QR_SHEET.columns;
const cellHeight =
  (QR_SHEET.pageHeight - QR_SHEET.margin * 2) / QR_SHEET.rows;

export const getQrPageCount = (count: number) =>
  Math.max(1, Math.ceil(count / QR_PER_PAGE));

/** Position (mm) of the Nth QR: row by row, left to right, 40 per page. */
export const getQrCell = (index: number) => {
  const page = Math.floor(index / QR_PER_PAGE);
  const slot = index % QR_PER_PAGE;
  const column = slot % QR_SHEET.columns;
  const row = Math.floor(slot / QR_SHEET.columns);
  const cellX = QR_SHEET.margin + column * cellWidth;
  const cellY = QR_SHEET.margin + row * cellHeight;
  return {
    page,
    cellX,
    cellY,
    cellWidth,
    cellHeight,
    qrX: cellX + (cellWidth - QR_SHEET.qrSize) / 2,
    qrY: cellY + (cellHeight - QR_SHEET.qrSize) / 2,
  };
};

export const batchQrFileName = (batchId: string) =>
  `batch-${batchId.replace(/[^A-Za-z0-9_-]/g, '')}-qr-codes.pdf`;

/** Builds the PDF in the browser; QR codes are drawn as vectors. */
export const buildBatchQrPdf = async (urls: string[]) => {
  const [{jsPDF}, QRCode] = await Promise.all([
    import('jspdf'),
    import('qrcode'),
  ]);
  const doc = new jsPDF({unit: 'mm', format: 'a4', orientation: 'portrait'});
  doc.setLineWidth(0.1);

  urls.forEach((url, index) => {
    const cell = getQrCell(index);
    if (index > 0 && index % QR_PER_PAGE === 0) doc.addPage();

    // Faint cutting guide around each sticker.
    doc.setDrawColor(210, 210, 210);
    doc.rect(cell.cellX, cell.cellY, cell.cellWidth, cell.cellHeight, 'S');

    const {modules} = QRCode.create(url, {errorCorrectionLevel: 'M'});
    const size = modules.size;
    const moduleSize =
      QR_SHEET.qrSize / (size + QR_SHEET.quietModules * 2);
    const origin = QR_SHEET.quietModules * moduleSize;
    doc.setFillColor(0, 0, 0);
    for (let y = 0; y < size; y++) {
      let x = 0;
      while (x < size) {
        if (!modules.get(x, y)) {
          x++;
          continue;
        }
        let end = x;
        while (end < size && modules.get(end, y)) end++;
        // Merge a horizontal run of dark modules into one rectangle.
        doc.rect(
          cell.qrX + origin + x * moduleSize,
          cell.qrY + origin + y * moduleSize,
          (end - x) * moduleSize,
          moduleSize,
          'F',
        );
        x = end;
      }
    }
  });
  return doc;
};
