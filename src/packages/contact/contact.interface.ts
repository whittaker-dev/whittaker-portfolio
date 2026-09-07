export interface IContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot: always empty for a human, bots fill every input they find. */
  website?: string;
}

export type IContactFormErrors = Partial<Record<keyof IContactForm, string>>;

/**
 * Every `message` / error value is an i18n key rather than a sentence, so the API
 * route stays locale-agnostic and the client renders it with `t()`.
 */
export interface IContactResponse {
  success: boolean;
  message: string;
  errors?: IContactFormErrors;
}
