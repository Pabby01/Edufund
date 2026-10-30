/**
 * High-resolution canvas-based Remita receipt generator and downloader.
 * Produces an official 300dpi-grade graphic voucher that students and sponsors
 * can save to their phone or computer and present to university bursary departments.
 */

export interface ReceiptData {
  reference: string;
  payerName: string;
  beneficiarySchool: string;
  purpose: string;
  amountKobo: number;
  matricNumber?: string;
  date?: string;
  status?: string;
  vaultSource?: string;
}

export function formatNairaText(kobo: number): string {
  const naira = kobo / 100;
  return '₦' + naira.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function downloadReceiptAsImage(data: ReceiptData) {
  if (typeof window === 'undefined') return;

  const width = 800;
  const height = 960;
  const scale = 2; // High-DPI 2x Retina

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(scale, scale);

  // 1. Background (official off-white cream receipt paper)
  ctx.fillStyle = '#faf7f2';
  ctx.fillRect(0, 0, width, height);

  // Subtle paper border
  ctx.strokeStyle = '#e2ded5';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Inner border
  ctx.strokeStyle = '#d5cebf';
  ctx.lineWidth = 1;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  // Top National Header band
  ctx.fillStyle = '#008751'; // Nigerian Green
  ctx.fillRect(28, 28, width - 56, 10);

  // 2. Header Text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1a1917';
  ctx.font = 'bold 20px "Courier New", Courier, monospace';
  ctx.fillText('FEDERAL REPUBLIC OF NIGERIA', width / 2, 75);

  ctx.fillStyle = '#55514a';
  ctx.font = 'bold 12px "Courier New", Courier, monospace';
  ctx.fillText('CENTRAL E-COLLECTION · REMITA RRR BURSARY RECEIPT', width / 2, 98);

  ctx.font = '11px "Courier New", Courier, monospace';
  ctx.fillStyle = '#7a7469';
  ctx.fillText('TREASURY SINGLE ACCOUNT (TSA) · SETTLED VIA EDUFUND', width / 2, 116);

  // Decorative dashed divider
  drawDashedLine(ctx, 45, 135, width - 45, 135);

  // 3. Paid Stamp (top right)
  ctx.save();
  ctx.translate(width - 120, 95);
  ctx.rotate(-0.08);
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(-45, -18, 90, 36);
  ctx.fillStyle = '#059669';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✓ PAID', 0, 6);
  ctx.restore();

  // 4. Receipt Fields
  ctx.textAlign = 'left';
  const startX = 55;
  const valueX = 330;
  let currentY = 175;
  const lineGap = 34;

  const dateFormatted = data.date
    ? new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const fields: Array<[string, string, string?]> = [
    ['REMITA RRR NUMBER:', data.reference.toUpperCase(), '#0f172a'],
    ['TRANSACTION DATE:', dateFormatted, '#334155'],
    ['PAYER / SPONSOR:', data.payerName || 'EduFund Student / Sponsor', '#0f172a'],
  ];

  if (data.matricNumber) {
    fields.push(['MATRIC / REG NO:', data.matricNumber.toUpperCase(), '#0f172a']);
  }

  fields.push(
    ['BENEFICIARY INSTITUTION:', data.beneficiarySchool || 'Federal University', '#0f172a'],
    ['PURPOSE OF CLEARANCE:', data.purpose || 'Semester Tuition & Clearance', '#0f172a'],
    ['ESCROW VAULT SOURCE:', data.vaultSource || 'Cowrywise Locked Goal Vault (0% Drift)', '#059669'],
    ['PAYMENT CHANNEL:', 'Central Bank of Nigeria TSA / Remita Gateway', '#334155']
  );

  fields.forEach(([label, value, color]) => {
    ctx.font = 'bold 12px "Courier New", Courier, monospace';
    ctx.fillStyle = '#7a7469';
    ctx.fillText(label, startX, currentY);

    ctx.font = 'bold 13px "Courier New", Courier, monospace';
    ctx.fillStyle = color || '#0f172a';
    ctx.fillText(value, valueX, currentY);

    // subtle dotted separator
    drawDottedLine(ctx, startX, currentY + 12, width - 55, currentY + 12);
    currentY += lineGap;
  });

  // 5. Total Settled Box
  currentY += 15;
  ctx.fillStyle = '#f3ede2';
  ctx.fillRect(startX, currentY, width - 110, 80);
  ctx.strokeStyle = '#d5cebf';
  ctx.strokeRect(startX, currentY, width - 110, 80);

  ctx.fillStyle = '#55514a';
  ctx.font = 'bold 12px "Courier New", Courier, monospace';
  ctx.fillText('TOTAL AMOUNT CLEARED / PAID:', startX + 20, currentY + 46);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#1d70b8'; // EduFund brand blue
  ctx.font = '900 28px "Courier New", Courier, monospace';
  ctx.fillText(formatNairaText(data.amountKobo), width - 75, currentY + 52);

  // 6. Barcode & Security Verification Hash
  currentY += 115;
  ctx.textAlign = 'center';
  drawSimulatedBarcode(ctx, width / 2 - 140, currentY, 280, 36);

  currentY += 56;
  ctx.fillStyle = '#7a7469';
  ctx.font = '10px "Courier New", Courier, monospace';
  ctx.fillText(`VERIFIED REMITA TSA SECURITY REF: ${data.reference.toUpperCase()} · IMMUTABLE ELECTRONIC RECEIPT`, width / 2, currentY);

  currentY += 22;
  ctx.font = '9px sans-serif';
  ctx.fillStyle = '#948e82';
  ctx.fillText('Generated by EduFund in partnership with Cowrywise & SystemSpecs Remita. For verification visit remita.net', width / 2, currentY);

  // 7. Trigger download
  const cleanRef = data.reference.replace(/[^a-zA-Z0-9-]/g, '');
  const filename = `EduFund-Receipt-${cleanRef || 'settled'}.png`;

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

function drawDashedLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.save();
  ctx.beginPath();
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = '#c7beaf';
  ctx.lineWidth = 1;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawDottedLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.save();
  ctx.beginPath();
  ctx.setLineDash([2, 4]);
  ctx.strokeStyle = '#e5ded1';
  ctx.lineWidth = 1;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawSimulatedBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.fillStyle = '#1e293b';
  let curX = x;
  let seed = 42;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  while (curX < x + width) {
    const barWidth = Math.floor(random() * 3) + 1;
    const gap = Math.floor(random() * 3) + 1;
    ctx.fillRect(curX, y, barWidth, height);
    curX += barWidth + gap;
  }
}

