import { techStackCategories } from "./techStack/techStack.data";
import {
  ITechStackCategory,
  ITechStack,
} from "./techStack/techStack.interface";
import { experiences } from "./experience/experience.data";
import { userSettings } from "./userSettings/userSettings.data";
import { projects } from "./projects/projects.data";

export type { IExperience } from "./experience/experience.interface";
export type { IUserSettings } from "./userSettings/userSettings.interface";
export type { ITechStack, ITechStackCategory };
export type { IProject } from "./projects/project.interface";

export { techStackCategories, experiences, userSettings, projects };
