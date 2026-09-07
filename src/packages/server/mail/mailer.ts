import nodemailer, { type Transporter } from "nodemailer";

import { getSmtpConfig } from "./mail.config";
import { IContactEmailPayload } from "./mail.interface";
import { buildContactEmail } from "./mail.template";

/**
 * Cached so the pooled SMTP connection survives between requests on a warm instance -
 * re-authenticating on every submission is slow and trips provider rate limits.
 */
let cachedTransporter: Transporter | null = null;

const getTransporter = (): Transporter => {
  if (cachedTransporter) return cachedTransporter;

  const config = getSmtpConfig();

  cachedTransporter = nodemailer.createTransport({
    pool: true,
    maxConnections: 1,
    host: config.host,
    port: config.port,
    secure: config.secure,
    // Refuse to fall back to plaintext on the STARTTLS ports; without this an
    // attacker able to strip the upgrade would see the SMTP password.
    requireTLS: !config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });

  return cachedTransporter;
};

/**
 * Sends a contact form submission to the owner's inbox. Throws if the SMTP config is
 * incomplete or the server rejects the message; the caller decides what the visitor sees.
 */
export const sendContactEmail = async (
  payload: IContactEmailPayload,
): Promise<void> => {
  const config = getSmtpConfig();
  const { subject, text, html } = buildContactEmail(payload);

  await getTransporter().sendMail({
    // `from` stays our own authenticated mailbox. Putting the visitor's address here
    // fails the sender domain's SPF/DMARC checks and the mail gets dropped as spoofed,
    // so their address goes in Reply-To instead - hitting reply still works.
    from: config.from,
    to: config.to,
    replyTo: { name: payload.name, address: payload.email },
    subject,
    text,
    html,
  });
};
