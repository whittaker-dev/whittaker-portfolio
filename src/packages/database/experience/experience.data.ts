import { IExperience } from "./experience.interface";

export const experiences: IExperience[] = [
  {
    id: 1,
    title: "Software Engineer",
    company: "NUS Technology",
    location: "Ho Chi Minh City, Vietnam",
    description:
      "Full-stack developer on 10+ production projects across e-commerce, education, CMS, food & beverage, sports and booking, working with Node.js/Express, MongoDB/PostgreSQL, React and React Native in teams of 3–6.",
    startDate: new Date("2023-07-02"),
    achievements: [
      "Built responsive web apps (React, Next.js, TailwindCSS) and cross-platform mobile apps (React Native) with reusable components, deep linking and platform-specific UI for iOS and Android.",
      "Cut API response time from 2s to 300ms with Redis caching, and moved email and notifications to BullMQ queues handling up to 10K emails a day.",
      "Integrated Stripe end to end, including webhooks and subscription billing, with idempotency and retry handling for reliable transactions.",
      "Built CI/CD pipelines in GitHub Actions for automated testing, code quality checks and deployment, and wrote Jest unit and integration tests for core APIs.",
      "Deployed and ran containerized services with Docker on Linux cloud infrastructure, configuring Nginx reverse proxy, SSL and secure webhooks for real-time payment and order events.",
      "Used AI development tools (Claude, Cursor, Codex, Windsurf) to speed up coding, debugging, refactoring, code review and solution design.",
    ],
    techSkills: [
      "Node.js",
      "Express",
      "TypeScript",
      "React",
      "Next.js",
      "React Native",
      "TailwindCSS",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "BullMQ",
      "Stripe",
      "Docker",
      "Nginx",
      "GitHub Actions",
      "Jest",
      "AWS",
    ],
    isCurrentJob: true,
    logo: "/assets/images/nus_logo.webp",
  },
];
