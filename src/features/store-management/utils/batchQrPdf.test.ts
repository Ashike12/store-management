import {describe, expect, it} from 'vitest';
import {
  QR_PER_PAGE,
  QR_SHEET,
  batchQrFileName,
  buildBatchQrPdf,
  getQrCell,
  getQrPageCount,
} from './batchQrPdf';

describe('batch QR sheet layout', () => {
  it('fits 8 rows of 5 QR codes, 40 per page', () => {
    expect(QR_PER_PAGE).toBe(40);
    expect(getQrPageCount(0)).toBe(1);
    expect(getQrPageCount(40)).toBe(1);
    expect(getQrPageCount(41)).toBe(2);
    expect(getQrPageCount(120)).toBe(3);
  });

  it('places codes row by row and starts a new page after 40', () => {
    const first = getQrCell(0);
    const fifth = getQrCell(4);
    const sixth = getQrCell(5);
    const last = getQrCell(39);
    const next = getQrCell(40);
    expect(first.page).toBe(0);
    expect(fifth.cellY).toBe(first.cellY); // same row
    expect(fifth.cellX).toBeGreaterThan(first.cellX);
    expect(sixth.cellX).toBe(first.cellX); // wraps to column 1
    expect(sixth.cellY).toBeGreaterThan(first.cellY);
    expect(last.page).toBe(0);
    expect(next.page).toBe(1);
    expect(next.cellX).toBe(first.cellX);
    expect(next.cellY).toBe(first.cellY);
  });

  it('keeps every QR (and its cell) inside the A4 page and the cell', () => {
    for (let i = 0; i < QR_PER_PAGE; i++) {
      const c = getQrCell(i);
      expect(c.cellX).toBeGreaterThanOrEqual(QR_SHEET.margin - 1e-9);
      expect(c.cellX + c.cellWidth).toBeLessThanOrEqual(
        QR_SHEET.pageWidth - QR_SHEET.margin + 1e-9,
      );
      expect(c.cellY + c.cellHeight).toBeLessThanOrEqual(
        QR_SHEET.pageHeight - QR_SHEET.margin + 1e-9,
      );
      expect(c.qrX).toBeGreaterThanOrEqual(c.cellX);
      expect(c.qrX + QR_SHEET.qrSize).toBeLessThanOrEqual(c.cellX + c.cellWidth);
      expect(c.qrY + QR_SHEET.qrSize).toBeLessThanOrEqual(c.cellY + c.cellHeight);
    }
  });

  it('builds a PDF with the right page count', async () => {
    const urls = Array.from(
      {length: 41},
      (_, i) => `https://shop.example.com/verify-product/token-${i}`,
    );
    const doc = await buildBatchQrPdf(urls);
    expect(doc.getNumberOfPages()).toBe(2);
  });

  it('makes a safe file name', () => {
    expect(batchQrFileName('BAT123/../x')).toBe('batch-BAT123x-qr-codes.pdf');
  });
});
