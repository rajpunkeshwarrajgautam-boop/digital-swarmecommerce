"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function captureLead(email: string, data: { url?: string; source: string }): Promise<{ success: boolean; message?: string }> {
  // Mock capture lead for now or implement actual DB logging
  console.log("Captured lead:", email, data);
  return { success: true, message: "Lead captured successfully" };
}

export async function sendLicenseEmail(email: string, productName: string, licenseKey: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[EMAIL] Missing RESEND_API_KEY. Email delivery disabled.');
    return { success: false, error: 'Missing API Key' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Digital Swarm <noreply@digitalswarm.store>',
      to: [email],
      subject: `[PROVISIONING] Your License for ${productName}`,
      html: `
        <div style="font-family: 'Courier New', Courier, monospace; background-color: #0a0a0f; color: #ffffff; padding: 40px; border: 1px solid #FF6B35;">
          <h1 style="color: #FF6B35; font-style: italic; text-transform: uppercase;">Protocol Provisioning Success</h1>
          <p style="text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.4);">Asset: ${productName}</p>
          <div style="margin: 40px 0; padding: 20px; border: 1px dashed rgba(255,255,255,0.1); background-color: rgba(255,255,255,0.02);">
            <p style="font-size: 12px; color: rgba(255,255,255,0.2); text-transform: uppercase;">Authorized License Key:</p>
            <p style="font-size: 24px; color: #00F5FF; font-weight: bold; letter-spacing: 4px;">${licenseKey}</p>
          </div>
          <p style="font-size: 10px; color: rgba(255,255,255,0.1); text-transform: uppercase;">All transfers are cryptographically secured. Unauthorized distribution is prohibited.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Email delivery error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email service failure:', error);
    return { success: false, error };
  }
}
