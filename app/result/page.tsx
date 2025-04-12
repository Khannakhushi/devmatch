"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { techStack, recommendedStacks, Tech } from "@/lib/data";
import Link from "next/link";
import { motion } from "framer-motion";
import * as Si from "react-icons/si";
import {
  Share2Icon,
  ArrowLeftIcon,
  ArrowRightIcon,
  Trophy,
  BookOpenIcon,
  Puzzle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Helper function to find tech synergies and learning recommendations
interface Recommendation {
  type: "synergy" | "learning" | "upgrade";
  title: string;
  description: string;
  relatedTechs: string[];
}

function generatePersonalizedRecommendations(
  likedTech: string[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const likedTechs = techStack.filter((tech) => likedTech.includes(tech.id));
  const categories = [...new Set(likedTechs.map((tech) => tech.category))];

  // Check if the user has only backend technologies but no frontend
  if (categories.includes("backend") && !categories.includes("frontend")) {
    // Get the specific backend techs to recommend complementary frontend
    const hasNodejs = likedTech.includes("nodejs");
    const hasExpress = likedTech.includes("express");
    const hasPython =
      likedTech.includes("python") ||
      likedTech.includes("django") ||
      likedTech.includes("flask");
    const hasJava = likedTech.includes("spring");

    if (hasNodejs || hasExpress) {
      recommendations.push({
        type: "synergy",
        title: "Complete Your Node.js Stack with React",
        description:
          "React pairs perfectly with your Node.js backend to create a full JavaScript stack. Build dynamic UIs that connect seamlessly to your Express APIs.",
        relatedTechs: ["react", "nodejs"],
      });
    }

    if (hasPython) {
      recommendations.push({
        type: "synergy",
        title: "Add Vue.js to Your Python Backend",
        description:
          "Vue.js works great with Python backends like Django or Flask. Its gentle learning curve complements Python&apos;s readability for a cohesive development experience.",
        relatedTechs: ["vue", "python"],
      });
    }

    if (hasJava) {
      recommendations.push({
        type: "synergy",
        title: "Pair Angular with Your Spring Backend",
        description:
          "Angular&apos;s strongly-typed structure pairs well with Java Spring applications. Both follow similar architectural principles for enterprise-grade applications.",
        relatedTechs: ["angular", "spring"],
      });
    }

    // General frontend recommendation if no specific backend match
    if (recommendations.length === 0) {
      recommendations.push({
        type: "synergy",
        title: "Add a Frontend to Your Backend",
        description:
          "Complete your application by adding a modern frontend framework like React or Vue to create interactive user interfaces for your backend services.",
        relatedTechs: ["react", "vue"],
      });
    }
  }

  // Check if the user has only frontend technologies but no backend
  if (categories.includes("frontend") && !categories.includes("backend")) {
    // Get the specific frontend techs to recommend complementary backend
    const hasReact =
      likedTech.includes("react") || likedTech.includes("nextjs");
    const hasVue = likedTech.includes("vue");
    const hasAngular = likedTech.includes("angular");

    if (hasReact) {
      recommendations.push({
        type: "synergy",
        title: "Power Your React UI with Node.js",
        description:
          "Node.js and Express create the perfect backend for your React applications. Share JavaScript across your entire stack for seamless development.",
        relatedTechs: ["nodejs", "express"],
      });
    }

    if (hasVue) {
      recommendations.push({
        type: "synergy",
        title: "Connect Vue with Express or Flask",
        description:
          "Your Vue frontend pairs excellently with either Express (JavaScript) or Flask (Python) backends, offering flexibility in your backend language choice.",
        relatedTechs: ["express", "flask"],
      });
    }

    if (hasAngular) {
      recommendations.push({
        type: "synergy",
        title: "Complete Your Angular App with Spring",
        description:
          "Spring Boot provides a robust, enterprise-ready backend that complements Angular&apos;s structured approach to frontend development.",
        relatedTechs: ["spring", "nodejs"],
      });
    }

    // General backend recommendation if no specific frontend match
    if (recommendations.length === 0) {
      recommendations.push({
        type: "synergy",
        title: "Add a Backend to Your Frontend",
        description:
          "Complete your application by adding a backend like Node.js or Python to handle data processing, authentication, and business logic.",
        relatedTechs: ["nodejs", "python"],
      });
    }
  }

  // If they have database but no backend/frontend
  if (
    categories.includes("database") &&
    !categories.includes("backend") &&
    !categories.includes("frontend")
  ) {
    const hasMongoDB = likedTech.includes("mongodb");
    const hasSQL =
      likedTech.includes("postgres") || likedTech.includes("mysql");

    if (hasMongoDB) {
      recommendations.push({
        type: "synergy",
        title: "Build a MERN Stack Application",
        description:
          "Your MongoDB knowledge pairs perfectly with Express, React, and Node.js to create a full JavaScript stack application.",
        relatedTechs: ["express", "react", "nodejs"],
      });
    }

    if (hasSQL) {
      recommendations.push({
        type: "synergy",
        title: "Create Full-Stack Apps with Your SQL Database",
        description:
          "Build complete applications by adding Node.js or Django backends and React frontends to your SQL database knowledge.",
        relatedTechs: ["nodejs", "react", "django"],
      });
    }
  }

  // If they have cloud technologies but no DevOps
  if (categories.includes("cloud") && !categories.includes("devops")) {
    const hasAWS = likedTech.includes("aws");

    recommendations.push({
      type: "upgrade",
      title: "Enhance Your Cloud Skills with DevOps",
      description:
        "Take your cloud deployment to the next level by adding containerization with Docker and orchestration with Kubernetes.",
      relatedTechs: ["docker", "kubernetes"],
    });

    if (hasAWS) {
      recommendations.push({
        type: "synergy",
        title: "Master AWS Infrastructure as Code",
        description:
          "Elevate your AWS deployments with Terraform or AWS CDK to automate and version your infrastructure setup.",
        relatedTechs: ["aws", "docker"],
      });
    }
  }

  // If they have DevOps but no cloud platform
  if (categories.includes("devops") && !categories.includes("cloud")) {
    recommendations.push({
      type: "synergy",
      title: "Deploy Your Containers to the Cloud",
      description:
        "Put your Docker and Kubernetes knowledge to work by deploying to AWS, GCP, or Azure for scalable, managed infrastructure.",
      relatedTechs: ["aws", "gcp", "azure"],
    });
  }

  // If they have only programming languages but no framework
  if (
    categories.includes("language") &&
    !categories.includes("frontend") &&
    !categories.includes("backend")
  ) {
    const hasJS = likedTech.includes("javascript");
    const hasTS = likedTech.includes("typescript");
    const hasPython = likedTech.includes("python");

    if (hasJS || hasTS) {
      recommendations.push({
        type: "synergy",
        title: "Build Applications with JavaScript",
        description:
          "Apply your JavaScript/TypeScript knowledge by learning React for frontend and Node.js for backend development.",
        relatedTechs: ["react", "nodejs"],
      });
    }

    if (hasPython) {
      recommendations.push({
        type: "synergy",
        title: "Create Web Applications with Python",
        description:
          "Turn your Python skills into web applications by learning Django or Flask frameworks and connecting them to modern frontends.",
        relatedTechs: ["django", "flask"],
      });
    }
  }

  // If nothing has been added yet, check standard conditional recommendations
  if (recommendations.length === 0) {
    // Check for JavaScript without TypeScript
    if (likedTech.includes("javascript") && !likedTech.includes("typescript")) {
      recommendations.push({
        type: "upgrade",
        title: "Level Up with TypeScript",
        description:
          "You already know JavaScript. TypeScript adds static typing that can catch errors early and improve your code quality.",
        relatedTechs: ["typescript", "javascript"],
      });
    }

    // Check for React without React Query
    if (likedTech.includes("react") && !likedTech.includes("reactquery")) {
      recommendations.push({
        type: "synergy",
        title: "Enhance React with React Query",
        description:
          "React Query would pair perfectly with your React knowledge for more efficient data fetching and state management.",
        relatedTechs: ["react", "reactquery"],
      });
    }

    // Check for React without Tailwind
    if (
      likedTech.includes("react") &&
      !likedTech.includes("tailwind") &&
      !likedTech.includes("styledcomponents")
    ) {
      recommendations.push({
        type: "synergy",
        title: "Style Your React Apps",
        description:
          "Consider adding Tailwind CSS to your React projects for rapid UI development with a utility-first approach.",
        relatedTechs: ["react", "tailwind"],
      });
    }

    // Backend recommendations
    if (likedTech.includes("nodejs") && !likedTech.includes("express")) {
      recommendations.push({
        type: "synergy",
        title: "Add Express to your Node.js",
        description:
          "Express.js is a natural companion to Node.js for building robust APIs and web applications.",
        relatedTechs: ["nodejs", "express"],
      });
    }

    // Database recommendations
    if (
      (likedTech.includes("nodejs") || likedTech.includes("express")) &&
      !likedTech.includes("mongodb") &&
      !likedTech.includes("postgres")
    ) {
      recommendations.push({
        type: "learning",
        title: "Add a Database to Your Stack",
        description:
          "Your backend skills would be complemented by learning MongoDB for document storage or PostgreSQL for relational data.",
        relatedTechs: ["mongodb", "postgres"],
      });
    }

    // Frontend framework recommendations
    if (
      likedTech.includes("javascript") &&
      !likedTech.includes("react") &&
      !likedTech.includes("vue") &&
      !likedTech.includes("angular") &&
      !likedTech.includes("svelte")
    ) {
      recommendations.push({
        type: "learning",
        title: "Explore Frontend Frameworks",
        description:
          "With your JavaScript knowledge, learning React or Vue would be a great next step for building interactive UIs.",
        relatedTechs: ["react", "vue"],
      });
    }

    // Full-stack recommendations
    if (
      (likedTech.includes("react") ||
        likedTech.includes("vue") ||
        likedTech.includes("angular")) &&
      !likedTech.includes("nodejs") &&
      !likedTech.includes("express")
    ) {
      recommendations.push({
        type: "learning",
        title: "Complete Your Full-Stack Journey",
        description:
          "Add backend skills to your frontend knowledge by learning Node.js and Express to build complete applications.",
        relatedTechs: ["nodejs", "express"],
      });
    }

    // Cloud recommendations
    if (
      (likedTech.includes("nodejs") ||
        likedTech.includes("express") ||
        likedTech.includes("react") ||
        likedTech.includes("nextjs")) &&
      !likedTech.includes("aws") &&
      !likedTech.includes("vercel") &&
      !likedTech.includes("gcp") &&
      !likedTech.includes("azure")
    ) {
      recommendations.push({
        type: "upgrade",
        title: "Deploy to the Cloud",
        description:
          "Take your applications to production by learning a cloud platform like Vercel or AWS.",
        relatedTechs: ["vercel", "aws"],
      });
    }

    // DevOps recommendations
    if (
      likedTech.filter((id) => ["aws", "gcp", "azure"].includes(id)).length >
        0 &&
      !likedTech.includes("docker") &&
      !likedTech.includes("kubernetes")
    ) {
      recommendations.push({
        type: "upgrade",
        title: "Embrace DevOps",
        description:
          "Enhance your cloud skills with Docker for containerization to build more scalable applications.",
        relatedTechs: ["docker", "kubernetes"],
      });
    }

    // Testing recommendations
    if (
      (likedTech.includes("react") ||
        likedTech.includes("vue") ||
        likedTech.includes("angular")) &&
      !likedTech.includes("jest") &&
      !likedTech.includes("cypress")
    ) {
      recommendations.push({
        type: "learning",
        title: "Level Up with Testing",
        description:
          "Add testing to your workflow with Jest for unit tests and Cypress for end-to-end testing.",
        relatedTechs: ["jest", "cypress"],
      });
    }

    // Next.js recommendation
    if (likedTech.includes("react") && !likedTech.includes("nextjs")) {
      recommendations.push({
        type: "upgrade",
        title: "Elevate React with Next.js",
        description:
          "Take your React development to the next level with Next.js for server-side rendering and static site generation.",
        relatedTechs: ["react", "nextjs"],
      });
    }

    // Mobile recommendations
    if (
      (likedTech.includes("react") || likedTech.includes("javascript")) &&
      !likedTech.filter((id) =>
        ["reactnative", "flutter", "swift", "kotlin"].includes(id)
      ).length
    ) {
      recommendations.push({
        type: "learning",
        title: "Expand to Mobile Development",
        description:
          "Apply your web skills to mobile with React Native to build cross-platform mobile applications.",
        relatedTechs: ["reactnative", "javascript"],
      });
    }
  }

  // If we still don't have recommendations, add default ones based on the matched stack
  if (recommendations.length === 0) {
    const bestStack = findBestStack(likedTech);

    if (bestStack === "MERN") {
      recommendations.push(
        {
          type: "synergy",
          title: "Add TypeScript to Your MERN Stack",
          description:
            "Enhance your MERN stack with TypeScript for better type safety across your entire application.",
          relatedTechs: ["typescript", "react", "nodejs"],
        },
        {
          type: "learning",
          title: "Explore GraphQL",
          description:
            "Consider adding GraphQL to your stack for more efficient and flexible API queries.",
          relatedTechs: ["graphql", "apollo"],
        },
        {
          type: "upgrade",
          title: "Containerize Your Application",
          description:
            "Learn Docker to package your MERN application for consistent deployment across environments.",
          relatedTechs: ["docker", "kubernetes"],
        }
      );
    } else if (bestStack === "T3") {
      recommendations.push(
        {
          type: "synergy",
          title: "Add tRPC to Your T3 Stack",
          description:
            "tRPC creates end-to-end typesafe APIs with simple RPC-like syntax.",
          relatedTechs: ["typescript", "nextjs"],
        },
        {
          type: "learning",
          title: "State Management with Zustand",
          description:
            "Consider Zustand for simpler state management that plays well with TypeScript.",
          relatedTechs: ["typescript", "react"],
        },
        {
          type: "upgrade",
          title: "Deploy to Vercel",
          description:
            "Vercel offers seamless deployment for Next.js applications with excellent performance.",
          relatedTechs: ["nextjs", "vercel"],
        }
      );
    } else if (bestStack === "JAMstack") {
      recommendations.push(
        {
          type: "synergy",
          title: "Add a Headless CMS",
          description:
            "Consider integrating a headless CMS like Sanity or Contentful to manage your content.",
          relatedTechs: ["nextjs", "react"],
        },
        {
          type: "learning",
          title: "Explore Static Site Generation",
          description:
            "Leverage Next.js SSG features for even better performance in your JAMstack sites.",
          relatedTechs: ["nextjs", "react"],
        },
        {
          type: "upgrade",
          title: "Set Up a CDN",
          description:
            "Use a CDN service like Cloudflare to enhance the delivery of your JAMstack application.",
          relatedTechs: ["nextjs", "vercel"],
        }
      );
    } else if (bestStack === "serverless") {
      recommendations.push(
        {
          type: "synergy",
          title: "Explore AWS Lambda Functions",
          description:
            "AWS Lambda integrates well with your serverless architecture for scalable backend operations.",
          relatedTechs: ["aws", "nodejs"],
        },
        {
          type: "learning",
          title: "Add Serverless Database",
          description:
            "Consider DynamoDB or Firestore for database solutions that align with serverless architecture.",
          relatedTechs: ["aws", "firebase"],
        },
        {
          type: "upgrade",
          title: "Implement Authentication",
          description:
            "Add Auth0 or AWS Cognito for secure authentication in your serverless applications.",
          relatedTechs: ["aws", "firebase"],
        }
      );
    } else if (bestStack === "modernFrontend") {
      recommendations.push(
        {
          type: "synergy",
          title: "Add Animation Libraries",
          description:
            "Enhance user experience with Framer Motion or GSAP for smooth animations.",
          relatedTechs: ["react", "tailwind"],
        },
        {
          type: "learning",
          title: "Implement Component Testing",
          description:
            "Learn Storybook to develop UI components in isolation and improve documentation.",
          relatedTechs: ["react", "jest"],
        },
        {
          type: "upgrade",
          title: "Progressive Web App Features",
          description:
            "Transform your frontend into a PWA for better offline capabilities and mobile experience.",
          relatedTechs: ["react", "nextjs"],
        }
      );
    } else if (bestStack === "vueStack") {
      recommendations.push(
        {
          type: "synergy",
          title: "Add Pinia for State Management",
          description:
            "Pinia offers intuitive state management designed specifically for Vue applications.",
          relatedTechs: ["vue", "typescript"],
        },
        {
          type: "learning",
          title: "Explore Nuxt.js",
          description:
            "Consider Nuxt.js to add server-side rendering capabilities to your Vue applications.",
          relatedTechs: ["vue", "typescript"],
        },
        {
          type: "upgrade",
          title: "Component Testing with Cypress",
          description:
            "Implement Cypress for reliable end-to-end testing of your Vue components and applications.",
          relatedTechs: ["vue", "cypress"],
        }
      );
    } else if (bestStack === "pythonWeb") {
      recommendations.push(
        {
          type: "synergy",
          title: "Add Celery for Task Processing",
          description:
            "Celery provides async task processing for Python web applications handling complex operations.",
          relatedTechs: ["python", "django"],
        },
        {
          type: "learning",
          title: "Explore FastAPI",
          description:
            "Consider FastAPI for high-performance APIs with automatic OpenAPI documentation.",
          relatedTechs: ["python", "django"],
        },
        {
          type: "upgrade",
          title: "Docker Containerization",
          description:
            "Containerize your Python web applications for consistent deployment across environments.",
          relatedTechs: ["python", "docker"],
        }
      );
    } else if (bestStack === "cloudNative") {
      recommendations.push(
        {
          type: "synergy",
          title: "Implement Service Mesh",
          description:
            "Add Istio or Linkerd to manage service-to-service communication in your cloud-native applications.",
          relatedTechs: ["kubernetes", "docker"],
        },
        {
          type: "learning",
          title: "Explore Serverless Containers",
          description:
            "Consider AWS Fargate or Google Cloud Run for serverless container execution.",
          relatedTechs: ["docker", "aws"],
        },
        {
          type: "upgrade",
          title: "Infrastructure as Code",
          description:
            "Implement Terraform or AWS CDK to manage your cloud infrastructure with code.",
          relatedTechs: ["aws", "kubernetes"],
        }
      );
    } else if (bestStack === "mobileFirst") {
      recommendations.push(
        {
          type: "synergy",
          title: "Add State Management",
          description:
            "Enhance your mobile apps with Redux or MobX for robust state management.",
          relatedTechs: ["reactnative", "flutter"],
        },
        {
          type: "learning",
          title: "Explore Native Modules",
          description:
            "Learn how to integrate native code modules for accessing device features not available in JavaScript.",
          relatedTechs: ["reactnative", "swift"],
        },
        {
          type: "upgrade",
          title: "Implement Offline Capabilities",
          description:
            "Add local storage and synchronization to make your mobile apps work offline.",
          relatedTechs: ["reactnative", "flutter"],
        }
      );
    } else {
      // Generic recommendations if no specific stack matches
      recommendations.push(
        {
          type: "learning",
          title: "Explore Modern Web Technologies",
          description:
            "Consider learning React or Vue to build interactive user interfaces for your applications.",
          relatedTechs: ["react", "vue"],
        },
        {
          type: "synergy",
          title: "Add TypeScript to Your Projects",
          description:
            "TypeScript adds static typing to JavaScript, helping catch errors early in development.",
          relatedTechs: ["typescript", "javascript"],
        },
        {
          type: "upgrade",
          title: "Learn Cloud Deployment",
          description:
            "Explore cloud platforms like AWS or Vercel to deploy your applications with scalability in mind.",
          relatedTechs: ["aws", "vercel"],
        }
      );
    }
  }

  // Limit to 3 recommendations
  return recommendations.slice(0, 3);
}

function findBestStack(likedTech: string[]) {
  const stacks = Object.entries(recommendedStacks);
  return stacks.reduce(
    (best, [stackId, stack]) => {
      const matchCount = stack.techs.filter((tech) =>
        likedTech.includes(tech)
      ).length;
      if (matchCount > best.count) {
        return { id: stackId, count: matchCount };
      }
      return best;
    },
    { id: "MERN", count: 0 }
  ).id;
}

function groupTechsByCategory(techs: Tech[]) {
  const categories: Record<string, Tech[]> = {};

  techs.forEach((tech) => {
    if (!categories[tech.category]) {
      categories[tech.category] = [];
    }
    categories[tech.category].push(tech);
  });

  return categories;
}

export default function ResultPage() {
  const [recommendedStack, setRecommendedStack] =
    React.useState<string>("MERN");
  const [likedTech, setLikedTech] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState<string>("overview");
  const [personalizedRecommendations, setPersonalizedRecommendations] =
    React.useState<Recommendation[]>([]);

  React.useEffect(() => {
    const storedLikedTech = JSON.parse(
      localStorage.getItem("likedTech") || "[]"
    );
    setLikedTech(storedLikedTech);
    const bestStack = findBestStack(storedLikedTech);
    setRecommendedStack(bestStack);
    setPersonalizedRecommendations(
      generatePersonalizedRecommendations(storedLikedTech)
    );
  }, []);

  const stack =
    recommendedStacks[recommendedStack as keyof typeof recommendedStacks];
  const stackTechs = stack.techs.map(
    (techId) => techStack.find((t) => t.id === techId)!
  );

  // Get all liked technologies
  const likedTechnologies = techStack.filter((tech) =>
    likedTech.includes(tech.id)
  );

  // Group liked technologies by category
  const techsByCategory = groupTechsByCategory(likedTechnologies);

  // Get top categories
  const categories = Object.keys(techsByCategory).sort(
    (a, b) => techsByCategory[b].length - techsByCategory[a].length
  );

  // Function to get color for background gradient based on stack color
  const getGradientColors = (color: string) => {
    const colors: Record<string, string[]> = {
      blue: ["from-blue-500/20", "to-blue-700/20"],
      purple: ["from-purple-500/20", "to-purple-700/20"],
      pink: ["from-pink-500/20", "to-pink-700/20"],
      orange: ["from-orange-500/20", "to-orange-700/20"],
      green: ["from-green-500/20", "to-green-700/20"],
    };
    return colors[color] || ["from-gray-500/20", "to-gray-700/20"];
  };

  const [fromColor, toColor] = getGradientColors(stack.color);

  const handleShare = async () => {
    const text = `I matched with the ${stack.name} on DevMatch! Check out my perfect tech stack combo!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My DevMatch Result",
          text: text,
          url: window.location.href,
        });
      } catch {
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${fromColor} ${toColor} opacity-50`}
          />

          <CardHeader className="relative border-b">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                  <Trophy className="size-5 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl">
                  Your Ideal Stack: {stack.name}
                </CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5"
                onClick={handleShare}
              >
                <Share2Icon className="size-4" />
                <span>Share</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="relative p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b bg-muted/40 px-4">
                <TabsList className="h-auto bg-transparent p-0">
                  <TabsTrigger
                    value="overview"
                    className="relative h-12 rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary bg-transparent"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="recommendations"
                    className="relative h-12 rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary bg-transparent"
                  >
                    Recommendations
                  </TabsTrigger>
                  <TabsTrigger
                    value="breakdown"
                    className="relative h-12 rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary bg-transparent"
                  >
                    Tech Breakdown
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="p-6">
                <div className="space-y-6">
                  <p className="text-muted-foreground">{stack.description}</p>

                  <div className="flex flex-wrap justify-center gap-6">
                    {stackTechs.map((tech, i) => {
                      const IconComponent = Si[tech.icon as keyof typeof Si];
                      return (
                        <motion.div
                          key={tech.id}
                          className="flex flex-col items-center gap-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {IconComponent && (
                            <>
                              <IconComponent
                                size={64}
                                style={{
                                  color: getIconColor(tech.id),
                                }}
                              />
                              <span className="font-medium">{tech.name}</span>
                              <Badge variant="outline" className="capitalize">
                                {tech.category}
                              </Badge>
                            </>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="p-6">
                <div className="space-y-6">
                  <p className="text-muted-foreground mb-4">
                    Based on your tech preferences, here are personalized
                    recommendations to enhance your skill set:
                  </p>

                  <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                    {personalizedRecommendations.map((rec, i) => {
                      const icon =
                        rec.type === "synergy" ? (
                          <Puzzle className="size-5" />
                        ) : rec.type === "learning" ? (
                          <BookOpenIcon className="size-5" />
                        ) : (
                          <Zap className="size-5" />
                        );

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Card className="h-full">
                            <CardHeader className="pb-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`flex size-8 items-center justify-center rounded-full 
                                  ${
                                    rec.type === "synergy"
                                      ? "bg-blue-100 text-blue-600 dark:bg-blue-950"
                                      : rec.type === "learning"
                                      ? "bg-green-100 text-green-600 dark:bg-green-950"
                                      : "bg-purple-100 text-purple-600 dark:bg-purple-950"
                                  }`}
                                >
                                  {icon}
                                </div>
                                <CardTitle className="text-lg">
                                  {rec.title}
                                </CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-4">
                                {rec.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {rec.relatedTechs.map((techId) => {
                                  const tech = techStack.find(
                                    (t) => t.id === techId
                                  );
                                  if (!tech) return null;

                                  const IconComponent =
                                    Si[tech.icon as keyof typeof Si];
                                  const isLiked = likedTech.includes(tech.id);

                                  return (
                                    <div
                                      key={tech.id}
                                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs
                                        ${
                                          isLiked
                                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                                            : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                        }`}
                                    >
                                      {IconComponent && (
                                        <IconComponent
                                          size={14}
                                          style={{
                                            color: getIconColor(tech.id),
                                          }}
                                        />
                                      )}
                                      <span>{tech.name}</span>
                                      {isLiked && (
                                        <span className="size-3 rounded-full bg-green-500/80 ml-1" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="breakdown" className="p-6">
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    Based on your preferences, here&apos;s a breakdown of your
                    tech choices by category:
                  </p>

                  <div className="space-y-6">
                    {categories.map((category, i) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold capitalize">
                            {category}
                          </h3>
                          <Badge variant="outline">
                            {techsByCategory[category].length}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {techsByCategory[category].map((tech) => {
                            const IconComponent =
                              Si[tech.icon as keyof typeof Si];
                            return (
                              <div
                                key={tech.id}
                                className="flex items-center gap-2 rounded-lg border bg-card p-2"
                              >
                                {IconComponent && (
                                  <IconComponent
                                    size={24}
                                    style={{ color: getIconColor(tech.id) }}
                                  />
                                )}
                                <span className="text-sm font-medium">
                                  {tech.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="relative border-t bg-muted/40 p-4">
            <div className="flex w-full items-center justify-between">
              <Button asChild variant="outline" size="sm">
                <Link href="/swipe">
                  <ArrowLeftIcon className="mr-2 size-4" />
                  Back to Swipe
                </Link>
              </Button>
              <Button asChild>
                <Link href="/">
                  Finish
                  <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

function getIconColor(techId: string): string {
  const colors: Record<string, string> = {
    react: "#61DAFB",
    nextjs: "#FFFFFF",
    typescript: "#3178C6",
    tailwind: "#06B6D4",
    mongodb: "#47A248",
    postgres: "#336791",
    express: "#FFFFFF",
    nodejs: "#339933",
    graphql: "#E10098",
    prisma: "#2D3748",
    reactquery: "#FF4154",
    redux: "#764ABC",
    firebase: "#FFCA28",
    supabase: "#3ECF8E",
    aws: "#FF9900",
    vue: "#4FC08D",
    angular: "#DD0031",
    svelte: "#FF3E00",
    django: "#092E20",
    flask: "#FFFFFF",
    spring: "#6DB33F",
    dotnet: "#512BD4",
    mysql: "#4479A1",
    redis: "#DC382D",
    javascript: "#F7DF1E",
    python: "#3776AB",
    rust: "#FFFFFF",
    go: "#00ADD8",
    gcp: "#4285F4",
    azure: "#0078D4",
    vercel: "#FFFFFF",
    docker: "#2496ED",
    kubernetes: "#326CE5",
    styledcomponents: "#DB7093",
    flutter: "#02569B",
    swift: "#F05138",
    kotlin: "#7F52FF",
    jest: "#C21325",
    cypress: "#17202C",
    github: "#FFFFFF",
    gitlab: "#FC6D26",
  };

  return colors[techId] || "#AAAAAA";
}
