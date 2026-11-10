export interface ISocialLink {
  name: string;
  link: string;
  icon: string;
}

export interface IContactChannel {
  /** i18n-free label shown above the value, e.g. "Email". */
  name: string;
  icon: string;
  value: string;
  link: string | null;
}
