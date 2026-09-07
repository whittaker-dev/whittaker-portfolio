import { ISmtpConfig } from "./mail.interface";

const REQUIRED_VARS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "CONTACT_MAIL_FROM",
  "CONTACT_MAIL_TO",
] as const;

/**
 * Read lazily, per request, instead of at module scope: a missing variable must fail
 * the request that needs mail, not the build or every other route in the app.
 */
export const getSmtpConfig = (): ISmtpConfig => {
  const missing = REQUIRED_VARS.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing mail environment variables: ${missing.join(", ")}`);
  }

  const port = Number(process.env.SMTP_PORT);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`SMTP_PORT must be a positive integer, got "${process.env.SMTP_PORT}"`);
  }

  return {
    host: process.env.SMTP_HOST!,
    port,
    // Port 465 is implicit TLS; 587 and 25 start plaintext and upgrade via STARTTLS.
    // SMTP_SECURE exists for the rare provider that does not follow that convention.
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465,
    user: process.env.SMTP_USER!,
    password: process.env.SMTP_PASSWORD!,
    from: process.env.CONTACT_MAIL_FROM!,
    to: process.env.CONTACT_MAIL_TO!,
  };
};
