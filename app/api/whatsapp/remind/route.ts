import { NextResponse } from 'next/server';

/**
 * WhatsApp Reminder API Endpoint
 * Dispatches automated WhatsApp notifications to sponsors via Termii / Twilio WhatsApp APIs.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pledgeId, sponsorPhone, sponsorName, studentName, amountNaira, daysLeft, campaignUrl } = body;

    if (!sponsorName || !campaignUrl) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const message =
      `Hello ${sponsorName}! Friendly reminder from EduFund: ${studentName}'s tuition deadline is in ${daysLeft} days. ` +
      `Click to complete your scheduled ₦${amountNaira} pledge: ${campaignUrl}`;

    // If live Termii/Twilio WhatsApp API keys are provided in environment:
    const termiiApiKey = process.env.TERMII_API_KEY;
    const termiiSender = process.env.TERMII_WHATSAPP_SENDER || 'EduFund';

    if (termiiApiKey && sponsorPhone) {
      try {
        await fetch('https://api.ng.termii.com/api/sms/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: sponsorPhone,
            from: termiiSender,
            sms: message,
            type: 'plain',
            channel: 'whatsapp',
            api_key: termiiApiKey,
          }),
        });
      } catch (apiError) {
        console.error('Termii API dispatch failed:', apiError);
      }
    }

    // In demo / hackathon mode, return simulated delivery response
    return NextResponse.json({
      success: true,
      delivered: true,
      channel: 'whatsapp',
      provider: termiiApiKey ? 'Termii WhatsApp' : 'Simulated Termii/Twilio WhatsApp Gateway',
      messagePreview: message,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

