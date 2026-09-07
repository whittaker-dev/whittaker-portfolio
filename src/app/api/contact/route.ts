import { NextRequest, NextResponse } from "next/server";

import { IContactForm, IContactResponse } from "@/packages/contact/contact.interface";
import {
  hasContactErrors,
  normalizeContactForm,
  validateContactForm,
} from "@/packages/contact/contact.validation";
import { sendContactEmail } from "@/packages/server/mail";
import { rateLimit } from "@/packages/server/rateLimit";

// nodemailer opens raw TCP sockets, which the edge runtime does not provide.
export const runtime = "nodejs";

const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/**
 * `x-forwarded-for` is a client-supplied header that only a trusted proxy makes
 * meaningful, and the leftmost entry is the one Vercel appends. Good enough to key a
 * best-effort throttle; not something to base anything security-critical on.
 */
const getClientIp = (request: NextRequest): string =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip") ||
  "unknown";

const json = (body: IContactResponse, status: number, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers });

export async function POST(request: NextRequest) {
  let payload: IContactForm;

  try {
    payload = (await request.json()) as IContactForm;
  } catch {
    return json({ success: false, message: "contact_error_invalid_request" }, 400);
  }

  const values = normalizeContactForm(payload);

  // A filled honeypot is a bot. Answer 200 so it has no signal to adapt to, and send nothing.
  if (values.website) {
    return json({ success: true, message: "contact_success" }, 200);
  }

  const errors = validateContactForm(values);

  if (hasContactErrors(errors)) {
    return json(
      { success: false, message: "contact_error_validation", errors },
      400,
    );
  }

  const { allowed, retryAfterSeconds } = rateLimit({
    key: getClientIp(request),
    limit: RATE_LIMIT,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });

  if (!allowed) {
    return json(
      { success: false, message: "contact_error_rate_limited" },
      429,
      { "Retry-After": String(retryAfterSeconds) },
    );
  }

  try {
    await sendContactEmail({
      name: values.name,
      email: values.email,
      subject: values.subject,
      message: values.message,
    });
  } catch (error) {
    // Keep the SMTP detail in the server log; a visitor must not learn our mail setup.
    console.error("[contact] failed to send email", error);
    return json({ success: false, message: "contact_error_send_failed" }, 500);
  }

  return json({ success: true, message: "contact_success" }, 200);
}
