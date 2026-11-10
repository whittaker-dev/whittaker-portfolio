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

/**
 * Hex mirrors of the site tokens in globals.css (paper, ink, line, brand). Mail clients
 * do not read CSS variables or oklch(), so the values are restated here.
 */
const BRAND = {
  paper: "#f4f2ec",
  card: "#ffffff",
  ink: "#16182a",
  inkMuted: "#5d6070",
  line: "#e2e0da",
  night: "#0d0e13",
  nightMuted: "#a7a9b6",
  blue: "#0a21c0",
  blueOnDark: "#7b8cff",
} as const;

// Anton loads where the client allows web fonts (Apple Mail, iOS); Gmail and Outlook
// strip the <link>, so the stack falls back to a condensed system face, then any bold sans.
const DISPLAY =
  "Anton, 'Arial Narrow', 'Helvetica Neue Condensed', Impact, Arial, sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const SANS =
  "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** Up to two initials for the sender tile; falls back to a dot for an unusable name. */
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
    <td class="text-muted" style="padding:0 0 10px;width:84px;font-family:${MONO};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.inkMuted};vertical-align:top;line-height:20px;">${label}</td>
    <td class="text-main" style="padding:0 0 10px;font-family:${SANS};font-size:15px;font-weight:600;color:${BRAND.ink};vertical-align:top;word-break:break-word;line-height:20px;">${valueHtml}</td>
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
    <link href="https://fonts.googleapis.com/css2?family=Anton&family=Be+Vietnam+Pro:wght@400;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet" />
    <style>
      /* Progressive enhancement only: Outlook drops this block, and the inline styles
         below already render the light design correctly on their own. */
      @media (prefers-color-scheme: dark) {
        .canvas { background: #0d0e13 !important; }
        .card { background: #17181f !important; border-color: rgba(244, 242, 236, 0.1) !important; }
        .text-main { color: #f4f2ec !important; }
        .text-muted { color: #a7a9b6 !important; }
        .rule { background: rgba(244, 242, 236, 0.1) !important; }
        .quote { background: #0d0e13 !important; border-color: rgba(244, 242, 236, 0.1) !important; }
        .link { color: #7b8cff !important; }
      }
      @media only screen and (max-width: 620px) {
        .px { padding-left: 22px !important; padding-right: 22px !important; }
        .subject { font-size: 30px !important; }
      }
      a { color: ${BRAND.blue}; }
    </style>
  </head>
  <body class="canvas" style="margin:0;padding:0;background:${BRAND.paper};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${buildPreheader(message)}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="canvas" style="background:${BRAND.paper};">
      <tr>
        <td align="center" style="padding:32px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="card" style="width:600px;max-width:600px;background:${BRAND.card};border:1px solid ${BRAND.line};">

            <!-- ==== HEADER: the hero's night ground, wordmark and subject ==== -->
            <tr>
              <td class="px" style="background:${BRAND.night};padding:22px 32px 30px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family:${DISPLAY};font-size:20px;letter-spacing:0.02em;color:#f4f2ec;text-transform:uppercase;">
                      Whittaker<span style="color:${BRAND.blueOnDark};">.</span>
                    </td>
                    <td align="right" style="font-family:${MONO};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.nightMuted};">
                      New message
                    </td>
                  </tr>
                </table>
                <div style="height:1px;line-height:1px;font-size:0;background:rgba(244,242,236,0.12);margin:20px 0 22px;">&nbsp;</div>
                <h1 class="subject" style="margin:0;font-family:${DISPLAY};font-size:38px;line-height:1;font-weight:700;letter-spacing:0.005em;text-transform:uppercase;color:#f4f2ec;word-break:break-word;">
                  ${safeSubject}<span style="color:${BRAND.blueOnDark};">.</span>
                </h1>
              </td>
            </tr>

            <!-- ==== SENDER ==== -->
            <tr>
              <td class="px" style="padding:28px 32px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td width="60" style="vertical-align:top;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="44" height="44" align="center" valign="middle" style="width:44px;height:44px;background:${BRAND.blue};font-family:${DISPLAY};font-size:18px;color:#ffffff;text-align:center;letter-spacing:0.02em;">
                            ${escapeHtml(getInitials(name))}
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td style="vertical-align:top;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        ${metaRow("From", safeName)}
                        ${metaRow("Email", `<a class="link" href="mailto:${mailtoAddress}" style="color:${BRAND.blue};text-decoration:none;">${safeEmail}</a>`)}
                        ${metaRow("Received", `<span style="font-weight:400;">${escapeHtml(receivedLabel)}</span>`)}
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ==== MESSAGE ==== -->
            <tr>
              <td class="px" style="padding:20px 32px 0;">
                <p class="text-muted" style="margin:0 0 10px;font-family:${MONO};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.inkMuted};">Message</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="quote" style="background:${BRAND.paper};border:1px solid ${BRAND.line};">
                  <tr>
                    <td style="padding:20px 22px 6px;">
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
              <td class="px" style="padding:26px 32px 4px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="background:${BRAND.blue};">
                      <a href="${replyHref}" style="display:inline-block;padding:14px 24px;font-family:${SANS};font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                        Reply to ${firstName} &nbsp;&rarr;
                      </a>
                    </td>
                  </tr>
                </table>
                <p class="text-muted" style="margin:12px 0 0;font-family:${SANS};font-size:13px;line-height:1.6;color:${BRAND.inkMuted};">
                  Hitting reply in your mail client works too. This message already carries
                  their address in <span style="font-family:${MONO};">Reply-To</span>.
                </p>
              </td>
            </tr>

            <!-- ==== FOOTER ==== -->
            <tr>
              <td class="px" style="padding:24px 32px 28px;">
                <div class="rule" style="height:1px;line-height:1px;font-size:0;background:${BRAND.line};margin-bottom:16px;">&nbsp;</div>
                <p class="text-muted" style="margin:0;font-family:${MONO};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.inkMuted};">
                  Sent from the contact form on
                  <a class="link" href="https://whittaker-portfolio.vercel.app" style="color:${BRAND.blue};text-decoration:none;">whittaker-portfolio.vercel.app</a>
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
