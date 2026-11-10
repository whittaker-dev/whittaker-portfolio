import { IContactChannel, ISocialLink } from "./profile.interface";

const EMAIL = "minhtai250501@gmail.com";
const GITHUB_URL = "https://github.com/whittaker-dev";
const LINKEDIN_URL = "https://www.linkedin.com/in/minh-tai-a14134228";

export const socialLinks: ISocialLink[] = [
  { name: "GitHub", link: GITHUB_URL, icon: "ph:github-logo-bold" },
  { name: "LinkedIn", link: LINKEDIN_URL, icon: "ph:linkedin-logo-bold" },
  { name: "Email", link: `mailto:${EMAIL}`, icon: "ph:envelope-simple-bold" },
];

export const contactChannels: IContactChannel[] = [
  {
    name: "Email",
    icon: "ph:envelope-simple-bold",
    value: EMAIL,
    link: `mailto:${EMAIL}`,
  },
  {
    name: "GitHub",
    icon: "ph:github-logo-bold",
    value: "github.com/whittaker-dev",
    link: GITHUB_URL,
  },
  {
    name: "LinkedIn",
    icon: "ph:linkedin-logo-bold",
    value: "linkedin.com/in/minh-tai",
    link: LINKEDIN_URL,
  },
  {
    name: "Based in",
    icon: "ph:map-pin-bold",
    value: "Ho Chi Minh City, Vietnam",
    link: null,
  },
];

/** From the CV: production projects shipped at NUS Technology. Separate from the featured projects in projects.data.ts. */
export const productionProjectCount = 10;

/**
 * Served from public/. The source file had a stray byte before the PDF header, which
 * strict viewers reject, so the copy here is that file with the byte removed.
 */
export const resumeUrl = "/assets/cv/Tran-Minh-Tai-CV.pdf";
