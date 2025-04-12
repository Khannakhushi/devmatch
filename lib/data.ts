export interface Tech {
  id: string;
  name: string;
  icon: string;
  description: string;
  category:
    | "frontend"
    | "backend"
    | "database"
    | "language"
    | "cloud"
    | "mobile"
    | "devops"
    | "tools";
  pros?: string[];
  cons?: string[];
}

export const techStack: Tech[] = [
  {
    id: "react",
    name: "React",
    icon: "SiReact",
    description:
      "A JavaScript library for building user interfaces with a component-based architecture.",
    category: "frontend",
  },
  {
    id: "nextjs",
    name: "Next.js",
    icon: "SiNextdotjs",
    description:
      "The React framework for production with server-side rendering and static site generation.",
    category: "frontend",
  },
  {
    id: "vue",
    name: "Vue.js",
    icon: "SiVuedotjs",
    description:
      "Progressive JavaScript framework for building user interfaces with an incrementally adoptable architecture.",
    category: "frontend",
  },
  {
    id: "angular",
    name: "Angular",
    icon: "SiAngular",
    description:
      "Platform and framework for building single-page client applications using HTML and TypeScript.",
    category: "frontend",
  },
  {
    id: "svelte",
    name: "Svelte",
    icon: "SiSvelte",
    description:
      "Radical new approach to building user interfaces that compiles your code to tiny, framework-less JavaScript.",
    category: "frontend",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    icon: "SiTailwindcss",
    description:
      "A utility-first CSS framework for rapidly building custom user interfaces.",
    category: "frontend",
  },
  {
    id: "styledcomponents",
    name: "Styled Components",
    icon: "SiStyledcomponents",
    description:
      "Visual primitives for the component age, allowing you to use ES6 and CSS to style components.",
    category: "frontend",
  },
  {
    id: "redux",
    name: "Redux",
    icon: "SiRedux",
    description:
      "A predictable state container for JavaScript apps that helps manage application state.",
    category: "frontend",
  },
  {
    id: "reactquery",
    name: "React Query",
    icon: "SiReactquery",
    description:
      "Hooks for fetching, caching and updating asynchronous data in React.",
    category: "frontend",
  },
  {
    id: "nodejs",
    name: "Node.js",
    icon: "SiNodedotjs",
    description:
      "A JavaScript runtime built on Chrome's V8 JavaScript engine for building scalable network apps.",
    category: "backend",
  },
  {
    id: "express",
    name: "Express",
    icon: "SiExpress",
    description:
      "Fast, unopinionated, minimalist web framework for Node.js to build APIs and web applications.",
    category: "backend",
  },
  {
    id: "nestjs",
    name: "NestJS",
    icon: "SiNestjs",
    description:
      "Progressive Node.js framework for building server-side applications with elegant architecture.",
    category: "backend",
  },
  {
    id: "django",
    name: "Django",
    icon: "SiDjango",
    description:
      "High-level Python web framework that enables rapid development of secure and maintainable websites.",
    category: "backend",
  },
  {
    id: "flask",
    name: "Flask",
    icon: "SiFlask",
    description:
      "Micro web framework written in Python, designed to make getting started quick and easy.",
    category: "backend",
  },
  {
    id: "spring",
    name: "Spring Boot",
    icon: "SiSpringboot",
    description:
      "Java-based framework used to create microservice-ready production-grade applications.",
    category: "backend",
  },
  {
    id: "dotnet",
    name: ".NET",
    icon: "SiDotnet",
    description:
      "Free, cross-platform, open source framework for building modern cloud-based applications.",
    category: "backend",
  },
  {
    id: "graphql",
    name: "GraphQL",
    icon: "SiGraphql",
    description:
      "A query language for APIs and a runtime for executing those queries with your existing data.",
    category: "backend",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    icon: "SiMongodb",
    description:
      "A document-oriented NoSQL database used for high volume data storage.",
    category: "database",
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    icon: "SiPostgresql",
    description:
      "A powerful, open source object-relational database system with a strong reputation for reliability.",
    category: "database",
  },
  {
    id: "mysql",
    name: "MySQL",
    icon: "SiMysql",
    description:
      "Open-source relational database management system supporting SQL for querying and managing data.",
    category: "database",
  },
  {
    id: "redis",
    name: "Redis",
    icon: "SiRedis",
    description:
      "In-memory data structure store, used as a database, cache, and message broker.",
    category: "database",
  },
  {
    id: "prisma",
    name: "Prisma",
    icon: "SiPrisma",
    description:
      "Next-generation ORM for Node.js and TypeScript with type-safe database access.",
    category: "tools",
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: "SiTypescript",
    description:
      "A strongly typed programming language that builds on JavaScript with static type definitions.",
    category: "language",
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "SiJavascript",
    description:
      "High-level, interpreted programming language that conforms to the ECMAScript specification.",
    category: "language",
  },
  {
    id: "python",
    name: "Python",
    icon: "SiPython",
    description:
      "Interpreted, high-level, general-purpose programming language with design focused on code readability.",
    category: "language",
  },
  {
    id: "rust",
    name: "Rust",
    icon: "SiRust",
    description:
      "Systems programming language focused on safety, speed, and concurrency without a garbage collector.",
    category: "language",
  },
  {
    id: "go",
    name: "Go",
    icon: "SiGo",
    description:
      "Statically typed, compiled programming language designed for simplicity, efficiency, and reliability.",
    category: "language",
  },
  {
    id: "aws",
    name: "AWS",
    icon: "SiAmazonaws",
    description:
      "Amazon's cloud computing platform offering more than 200 fully featured services.",
    category: "cloud",
  },
  {
    id: "gcp",
    name: "Google Cloud",
    icon: "SiGooglecloud",
    description:
      "Suite of cloud computing services that run on the same infrastructure as Google's products.",
    category: "cloud",
  },
  {
    id: "azure",
    name: "Azure",
    icon: "SiMicrosoftazure",
    description:
      "Microsoft's cloud computing service for building, testing, deploying, and managing applications.",
    category: "cloud",
  },
  {
    id: "vercel",
    name: "Vercel",
    icon: "SiVercel",
    description:
      "Platform for frontend frameworks and static sites, built to integrate with your content, commerce, or database.",
    category: "cloud",
  },
  {
    id: "docker",
    name: "Docker",
    icon: "SiDocker",
    description:
      "Platform for developing, shipping, and running applications in containers.",
    category: "devops",
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    icon: "SiKubernetes",
    description:
      "Open-source system for automating deployment, scaling, and management of containerized applications.",
    category: "devops",
  },
  {
    id: "firebase",
    name: "Firebase",
    icon: "SiFirebase",
    description:
      "A platform developed by Google for creating mobile and web applications with backend as a service.",
    category: "backend",
  },
  {
    id: "supabase",
    name: "Supabase",
    icon: "SiSupabase",
    description:
      "An open source Firebase alternative with PostgreSQL, authentication, storage, and more.",
    category: "backend",
  },
  {
    id: "amplify",
    name: "AWS Amplify",
    icon: "SiAwsamplify",
    description:
      "Development platform for building secure and scalable mobile and web applications.",
    category: "backend",
  },
  {
    id: "appwrite",
    name: "Appwrite",
    icon: "SiAppwrite",
    description:
      "Open-source backend server that helps developers build apps quickly and securely.",
    category: "backend",
  },
  {
    id: "reactnative",
    name: "React Native",
    icon: "SiReact",
    description:
      "Framework for building native mobile apps using React and JavaScript.",
    category: "mobile",
  },
  {
    id: "flutter",
    name: "Flutter",
    icon: "SiFlutter",
    description:
      "Google's UI toolkit for building natively compiled applications from a single codebase.",
    category: "mobile",
  },
  {
    id: "swift",
    name: "Swift",
    icon: "SiSwift",
    description:
      "Powerful and intuitive programming language for iOS, macOS, watchOS, and tvOS.",
    category: "mobile",
  },
  {
    id: "kotlin",
    name: "Kotlin",
    icon: "SiKotlin",
    description:
      "Modern programming language that makes developers happier, designed for Android development.",
    category: "mobile",
  },
  {
    id: "jest",
    name: "Jest",
    icon: "SiJest",
    description:
      "Delightful JavaScript testing framework with a focus on simplicity.",
    category: "tools",
  },
  {
    id: "cypress",
    name: "Cypress",
    icon: "SiCypress",
    description:
      "End-to-end testing framework for web applications with an intuitive GUI.",
    category: "tools",
  },
  {
    id: "github",
    name: "GitHub",
    icon: "SiGithub",
    description:
      "Platform and cloud-based service for software development and version control using Git.",
    category: "tools",
  },
  {
    id: "gitlab",
    name: "GitLab",
    icon: "SiGitlab",
    description:
      "Web-based DevOps lifecycle tool that provides a Git-repository manager.",
    category: "tools",
  },
];

// Define the interface for recommended stacks
export interface RecommendedStack {
  name: string;
  description: string;
  techs: string[];
  color: string;
}

// Tech stack recommendations
export const recommendedStacks: Record<string, RecommendedStack> = {
  MERN: {
    name: "MERN Stack",
    description:
      "Popular JavaScript full-stack framework combining MongoDB, Express, React, and Node.js for building scalable web applications.",
    techs: ["react", "express", "mongodb", "nodejs"],
    color: "blue",
  },
  T3: {
    name: "T3 Stack",
    description:
      "A type-safe, modular application stack featuring Next.js, TypeScript, Tailwind CSS, and Prisma.",
    techs: ["nextjs", "typescript", "tailwind", "prisma"],
    color: "purple",
  },
  JAMstack: {
    name: "JAMstack",
    description:
      "Modern web architecture using JavaScript, APIs, and Markup for better performance and developer experience.",
    techs: ["react", "nextjs", "supabase", "typescript"],
    color: "pink",
  },
  serverless: {
    name: "Serverless Stack",
    description:
      "Cloud-native architecture focusing on managed services and serverless computing.",
    techs: ["nextjs", "firebase", "reactquery", "tailwind"],
    color: "orange",
  },
  modernFrontend: {
    name: "Modern Frontend",
    description:
      "Cutting-edge frontend development stack for building responsive, interactive web applications.",
    techs: ["react", "typescript", "tailwind", "reactquery"],
    color: "green",
  },
  vueStack: {
    name: "Vue Ecosystem",
    description:
      "Progressive JavaScript framework ecosystem combining Vue with modern backends for flexible web development.",
    techs: ["vue", "typescript", "mongodb", "express"],
    color: "green",
  },
  pythonWeb: {
    name: "Python Web Stack",
    description:
      "Robust Python-based stack for building web applications with excellent database integration.",
    techs: ["django", "python", "postgres", "redis"],
    color: "blue",
  },
  cloudNative: {
    name: "Cloud Native Stack",
    description:
      "Modern architecture designed for deployment in cloud environments with excellent scalability.",
    techs: ["docker", "kubernetes", "go", "aws"],
    color: "blue",
  },
  mobileFirst: {
    name: "Mobile-First Stack",
    description:
      "Cross-platform mobile development environment with cloud backend services.",
    techs: ["reactnative", "typescript", "firebase", "redux"],
    color: "orange",
  },
  enterpriseJava: {
    name: "Enterprise Java Stack",
    description:
      "Robust and battle-tested stack for building enterprise-grade applications.",
    techs: ["spring", "mysql", "aws", "docker"],
    color: "purple",
  },
};
