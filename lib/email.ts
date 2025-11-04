import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface HealthFactorNotificationData {
  address: string
  healthFactor: string
  threshold: string
  totalCollateral: string
  totalDebt: string
}

/**
 * Send health factor alert email
 */
export async function sendHealthFactorAlert(
  data: HealthFactorNotificationData
): Promise<{ success: boolean; error?: string }> {
  const notificationEmail = process.env.NOTIFICATION_EMAIL

  if (!notificationEmail) {
    return { success: false, error: "NOTIFICATION_EMAIL is not set" }
  }

  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: "RESEND_API_KEY is not set" }
  }

  try {
    await resend.emails.send({
      from: "Aave Monitor <onboarding@resend.dev>", // Use your verified domain in production
      to: notificationEmail,
      subject: `🚨 Aave Health Factor Alert: ${data.healthFactor}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Health Factor Alert</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">⚠️ Health Factor Alert</h1>
            </div>

            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
              <p style="font-size: 16px; margin-bottom: 20px;">
                Your Aave health factor has dropped below the configured threshold.
              </p>

              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
                <h2 style="margin-top: 0; color: #f59e0b; font-size: 20px;">Current Status</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><strong>Health Factor:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; text-align: right; color: #dc2626; font-weight: bold;">${data.healthFactor}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><strong>Threshold:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">${data.threshold}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><strong>Total Collateral:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">$${data.totalCollateral}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong>Total Debt:</strong></td>
                    <td style="padding: 10px 0; text-align: right;">$${data.totalDebt}</td>
                  </tr>
                </table>
              </div>

              <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #dc2626;">
                <p style="margin: 0; font-weight: bold; color: #dc2626;">⚠️ Action Required</p>
                <p style="margin: 10px 0 0 0; font-size: 14px;">
                  To avoid liquidation, consider:
                </p>
                <ul style="margin: 10px 0 0 0; font-size: 14px;">
                  <li>Adding more collateral to your position</li>
                  <li>Repaying some of your debt</li>
                  <li>Monitoring your position closely</li>
                </ul>
              </div>

              <div style="text-align: center; margin-top: 20px;">
                <a href="https://app.aave.com/" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                  Manage Position on Aave
                </a>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
                <p style="margin: 0;"><strong>Monitored Address:</strong></p>
                <p style="margin: 5px 0 0 0; word-break: break-all; font-family: monospace;">${data.address}</p>
                <p style="margin: 15px 0 0 0; font-size: 11px; color: #999;">
                  This is an automated message from your Aave Monitor. Do not reply to this email.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to send email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Send test email to verify configuration
 */
export async function sendTestEmail(): Promise<{
  success: boolean
  error?: string
}> {
  const notificationEmail = process.env.NOTIFICATION_EMAIL

  if (!notificationEmail) {
    return { success: false, error: "NOTIFICATION_EMAIL is not set" }
  }

  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: "RESEND_API_KEY is not set" }
  }

  try {
    await resend.emails.send({
      from: "Aave Monitor <onboarding@resend.dev>",
      to: notificationEmail,
      subject: "✅ Aave Monitor - Test Email",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Test Email</title>
          </head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #667eea;">✅ Test Email Successful</h1>
            <p>Your Aave Monitor is configured correctly and can send email notifications.</p>
            <p>You will receive alerts when your health factor drops below the configured threshold.</p>
          </body>
        </html>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to send test email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
