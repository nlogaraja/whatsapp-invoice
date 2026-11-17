import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function InvoiceContent({ params }: PageProps) {
  const { id } = await params;

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*, clients(*)')
    .eq('id', id)
    .single();

  if (error || !invoice) {
    notFound();
  }

  const business = invoice.business_details || {};
  const items = Array.isArray(invoice.items) ? invoice.items : [];
  const currency = invoice.currency || '₹';

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Receipt Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-100">
          <div>
            <div className="text-base font-bold text-slate-900">
              {business.name || 'QuickBill Merchant'}
            </div>
            {business.phone && (
              <div className="text-xs text-slate-400">{business.phone}</div>
            )}
          </div>
          <div className="text-right">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                invoice.status === 'Paid'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {invoice.status}
            </span>
            <div className="text-xs font-bold text-slate-800 mt-1">
              Invoice #{invoice.invoice_number}
            </div>
            <div className="text-[11px] text-slate-400">{invoice.issue_date}</div>
          </div>
        </div>

        {/* Client Details */}
        <div className="py-3 border-b border-slate-100 flex justify-between items-center text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">
              Billed To
            </span>
            <div className="font-semibold text-slate-800">
              {invoice.clients?.name || 'Valued Customer'}
            </div>
          </div>
          {invoice.clients?.phone && (
            <div className="text-right text-slate-500">{invoice.clients.phone}</div>
          )}
        </div>

        {/* Items Breakdown */}
        <div className="py-4 space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase grid grid-cols-12 pb-1 border-b border-slate-100">
            <span className="col-span-7">Description</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-3 text-right">Amount</span>
          </div>
          {items.map((item: any, idx: number) => (
            <div key={idx} className="text-xs grid grid-cols-12 py-1 items-center">
              <span className="col-span-7 font-medium text-slate-700 pr-1 truncate">
                {item.description || 'Line item'}
              </span>
              <span className="col-span-2 text-center text-slate-500">
                {item.quantity}
              </span>
              <span className="col-span-3 text-right font-semibold text-slate-800">
                {currency}
                {(Number(item.quantity || 0) * Number(item.rate || 0)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Calculations */}
        <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>
              {currency}
              {Number(invoice.subtotal).toFixed(2)}
            </span>
          </div>
          {Number(invoice.tax_percent) > 0 && (
            <div className="flex justify-between text-slate-500">
              <span>Tax ({invoice.tax_percent}%)</span>
              <span>
                +{currency}
                {((Number(invoice.subtotal) * Number(invoice.tax_percent)) / 100).toFixed(2)}
              </span>
            </div>
          )}
          {Number(invoice.discount_amount) > 0 && (
            <div className="flex justify-between text-rose-600">
              <span>Discount</span>
              <span>
                -{currency}
                {Number(invoice.discount_amount).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
            <span>Total Due</span>
            <span className="text-emerald-700 font-extrabold">
              {currency}
              {Number(invoice.grand_total).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-4 p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-100">
            <span className="font-semibold text-slate-700 block mb-0.5">Note:</span>
            {invoice.notes}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PublicInvoicePage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 font-sans antialiased">
      <Suspense
        fallback={
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center text-xs font-semibold text-slate-400">
            Loading invoice receipt...
          </div>
        }
      >
        <InvoiceContent params={params} />
      </Suspense>
    </div>
  );
}