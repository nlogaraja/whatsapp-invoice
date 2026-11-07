"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  User, 
  Phone, 
  Calendar, 
  Hash, 
  Plus, 
  Trash2, 
  Share2, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  Receipt, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Download,
  Percent,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Navigation / View state
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Business profile state
  const [businessName, setBusinessName] = useState('Swift Fix Plumbing & Electrical');
  const [businessPhone, setBusinessPhone] = useState('+1 (555) 349-2810');
  const [currency, setCurrency] = useState('$');

  // Document metadata
  const [docType, setDocType] = useState('Invoice'); // 'Invoice' | 'Quote'
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-084');

  const [issueDate, setIssueDate] = useState('2026-04-01');
  useEffect(()=> {
    setIssueDate(new Date().toISOString().split('T')[0]);
  },[]);
  const [status, setStatus] = useState('Pending'); // 'Draft' | 'Pending' | 'Paid'

  // Client Details
  const [clientName, setClientName] = useState('Michael Vance');
  const [clientPhone, setClientPhone] = useState('14155552671');
  const [notes, setNotes] = useState('Payment due within 7 days. Thank you for your business!');

  // Line Items
  const [items, setItems] = useState([
    { id: '1', description: 'Kitchen sink pipe leak repair & valve replacement', quantity: 1, rate: 120 },
    { id: '2', description: 'Heavy-duty brass shut-off valve parts', quantity: 2, rate: 35 },
    { id: '3', description: 'Service diagnostic call fee', quantity: 1, rate: 45 },
  ]);

  // Adjustments
  const [taxPercent, setTaxPercent] = useState(5);
  const [discountAmount, setDiscountAmount] = useState(15);

  // Math calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const q = Number(item.quantity) || 0;
      const r = Number(item.rate) || 0;
      return acc + q * r;
    }, 0);
  }, [items]);

  const taxAmount = useMemo(() => {
    const rate = Number(taxPercent) || 0;
    return (subtotal * rate) / 100;
  }, [subtotal, taxPercent]);

  const grandTotal = useMemo(() => {
    const disc = Number(discountAmount) || 0;
    return Math.max(0, subtotal + taxAmount - disc);
  }, [subtotal, taxAmount, discountAmount]);

  // Hosted link simulation
  const publicSlug = `pay-${invoiceNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const hostedInvoiceUrl = `https://fastbill.io/i/${publicSlug}`;

  // Item manipulations
  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  // WhatsApp formatted string generator
  const getWhatsAppMessageText = () => {
    const itemsList = items
      .filter(i => i.description.trim() !== '')
      .map(i => `• ${i.description} (x${i.quantity}) - ${currency}${(i.quantity * i.rate).toFixed(2)}`)
      .join('\n');

    return `Hello *${clientName || 'there'}*,\n\nHere is your *${docType} #${invoiceNumber}* from *${businessName}*:\n\n${itemsList ? `${itemsList}\n\n` : ''}💰 *Total Due:* *${currency}${grandTotal.toFixed(2)}*\n\n📄 *View, download PDF, or pay online:*\n${hostedInvoiceUrl}\n\n_${notes}_`;
  };

  // Construct wa.me URL
  const generateWhatsAppURL = () => {
    const cleanPhone = clientPhone.replace(/\D/g, '');
    const message = encodeURIComponent(getWhatsAppMessageText());
    if (cleanPhone) {
      return `https://wa.me/${cleanPhone}?text=${message}`;
    }
    return `https://wa.me/?text=${message}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(hostedInvoiceUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(getWhatsAppMessageText());
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans antialiased">
      {/* Top Mobile Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base leading-tight">QuickBill</h1>
              <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> WhatsApp Quotes & Invoices
              </p>
            </div>
          </div>

          {/* View Mode Toggle Button */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'editor'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'preview'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-xl mx-auto px-4 pt-4">
        {activeTab === 'editor' ? (
          <div className="space-y-4">
            {/* Quick Meta Controls Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Document Type Switch */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Type</label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
                    {['Invoice', 'Quote'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setDocType(t)}
                        className={`text-xs font-semibold py-1.5 rounded-lg transition-all ${
                          docType === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Badge Select */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-200 text-xs font-semibold rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Draft">Draft (Grey)</option>
                    <option value="Pending">Pending Payment</option>
                    <option value="Paid">Paid / Settled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                    <Hash className="w-3 h-3" /> Number
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full text-xs font-medium px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3" /> Date
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full text-xs font-medium px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full text-xs font-semibold px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="$">USD ($)</option>
                    <option value="€">EUR (€)</option>
                    <option value="£">GBP (£)</option>
                    <option value="₹">INR (₹)</option>
                    <option value="A$">AUD (A$)</option>
                    <option value="C$">CAD (C$)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sender & Receiver Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
              {/* Business Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Your Business
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Business / Trade Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full text-sm font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <input
                    type="text"
                    placeholder="Your Phone / Support"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    className="w-full text-sm font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Client Info */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-emerald-600" /> Client Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Client Name (e.g., John Doe)"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full text-sm font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="Client WhatsApp No. (e.g. 14155552671)"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full text-sm font-medium pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 pl-1">
                  Tip: Include the country code without '+' or dashes for instant direct chat redirection.
                </p>
              </div>
            </div>

            {/* Line Items Section */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Items & Services ({items.length})
                </h3>
                <span className="text-[11px] text-slate-400">Rate × Qty</span>
              </div>

              <div className="space-y-2.5">
                {items.map((item, index) => {
                  const lineTotal = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2 relative transition-all focus-within:border-emerald-300 focus-within:bg-white"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-[11px] font-bold text-slate-400 mt-2">{index + 1}.</span>
                        <input
                          type="text"
                          placeholder="Item or service description..."
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          className="flex-1 text-xs sm:text-sm font-semibold bg-transparent border-0 p-0 focus:outline-none text-slate-800 placeholder-slate-400"
                        />
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/60 items-center">
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block">QTY</label>
                          <input
                            type="number"
                            min="1"
                            step="any"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                            className="w-full text-xs font-bold px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block">RATE ({currency})</label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.rate}
                            onChange={(e) => handleUpdateItem(item.id, 'rate', e.target.value)}
                            className="w-full text-xs font-bold px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                          />
                        </div>
                        <div className="text-right">
                          <label className="text-[10px] text-slate-400 font-bold block">TOTAL</label>
                          <div className="text-xs font-bold text-slate-900 mt-1">
                            {currency}{lineTotal.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200/80 active:scale-[0.99] text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border border-dashed border-slate-300 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Item
              </button>
            </div>

            {/* Calculations & Adjustments */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{currency}{subtotal.toFixed(2)}</span>
                </div>

                {/* Tax Input */}
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Percent className="w-3.5 h-3.5" />
                    <span>Tax Rate (%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={taxPercent}
                      onChange={(e) => setTaxPercent(e.target.value)}
                      className="w-14 text-right text-xs font-bold px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                    <span className="w-16 text-right font-semibold text-slate-700">
                      +{currency}{taxAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Discount Input */}
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">Discount ({currency})</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(e.target.value)}
                      className="w-14 text-right text-xs font-bold px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                    <span className="w-16 text-right font-semibold text-rose-600">
                      -{currency}{(Number(discountAmount) || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Grand Total</div>
                    <div className="text-[10px] text-slate-400">All taxes & adjustments included</div>
                  </div>
                  <div className="text-xl font-extrabold text-emerald-700">
                    {currency}{grandTotal.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Payment notes / terms */}
              <div className="pt-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Notes / Terms</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 resize-none"
                  placeholder="Payment instructions, bank wire, or UPI details..."
                />
              </div>
            </div>
          </div>
        ) : (
          /* PREVIEW / RECEIPT VIEW */
          <div className="space-y-4">
            {/* The Printable / Sharable Receipt Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md relative overflow-hidden">
              {/* Receipt Top Ribbon */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <div className="text-base font-bold text-slate-900">{businessName}</div>
                  <div className="text-xs text-slate-400">{businessPhone}</div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    status === 'Paid' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : status === 'Pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {status}
                  </span>
                  <div className="text-xs font-bold text-slate-800 mt-1">{docType} #{invoiceNumber}</div>
                  <div className="text-[11px] text-slate-400">{issueDate}</div>
                </div>
              </div>

              {/* Client Billed Box */}
              <div className="py-3 border-b border-slate-100 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Billed To</span>
                  <div className="font-semibold text-slate-800">{clientName || 'Valued Customer'}</div>
                </div>
                {clientPhone && (
                  <div className="text-right text-slate-500">
                    {clientPhone}
                  </div>
                )}
              </div>

              {/* Items Breakdown Table */}
              <div className="py-4 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase grid grid-cols-12 pb-1 border-b border-slate-100">
                  <span className="col-span-7">Description</span>
                  <span className="col-span-2 text-center">Qty</span>
                  <span className="col-span-3 text-right">Amount</span>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="text-xs grid grid-cols-12 py-1 items-center">
                    <span className="col-span-7 font-medium text-slate-700 pr-1 truncate">
                      {item.description || 'Custom line item'}
                    </span>
                    <span className="col-span-2 text-center text-slate-500">
                      {item.quantity}
                    </span>
                    <span className="col-span-3 text-right font-semibold text-slate-800">
                      {currency}{((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary Calculations */}
              <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{currency}{subtotal.toFixed(2)}</span>
                </div>
                {taxAmount > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>Tax ({taxPercent}%)</span>
                    <span>+{currency}{taxAmount.toFixed(2)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount</span>
                    <span>-{currency}{(Number(discountAmount) || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Due</span>
                  <span className="text-emerald-700 font-extrabold">{currency}{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Notes footer */}
              {notes && (
                <div className="mt-4 p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-100">
                  <span className="font-semibold text-slate-700 block mb-0.5">Note:</span>
                  {notes}
                </div>
              )}

              {/* Hosted invoice public link tag */}
              <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate pr-2">Hosted link: {hostedInvoiceUrl}</span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="text-emerald-700 font-bold hover:underline shrink-0"
                >
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Formatted WhatsApp Message Preview */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" /> WhatsApp Pre-filled Text Preview
                </span>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="text-[11px] font-semibold text-emerald-800 bg-emerald-200/60 hover:bg-emerald-200 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all"
                >
                  {copiedMessage ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedMessage ? 'Copied' : 'Copy Text'}
                </button>
              </div>
              <pre className="text-[11px] text-emerald-950 font-mono whitespace-pre-wrap bg-white/80 p-3 rounded-xl border border-emerald-100 leading-relaxed max-h-48 overflow-y-auto">
                {getWhatsAppMessageText()}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Action Bar for Mobile 1-Tap Send */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <div className="flex-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-none">
              {docType} Total
            </div>
            <div className="text-lg font-black text-slate-900 leading-tight">
              {currency}{grandTotal.toFixed(2)}
            </div>
          </div>

          {/* Quick Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="p-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl transition-all border border-slate-200"
            title="Copy Hosted Link"
          >
            {copiedLink ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
          </button>

          {/* Primary 1-Tap WhatsApp Trigger */}
          <a
            href={generateWhatsAppURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Send on WhatsApp</span>
            <ArrowUpRight className="w-4 h-4 opacity-75" />
          </a>
        </div>
      </footer>
    </div>
  );
}