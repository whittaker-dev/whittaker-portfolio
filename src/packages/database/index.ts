import { techStackCategories } from "./techStack/techStack.data";
import {
  ITechStackCategory,
  ITechStack,
} from "./techStack/techStack.interface";
import { experiences } from "./experience/experience.data";
import { userSettings } from "./userSettings/userSettings.data";
import { projects } from "./projects/projects.data";
import {
  socialLinks,
  contactChannels,
  productionProjectCount,
  resumeUrl,
} from "./profile/profile.data";
import { designWorks, designArchiveUrl } from "./design/design.data";

export type { IExperience } from "./experience/experience.interface";
export type { IUserSettings } from "./userSettings/userSettings.interface";
export type { ITechStack, ITechStackCategory };
export type { IProject, IProjectDemo } from "./projects/project.interface";
export type { ISocialLink, IContactChannel } from "./profile/profile.interface";
export type { IDesignWork } from "./design/design.interface";

export {
  techStackCategories,
  experiences,
  userSettings,
  projects,
  socialLinks,
  contactChannels,
  productionProjectCount,
  resumeUrl,
  designWorks,
  designArchiveUrl,
};
