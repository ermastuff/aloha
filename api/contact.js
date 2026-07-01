import { Resend } from 'resend'

/**
 * Serverless endpoint for both website forms:
 *   • formType: 'booking'  → the "Book your experience" modal (Treatments)
 *   • formType: 'contact'  → the "Send us a message" form (Contact)
 *
 * It sends two emails per submission:
 *   1. A notification to the owner with every field.
 *   2. A branded confirmation to the person who filled the form (recap + thanks).
 *
 * Configuration (Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY  – required, your Resend API key
 *   OWNER_EMAIL     – where booking/contact notifications land
 *   FROM_EMAIL      – verified sender, e.g. "Aloha Massage <no-reply@yourdomain.com>"
 *                     (defaults to Resend's shared test sender)
 */

const resend = new Resend(process.env.RESEND_API_KEY)

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'n.bianchi1998@gmail.com'
const FROM_EMAIL  = process.env.FROM_EMAIL  || 'Aloha Massage <onboarding@resend.dev>'

const BRAND  = 'rgb(12,106,110)'
const CREAM  = '#EFE9DD'

// ─── HTML helpers ───────────────────────────────────────────────────────────
function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function detailsTable(rows) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:8px 0 0;">
    ${rows
      .filter(([, v]) => v != null && String(v).trim() !== '')
      .map(
        ([k, v]) => `<tr>
        <td style="padding:11px 0;border-bottom:1px solid #ece7dc;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:#8a9591;width:150px;vertical-align:top;">${escapeHtml(k)}</td>
        <td style="padding:11px 0;border-bottom:1px solid #ece7dc;font-size:15px;line-height:1.5;color:#1c2b2b;">${escapeHtml(v).replace(/\n/g, '<br>')}</td>
      </tr>`,
      )
      .join('')}
  </table>`
}

function layout(title, inner) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${CREAM};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:32px 12px;font-family:Helvetica,Arial,sans-serif;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(12,106,110,0.12);">
        <tr><td style="background:${BRAND};padding:28px 40px;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:27px;color:${CREAM};">Aloha Massage</div>
          <div style="font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(236,226,206,0.72);margin-top:5px;">Poolside Wellness</div>
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:22px;color:${BRAND};">${title}</h1>
          ${inner}
        </td></tr>
        <tr><td style="padding:20px 40px;background:#f4f0e8;font-size:12px;line-height:1.6;color:#7c8a86;">
          Aloha Massage &middot; Poolside Wellness<br>Gran Canaria &amp; Fuerteventura
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function paragraph(text) {
  return `<p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:#41504c;">${text}</p>`
}

// ─── Handler ────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email service is not configured.' })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}

  const formType = body.formType
  const nome     = (body.nome || '').trim()
  const cognome  = (body.cognome || '').trim()
  const email    = (body.email || '').trim()
  const phone    = (body.phone || '').trim()

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
  if (!nome || !cognome || !emailOk) {
    return res.status(400).json({ error: 'Please fill in your name and a valid email.' })
  }

  const fullName = `${nome} ${cognome}`
  let ownerSubject, ownerRows, customerSubject, customerHtml

  if (formType === 'booking') {
    const treatment = (body.treatment || '').trim()
    const date      = (body.date || '').trim()
    if (!treatment || !date) {
      return res.status(400).json({ error: 'Please choose a treatment and a date.' })
    }

    ownerSubject = `New booking request — ${fullName}`
    ownerRows = [
      ['First name', nome],
      ['Last name', cognome],
      ['Email', email],
      ['Phone', phone],
      ['Treatment', treatment],
      ['Preferred date', date],
    ]

    customerSubject = "Aloha Massage — We've received your booking request"
    customerHtml = layout(
      `Thank you, ${escapeHtml(nome)}!`,
      paragraph(
        "We've received your booking request and our team will get back to you shortly to confirm your poolside experience.",
      ) +
        paragraph('Here is a summary of your request:') +
        detailsTable([
          ['Treatment', treatment],
          ['Preferred date', date],
          ['Phone', phone],
        ]) +
        `<p style="margin:24px 0 0;font-size:15px;line-height:1.65;color:#41504c;">With warm regards,<br><strong style="color:${BRAND};">The Aloha Massage team</strong></p>`,
    )
  } else if (formType === 'contact') {
    const message = (body.message || '').trim()
    if (!message) {
      return res.status(400).json({ error: 'Please write a message.' })
    }

    ownerSubject = `New message from the website — ${fullName}`
    ownerRows = [
      ['First name', nome],
      ['Last name', cognome],
      ['Email', email],
      ['Phone', phone],
      ['Message', message],
    ]

    customerSubject = 'Aloha Massage — Thank you for reaching out'
    customerHtml = layout(
      `Thank you, ${escapeHtml(nome)}!`,
      paragraph(
        "We've received your message and will get back to you shortly to help plan your poolside experience.",
      ) +
        paragraph('Here is a copy of what you sent us:') +
        detailsTable([['Message', message]]) +
        `<p style="margin:24px 0 0;font-size:15px;line-height:1.65;color:#41504c;">With warm regards,<br><strong style="color:${BRAND};">The Aloha Massage team</strong></p>`,
    )
  } else {
    return res.status(400).json({ error: 'Invalid form type.' })
  }

  const ownerHtml = layout(
    formType === 'booking' ? 'New booking request' : 'New contact message',
    paragraph('A new submission just came in from the website:') + detailsTable(ownerRows),
  )

  try {
    // 1) Owner notification — this is the critical send.
    const owner = await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      replyTo: email,
      subject: ownerSubject,
      html: ownerHtml,
    })
    if (owner.error) {
      console.error('Owner email failed:', owner.error)
      return res.status(502).json({ error: 'Could not send your request. Please try again.' })
    }

    // 2) Customer confirmation — best effort (fails with the test sender until a
    //    domain is verified, so we never block the request on it).
    let confirmationSent = true
    try {
      const customer = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: customerSubject,
        html: customerHtml,
      })
      if (customer.error) {
        confirmationSent = false
        console.warn('Confirmation email failed:', customer.error)
      }
    } catch (err) {
      confirmationSent = false
      console.warn('Confirmation email threw:', err)
    }

    return res.status(200).json({ ok: true, confirmationSent })
  } catch (err) {
    console.error('Unexpected email error:', err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
