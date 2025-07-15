export interface IProject {
  id: string;
  title: string;
  description: string;
  techStacks: string[];
  liveDemo?: string;
  githubLink?: string;
  features: string[];
  screenshots: string[];
  coverImage: string;
}
