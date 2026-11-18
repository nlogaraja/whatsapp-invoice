"use client";
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Smartphone, CheckCircle2 } from 'lucide-react';

interface ReceiptActionsProps {
  upiId?: string;
  businessName: string;
  invoiceNumber: string;
  grandTotal: number;
  currency: string;
  status: string;
}

export default function ReceiptActions({
  upiId,
  businessName,
  invoiceNumber,
  grandTotal,
  currency,
  status,
}: ReceiptActionsProps) {
  const showUpi = Boolean(upiId && upiId.trim() !== '' && currency === '₹' && status !== 'Paid' && grandTotal > 0);

  // Standard NPCI UPI Deep Link format
  const upiLink = showUpi
    ? `upi://pay?pa=${encodeURIComponent(upiId!.trim())}&pn=${encodeURIComponent(
        businessName
      )}&am=${grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Invoice ${invoiceNumber}`)}`
    : '';

  return (
    <div className="space-y-4 mt-6">
      {/* UPI Payment Section (Visible only for unpaid INR invoices with a UPI ID) */}
      {showUpi && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            Scan & Pay via Any UPI App
          </div>

          <div className="bg-white p-3 rounded-2xl shadow-xs border border-slate-100">
            <QRCodeSVG value={upiLink} size={150} level="M" />
          </div>

          <div className="mt-2.5 text-xs font-bold text-slate-800">
            UPI ID: <span className="font-mono text-emerald-700">{upiId}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            GPay • PhonePe • Paytm • BHIM • Cred
          </p>

          {/* 1-Tap Mobile UPI App Trigger (Hidden on desktop print) */}
          <a
            href={upiLink}
            className="no-print mt-3 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Smartphone className="w-4 h-4" />
            <span>Pay {currency}{grandTotal.toFixed(2)} with UPI App</span>
          </a>
        </div>
      )}

      {status === 'Paid' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-center gap-2 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>This invoice has been paid in full. Thank you!</span>
        </div>
      )}

      {/* 1-Click Print / Save as PDF Button */}
      <div className="no-print pt-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download / Print PDF Invoice</span>
        </button>
      </div>
    </div>
  );
}