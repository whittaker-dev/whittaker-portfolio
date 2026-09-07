import { IContactForm, IContactFormErrors } from "./contact.interface";

/** Mirrored by the `maxLength` on each input so the UI cannot submit an over-long field. */
export const CONTACT_FIELD_LIMITS = {
  name: 80,
  email: 254, // RFC 5321 maximum path length
  subject: 120,
  message: 4000,
} as const;

export const CONTACT_MESSAGE_MIN_LENGTH = 20;

/**
 * Deliberately permissive: the only real authority on whether an address exists is
 * the receiving mail server, so this only catches typos before we spend a round trip.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeContactForm = (values: IContactForm): IContactForm => ({
  name: values.name?.trim() ?? "",
  email: values.email?.trim().toLowerCase() ?? "",
  subject: values.subject?.trim() ?? "",
  message: values.message?.trim() ?? "",
  website: values.website?.trim() ?? "",
});

/**
 * Runs on both sides of the wire: the form uses it for inline feedback, the API route
 * re-runs it because anything arriving over HTTP is untrusted.
 */
export const validateContactForm = (
  values: IContactForm,
): IContactFormErrors => {
  const errors: IContactFormErrors = {};

  if (!values.name) {
    errors.name = "contact_error_name_required";
  } else if (values.name.length > CONTACT_FIELD_LIMITS.name) {
    errors.name = "contact_error_name_too_long";
  }

  if (!values.email) {
    errors.email = "contact_error_email_required";
  } else if (
    values.email.length > CONTACT_FIELD_LIMITS.email ||
    !EMAIL_PATTERN.test(values.email)
  ) {
    errors.email = "contact_error_email_invalid";
  }

  if (!values.subject) {
    errors.subject = "contact_error_subject_required";
  } else if (values.subject.length > CONTACT_FIELD_LIMITS.subject) {
    errors.subject = "contact_error_subject_too_long";
  }

  if (!values.message) {
    errors.message = "contact_error_message_required";
  } else if (values.message.length < CONTACT_MESSAGE_MIN_LENGTH) {
    errors.message = "contact_error_message_too_short";
  } else if (values.message.length > CONTACT_FIELD_LIMITS.message) {
    errors.message = "contact_error_message_too_long";
  }

  return errors;
};

export const hasContactErrors = (errors: IContactFormErrors): boolean =>
  Object.keys(errors).length > 0;
