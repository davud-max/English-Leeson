import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getEmailConfigStatus, sendEmail } from '@/lib/email'

function unauthorizedResponse() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return unauthorizedResponse()
  }

  return NextResponse.json({
    success: true,
    email: getEmailConfigStatus(),
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return unauthorizedResponse()
  }

  try {
    const body = await req.json()
    const to = body?.to

    if (!to || typeof to !== 'string') {
      return NextResponse.json({ error: 'Field "to" is required' }, { status: 400 })
    }

    const status = getEmailConfigStatus()
    if (!status.configured) {
      return NextResponse.json(
        {
          error: 'Email is not configured',
          email: status,
        },
        { status: 400 }
      )
    }

    await sendEmail({
      to,
      subject: 'Test email from davudx.com',
      text: 'This is a test email to verify Resend configuration.',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
          <h2>Test email</h2>
          <p>This is a test email to verify Resend configuration.</p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${to}`,
    })
  } catch (error: any) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: 'Failed to send test email', details: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
