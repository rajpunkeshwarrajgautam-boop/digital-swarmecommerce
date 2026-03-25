import { Resend } from 'resend';

// resend is the standard for transactional emails in modern Next.js apps
// use a getter to prevent build-time instantiation errors
let resendInstance: Resend | null = null;
const getResend = () => {
  if (!resendInstance) {
    const key = process.env.RESEND_API_KEY || 're_123';
    resendInstance = new Resend(key);
  }
  return resendInstance;
};

/**
 * Automate the "Buyer_Succes" sequence.
 * This sends a high-conversion welcome email with the download link
 * and an upsell for the Resell Rights.
 */
export async function sendWelcomeEmail(to: string, userName: string, productName: string, downloadLink: string) {
  const resend = getResend();
  try {
      from: 'Digital Swarm <orders@digitalswarm.in>',
      to: [to],
      subject: `[Payload_Uplink] Access granted for ${productName}`,
      html: `
        <div style="font-family: monospace; background-color: #050505; color: #ffffff; padding: 40px; border: 8px solid #000;">
          <h1 style="color: #CCFF00; font-style: italic; text-transform: uppercase;">UPLINK_ESTABLISHED</h1>
          <p style="font-size: 16px; border-left: 4px solid #CCFF00; padding-left: 20px;">
            Greetings, <strong>${userName}</strong>.<br/><br/>
            Your transaction for <strong>${productName}</strong> has been successfully verified. 
            The tactical data packets are ready for deployment.
          </p>
          
          <div style="background-color: #ffffff; color: #000; padding: 20px; border: 4px solid #000; margin-top: 30px; box-shadow: 8px 8px 0 #CCFF00;">
            <p style="font-weight: bold; margin-bottom: 5px;">DOWNLOAD_KEY_GEN_SYSTEM</p>
            <a href="${downloadLink}" style="display: block; background-color: #000; color: #CCFF00; text-decoration: none; padding: 15px; text-align: center; font-weight: bold; text-transform: uppercase;">
              DEPLOY_PAYLOAD ->
            </a>
          </div>

          <p style="margin-top: 40px; font-size: 12px; color: #666;">
            [SECURE_ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}]<br/>
            This is an automated system response. Do not reply.
          </p>
        </div>
      `,
    });

    if (error) {
       console.error('[resend] Email failed:', error);
       return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[resend] Unexpected error:', err);
    return { success: false, error: err };
  }
}
