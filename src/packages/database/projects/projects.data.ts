import { IProject } from "./project.interface";

export const projects: IProject[] = [
  {
    title: "Tyler Tran Portfolio",
    description:
      "A modern, responsive portfolio website showcasing full-stack development skills with interactive animations and smooth user experience. Built with cutting-edge technologies and optimized for performance.",
    techStacks: [
      "NuxtJS",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "SCSS",
      "Vercel",
      "Husky",
      "Lint Staged",
      "ESLint",
      "Prettier",
    ],
    liveDemo: "https://imtylertran.vercel.app",
    githubLink: "https://github.com/TrySomeThign/tylertran-short-portfolio",
    features: [
      "📱 Responsive design with mobile-first approach",
      "🎞️ Smooth animations and transitions",
      "🌍 Internationalization (i18n) support",
      "🖱️ Interactive project showcases",
      "📬 Contact form with email integration",
      "🔍 SEO optimized",
      "⚡ Performance optimized with lazy loading",
    ],
    // TODO: Need update real images
    screenshots: [
      "/images/tyler-portfolio-home.png",
      "/images/tyler-portfolio-projects.png",
      "/images/tyler-portfolio-contact.png",
    ],
    // TODO: Need update real images
    coverImage: "/images/tyler-portfolio-cover.png",
  },
  {
    title: "Whittaker Portfolio",
    description:
      "An elegant and professional portfolio website featuring a clean design aesthetic and intuitive navigation. Showcases creative projects and professional experience with attention to detail.",
    techStacks: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Vercel",
      "Slack Integration",
      "Husky",
      "Lint Staged",
      "ESLint",
      "Prettier",
    ],
    liveDemo: "https://whittaker-portfolio.vercel.app/en",
    githubLink: "https://github.com/whittaker-dev/whittaker-portfolio",
    features: [
      "🧼 Clean and minimalist design",
      "🌐 Multi-language support",
      "📝 CMS integration for easy content management",
      "🌀 Smooth scrolling and page transitions",
      "🗂️ Project filtering and categorization",
      "🖼️ Responsive image galleries",
    ],

    // TODO: Need update real images
    screenshots: [
      "/images/whittaker-portfolio-home.png",
      "/images/whittaker-portfolio-about.png",
      "/images/whittaker-portfolio-projects.png",
    ],
    // TODO: Need update real images
    coverImage: "/images/whittaker-portfolio-cover.png",
  },
  {
    title: "Conian Guys Portfolio",
    description:
      "A modern and responsive personal portfolio built with React.js, showcasing projects, skills, and experience. Designed for easy navigation and optimized to highlight work for potential clients and recruiters.",
    techStacks: ["React", "Styled-Components", "SASS", "Vercel"],
    liveDemo: "https://conianguys.vercel.app/",
    githubLink: "https://github.com/whittaker-dev/Portfolio-Website",
    features: [
      "⚛️ Built with React.js for fast, responsive performance",
      "👋 Animated welcome section to introduce personality and style",
      "💼 Featured work/projects showcasing key accomplishments",
      "🛠️ Skills section displaying technical expertise",
      "✉️ Contact information for easy communication",
      "🎨 Smooth animations throughout for a modern, interactive feel",
    ],

    // TODO: Need update real images
    screenshots: [
      "/images/conian-guys-dashboard.png",
      "/images/conian-guys-messaging.png",
      "/images/conian-guys-profile.png",
      "/images/conian-guys-admin.png",
    ],
    // TODO: Need update real images
    coverImage: "/images/conian-guys-cover.png",
  },
  {
    title: "Next Auth Template",
    description:
      "A starter template for seamless authentication integration using Next.js, NextAuth.js, and TypeScript. This repo provides a clean, scalable foundation for building secure full-stack applications with built-in social and credential-based login support.",
    techStacks: [
      "Next",
      "Next-Auth",
      "TypeScript",
      "Redux",
      "Framer Motion",
      "Husky",
      "Lint Staged",
      "ESLint",
      "Prettier",
    ],
    githubLink: "https://github.com/whittaker-dev/next-auth-template",
    features: [
      "🔧 Next.js + TypeScript setup for modern, type-safe development",
      "🔐 NextAuth.js integration with credentials & social providers",
      "🗂️ Structured and clean folder organization for easy scaling",
      "⚙️ Built-in API route for secure authentication handling",
      "💻 Ready-to-use UI components (optional, if applicable)",
      "🛡️ Middleware for protected routes and error handling",
    ],
    // TODO: Need update real images
    screenshots: [
      "/images/conian-guys-dashboard.png",
      "/images/conian-guys-messaging.png",
      "/images/conian-guys-profile.png",
      "/images/conian-guys-admin.png",
    ],
    // TODO: Need update real images
    coverImage: "/images/conian-guys-cover.png",
  },
  {
    title: "Node Auth Template",
    description:
      "A lightweight and scalable authentication starter built with Node.js and TypeScript. Designed for secure API development, this template offers a solid foundation for building backend services with modern tooling.",
    techStacks: [
      "NodeJS",
      "TypeScript",
      "ExpressJS",
      "JWT",
      "MySQL",
      "TypeORM",
      "Husky",
      "Lint Staged",
      "ESLint",
      "Prettier",
    ],
    githubLink: "https://github.com/whittaker-dev/node-auth-template",
    features: [
      "⚙️ Express.js + TypeScript setup for type-safe backend development",
      "🔐 Authentication with JWT (or session-based, if applicable)",
      "🧱 Modular and clean project structure for scalability",
      "🛡️ Middleware for protected routes and error handling",
      "📦 Environment-based config and easy extension for database integration",
    ],
    // TODO: Need update real images
    screenshots: [
      "/images/conian-guys-dashboard.png",
      "/images/conian-guys-messaging.png",
      "/images/conian-guys-profile.png",
      "/images/conian-guys-admin.png",
    ],
    // TODO: Need update real images
    coverImage: "/images/conian-guys-cover.png",
  },
];
