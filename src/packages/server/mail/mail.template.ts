import dayjs from "dayjs";

import { IContactEmailPayload, IMailContent } from "./mail.interface";

/**
 * The visitor controls every value below and it all lands in an HTML mail body, so
 * escape before interpolating. Mail clients render HTML without a CSP to fall back on.
 */
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const BRAND = {
  green: "#27ae60",
  greenDark: "#1a4d2e",
  ink: "#1f2b24",
  muted: "#6b7a72",
  hairline: "#e6eae8",
  canvas: "#f4f6f5",
} as const;

const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** Up to two initials for the avatar disc; falls back to a dot for an unusable name. */
const getInitials = (name: string): string => {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return initials ? initials.toUpperCase() : "•";
};

const toHtmlParagraphs = (message: string): string =>
  message
    .split(/\n{2,}/)
    .map(
      (block) =>
        `<p style="margin:0 0 14px;line-height:1.7;">${escapeHtml(block).replace(/\n/g, "<br />")}</p>`,
    )
    .join("");

/** Inbox preview line. Clients show it next to the subject, so lead with the message. */
const buildPreheader = (message: string): string =>
  escapeHtml(message.replace(/\s+/g, " ").slice(0, 120));

const metaRow = (label: string, valueHtml: string): string => `
  <tr>
    <td class="text-muted" style="padding:0 0 8px;width:76px;font-family:${MONO};font-size:11px;letter-spacing:0.04em;text-transform:uppercase;color:${BRAND.muted};vertical-align:top;">${label}</td>
    <td class="text-main" style="padding:0 0 8px;font-family:${SANS};font-size:14px;font-weight:600;color:${BRAND.ink};vertical-align:top;word-break:break-word;">${valueHtml}</td>
  </tr>`;

export const buildContactEmail = (
  payload: IContactEmailPayload,
  receivedAt: Date = new Date(),
): IMailContent => {
  const { name, email, subject, message } = payload;

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const firstName = escapeHtml(name.split(/\s+/)[0] || name);

  // Offset is spelled out because the host's local zone is not obvious from the mail.
  const stamp = dayjs(receivedAt);
  const receivedLabel = `${stamp.format("D MMM YYYY, HH:mm")} (UTC${stamp.format("Z")})`;

  const mailtoAddress = escapeHtml(encodeURI(email));
  const replySubject = escapeHtml(encodeURIComponent(`Re: ${subject}`));
  const replyHref = `mailto:${mailtoAddress}?subject=${replySubject}`;

  const text = [
    `NEW PORTFOLIO MESSAGE`,
    `${"=".repeat(46)}`,
    ``,
    `From:     ${name} <${email}>`,
    `Subject:  ${subject}`,
    `Received: ${receivedLabel}`,
    ``,
    `${"-".repeat(46)}`,
    ``,
    message,
    ``,
    `${"-".repeat(46)}`,
    `Reply straight to this email to reach ${name}.`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>${safeSubject}</title>
    <style>
      /* Progressive enhancement only: Outlook drops this block, and the inline styles
         below already render the light design correctly on their own. */
      @media (prefers-color-scheme: dark) {
        .canvas { background: #0d1210 !important; }
        .card { background: #151b18 !important; border-color: rgba(255, 255, 255, 0.08) !important; }
        .text-main { color: #eef2f0 !important; }
        .text-muted { color: #98a49e !important; }
        .divider { background: rgba(255, 255, 255, 0.09) !important; }
        .quote { background: rgba(255, 255, 255, 0.04) !important; }
        .avatar-ring { background: #1d2622 !important; }
      }
      @media only screen and (max-width: 620px) {
        .px { padding-left: 22px !important; padding-right: 22px !important; }
        .subject { font-size: 20px !important; }
      }
      a { color: ${BRAND.green}; }
    </style>
  </head>
  <body class="canvas" style="margin:0;padding:0;background:${BRAND.canvas};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${buildPreheader(message)}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="canvas" style="background:${BRAND.canvas};">
      <tr>
        <td align="center" style="padding:32px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="card" style="width:600px;max-width:600px;background:#ffffff;border:1px solid ${BRAND.hairline};border-radius:16px;overflow:hidden;">

            <!-- ==== HEADER ==== -->
            <tr>
              <td style="background:${BRAND.green};background-image:linear-gradient(135deg, ${BRAND.green} 0%, ${BRAND.greenDark} 100%);padding:26px 32px;">
                <p style="margin:0 0 10px;font-family:${MONO};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.82);">
                  &#9733;&nbsp; Portfolio &middot; New message
                </p>
                <h1 class="subject" style="margin:0;font-family:${SANS};font-size:23px;line-height:1.32;font-weight:800;color:#ffffff;word-break:break-word;">
                  ${safeSubject}
                </h1>
              </td>
            </tr>

            <!-- ==== SENDER ==== -->
            <tr>
              <td class="px" style="padding:28px 32px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td width="52" style="vertical-align:top;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td class="avatar-ring" width="44" height="44" align="center" valign="middle" style="width:44px;height:44px;background:${BRAND.greenDark};border-radius:50%;font-family:${SANS};font-size:16px;font-weight:800;color:#ffffff;text-align:center;">
                            ${escapeHtml(getInitials(name))}
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td style="vertical-align:top;padding-left:4px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        ${metaRow("From", safeName)}
                        ${metaRow("Email", `<a href="mailto:${mailtoAddress}" style="color:${BRAND.green};text-decoration:none;">${safeEmail}</a>`)}
                        ${metaRow("Received", `<span style="font-weight:400;">${escapeHtml(receivedLabel)}</span>`)}
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ==== DIVIDER ==== -->
            <tr>
              <td class="px" style="padding:22px 32px 0;">
                <div class="divider" style="height:1px;line-height:1px;font-size:0;background:${BRAND.hairline};">&nbsp;</div>
              </td>
            </tr>

            <!-- ==== MESSAGE ==== -->
            <tr>
              <td class="px" style="padding:22px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="quote" style="background:#f7faf8;border-radius:12px;">
                  <tr>
                    <td style="padding:18px 20px;border-left:3px solid ${BRAND.green};border-radius:12px;">
                      <div class="text-main" style="font-family:${SANS};font-size:15px;color:${BRAND.ink};word-break:break-word;">
                        ${toHtmlParagraphs(message)}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ==== REPLY CTA ==== -->
            <tr>
              <td class="px" style="padding:24px 32px 4px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="background:${BRAND.green};border-radius:10px;">
                      <a href="${replyHref}" style="display:inline-block;padding:13px 26px;font-family:${SANS};font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                        Reply to ${firstName} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
                <p class="text-muted" style="margin:12px 0 0;font-family:${SANS};font-size:12px;line-height:1.6;color:${BRAND.muted};">
                  Hitting reply in your mail client works too &mdash; this message already
                  carries their address in <span style="font-family:${MONO};">Reply-To</span>.
                </p>
              </td>
            </tr>

            <!-- ==== FOOTER ==== -->
            <tr>
              <td class="px" style="padding:22px 32px 28px;">
                <div class="divider" style="height:1px;line-height:1px;font-size:0;background:${BRAND.hairline};margin-bottom:16px;">&nbsp;</div>
                <p class="text-muted" style="margin:0;font-family:${MONO};font-size:11px;letter-spacing:0.04em;color:${BRAND.muted};">
                  Sent by the contact form on whittaker-portfolio.vercel.app
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    subject: `[Portfolio] ${subject}`,
    text,
    html,
  };
};
