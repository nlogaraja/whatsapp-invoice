import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase environment variables on server.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();

    const {
      shortSlug,
      clientName,
      clientPhone,
      invoiceNumber,
      issueDate,
      status,
      currency,
      items,
      subtotal,
      taxPercent,
      discountAmount,
      grandTotal,
      notes,
      businessName,
      businessPhone,
      businessUpiId,
    } = body;

    let clientId = null;

    // 1. Upsert/find client if phone is provided
    if (clientPhone && clientPhone.trim()) {
      const cleanClientPhone = clientPhone.trim();
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('phone', cleanClientPhone)
        .maybeSingle();

      if (existingClient) {
        clientId = existingClient.id;
        await supabase
          .from('clients')
          .update({ name: clientName || 'Customer' })
          .eq('id', clientId);
      } else {
        const { data: newClient } = await supabase
          .from('clients')
          .insert({ name: clientName || 'Customer', phone: cleanClientPhone })
          .select('id')
          .single();
        if (newClient) clientId = newClient.id;
      }
    }

    // 2. Insert invoice record
    const { error } = await supabase.from('invoices').insert({
      id: shortSlug,
      client_id: clientId,
      invoice_number: invoiceNumber,
      issue_date: issueDate,
      status: status,
      currency: currency,
      items: items,
      subtotal: subtotal,
      tax_percent: taxPercent,
      discount_amount: discountAmount,
      grand_total: grandTotal,
      notes: notes,
      business_details: {
        name: businessName,
        phone: businessPhone,
        upiId: businessUpiId,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: shortSlug });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Unexpected server error' },
      { status: 500 }
    );
  }
}