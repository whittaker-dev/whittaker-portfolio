export interface ISmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  /** Envelope sender. Must be a mailbox the SMTP account is allowed to send as. */
  from: string;
  /** Inbox that receives contact form submissions. */
  to: string;
}

export interface IContactEmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface IMailContent {
  subject: string;
  text: string;
  html: string;
}
