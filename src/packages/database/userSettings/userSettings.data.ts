import { uniqueId } from "lodash";
import { IUserSettings } from "./userSettings.interface";

export const userSettings: IUserSettings[] = [
  {
    id: uniqueId(),
    title: "my_blog",
    link: "#",
    icon: "majesticons:article",
  },
  {
    id: uniqueId(),
    title: "my_resume",
    link: "#",
    icon: "tabler:file-cv-filled",
  },
];
