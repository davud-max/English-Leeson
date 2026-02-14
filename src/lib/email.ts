type SendEmailParams = {
  to: string
  subject: string
  html: string
  text?: string
}

const RESEND_API_URL = 'https://api.resend.com/emails'

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM

  if (!apiKey || !from) {
    return null
  }

  return { apiKey, from }
}

export async function sendEmail(params: SendEmailParams) {
  const config = getEmailConfig()
  if (!config) {
    console.warn('Email skipped: RESEND_API_KEY or EMAIL_FROM is not configured')
    return { ok: false, skipped: true as const }
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.from,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Resend API error ${response.status}: ${errorText}`)
  }

  return { ok: true as const }
}

export async function sendWelcomeEmail(to: string, name?: string | null) {
  const greeting = name ? `Hi ${name},` : 'Hi,'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://davudx.com'

  return sendEmail({
    to,
    subject: 'Welcome to Algorithms of Thinking and Cognition',
    text: `${greeting}\n\nYour account has been created successfully.\n\nSign in: ${appUrl}/login`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
        <h2>Welcome to Algorithms of Thinking and Cognition</h2>
        <p>${greeting}</p>
        <p>Your account has been created successfully.</p>
        <p><a href="${appUrl}/login">Sign in to your account</a></p>
      </div>
    `,
  })
}

export async function sendPurchaseSuccessEmail(params: {
  to: string
  courseTitle: string
  amountUsd?: number
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://davudx.com'
  const amountLine =
    typeof params.amountUsd === 'number' ? `Amount paid: $${params.amountUsd.toFixed(2)}` : 'Payment completed.'

  return sendEmail({
    to: params.to,
    subject: 'Payment successful - course access is now active',
    text: `Your payment for "${params.courseTitle}" is successful.\n${amountLine}\n\nOpen lessons: ${appUrl}/lessons`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
        <h2>Payment successful</h2>
        <p>Your payment for <strong>${params.courseTitle}</strong> is successful.</p>
        <p>${amountLine}</p>
        <p><a href="${appUrl}/lessons">Open your lessons</a></p>
      </div>
    `,
  })
}
