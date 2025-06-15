import { ITechStack, ITechStackCategory } from "./techStack.interface";
import { uniqueId } from "lodash";

export const backendStack: ITechStack[] = [
  {
    id: uniqueId(),
    name: "NodeJS",
    icon: "devicon:nodejs",
    experience: 2.5,
  },
  {
    id: uniqueId(),
    name: "ExpressJS",
    icon: "skill-icons:expressjs-dark",
    experience: 2.5,
  },
  {
    id: uniqueId(),
    name: "NestJS",
    icon: "skill-icons:nestjs-dark",
    experience: 0.5,
  },
  {
    id: uniqueId(),
    name: "Socket.io",
    icon: "devicon:socketio",
    experience: 2,
  },
];

export const frontEndStack: ITechStack[] = [
  {
    id: uniqueId(),
    name: "JavaScript",
    icon: "skill-icons:javascript",
    experience: 2.5,
  },
  {
    id: uniqueId(),
    name: "Typescript",
    icon: "logos:typescript-icon",
    experience: 2.5,
  },
  {
    id: uniqueId(),
    name: "React",
    icon: "skill-icons:react-dark",
    experience: 2.5,
  },
  {
    id: uniqueId(),
    name: "NextJS",
    icon: "skill-icons:nextjs-dark",
    experience: 2.5,
  },
  {
    id: uniqueId(),
    name: "NuxtJS",
    icon: "skill-icons:nuxtjs-dark",
    experience: 1,
  },
  {
    id: uniqueId(),
    name: "TailwindCSS",
    icon: "skill-icons:tailwindcss-dark",
    experience: 2.5,
  },
];

export const databaseStack: ITechStack[] = [
  {
    id: uniqueId(),
    name: "PostgresSQL",
    icon: "logos:postgresql",
    experience: 2.5,
  },
  {
    id: uniqueId(),
    name: "MongoDB",
    icon: "devicon:mongodb",
    experience: 1.5,
  },
  {
    id: uniqueId(),
    name: "MySQL",
    icon: "logos:mysql-icon",
    experience: 2.5,
  },
  {
    id: uniqueId(),
    name: "Redis",
    icon: "skill-icons:redis-dark",
    experience: 1,
  },
  {
    id: uniqueId(),
    name: "Prisma",
    icon: "logos:prisma",
    experience: 2.5,
  },
  {
    id: uniqueId(),
    name: "TypeORM",
    icon: "logos:typeorm",
    experience: 2.5,
  },
];

export const cloudDevOpsStack: ITechStack[] = [
  {
    id: uniqueId(),
    name: "AWS",
    icon: "logos:aws-cloudfront",
    experience: 1.5,
  },
  {
    id: uniqueId(),
    name: "Google Cloud Platform",
    icon: "material-icon-theme:gcp",
    experience: 0.5,
  },
  {
    id: uniqueId(),
    name: "Firebase",
    icon: "devicon:firebase",
    experience: 2,
  },
  {
    id: uniqueId(),
    name: "Docker",
    icon: "devicon:docker",
    experience: 1.5,
  },
  {
    id: uniqueId(),
    name: "Git",
    icon: "skill-icons:git",
    experience: 2.5,
  },
];

const aiIntegrationStack: ITechStack[] = [
  {
    id: uniqueId(),
    name: "OpenAI",
    icon: "logos:openai-icon",
    experience: 1.5,
  },
  {
    id: uniqueId(),
    name: "V0.dev",
    icon: "skill-icons:vercel-dark",
    experience: 1,
  },
  {
    id: uniqueId(),
    name: "Stripe",
    icon: "logos:stripe",
    experience: 2.5,
  },
  {
    id: uniqueId(),
    name: "Supabase",
    icon: "logos:supabase-icon",
    experience: 1.5,
  },
  {
    id: uniqueId(),
    name: "SendGrid",
    icon: "logos:sendgrid-icon",
    experience: 1.5,
  },
];

export const uiuxStack: ITechStack[] = [
  {
    id: uniqueId(),
    name: "Photoshop",
    icon: "skill-icons:photoshop",
    experience: 1,
  },
  {
    id: uniqueId(),
    name: "Figma",
    icon: "devicon:figma",
    experience: 1,
  },
  {
    id: uniqueId(),
    name: "Adobe Illustrator",
    icon: "skill-icons:illustrator",
    experience: 1,
  },
];
export const techStackCategories: ITechStackCategory[] = [
  {
    id: uniqueId(),
    name: "Backend",
    techStacks: backendStack,
  },
  {
    id: uniqueId(),
    name: "Frontend",
    techStacks: frontEndStack,
  },
  {
    id: uniqueId(),
    name: "Database",
    techStacks: databaseStack,
  },
  {
    id: uniqueId(),
    name: "Cloud & DevOps",
    techStacks: cloudDevOpsStack,
  },
  {
    id: uniqueId(),
    name: "AI & Integration",
    techStacks: aiIntegrationStack,
  },
  {
    id: uniqueId(),
    name: "UI/UX",
    techStacks: uiuxStack,
  },
];
