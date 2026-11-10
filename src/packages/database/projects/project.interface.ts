export interface IProjectDemo {
  url: string;
  /** Shown on the button. Omit for a single demo; the UI then says "Live Demo". */
  label?: string;
}

export interface IProject {
  id: string;
  title: string;
  description: string;
  techStacks: string[];
  /** One entry per live surface; a project with several parts links each one. */
  demos?: IProjectDemo[];
  githubLink?: string;
  features: string[];
  screenshots: string[];
  coverImage: string;
}
