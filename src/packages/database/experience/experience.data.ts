import { IExperience } from "./experience.interface";

export const experiences: IExperience[] = [
  {
    id: 1,
    title: "Software Engineer",
    company: "NUS Technology",
    location: "Ho Chi Minh City, Vietnam",
    description:
      "Collaborated on delivering high-quality web and mobile applications, working closely with cross-functional teams to build solutions aligned with business and user needs. Focused on scalable, maintainable development and continuous improvement within agile workflows.",
    startDate: new Date("2023-07-02"),
    achievements: [
      "Built high-performance full-stack apps for multiple clients.",
      "Led development of cross-platform mobile apps.",
      "Implemented cost-efficient serverless backend systems.",
      "Improved frontend performance and SEO with modern frameworks.",
      "Streamlined CI/CD to speed up and stabilize deployments.",
      "Mentored junior devs and improved team code quality.",
    ],
    techSkills: [
      "NodeJS",
      "ExpressJS",
      "React",
      "Typescript",
      "NextJS",
      "TailwindCSS",
      "AWS",
      "Docker",
      "Prisma",
      "Firebase",
      "MongoDB",
    ],
    isCurrentJob: true,
    logo: "/assets/images/nus_logo.webp",
  },
];
