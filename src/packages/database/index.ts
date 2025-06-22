import { techStackCategories } from "./techStack/techStack.data";
import {
  ITechStackCategory,
  ITechStack,
} from "./techStack/techStack.interface";
import { experiences } from "./experience/experience.data";

export type { IExperience } from "./experience/experience.interface";
export type { ITechStack, ITechStackCategory };

export { techStackCategories, experiences };
