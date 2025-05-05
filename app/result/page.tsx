"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { techStack, Tech } from "@/lib/data";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import * as Si from "react-icons/si";
import {
  Share2Icon,
  ArrowLeftIcon,
  SparklesIcon,
  RocketIcon,
  ListChecksIcon,
  CpuIcon,
  ServerIcon,
  DatabaseIcon,
  CloudIcon,
  CodeIcon,
  BookOpenIcon,
  GraduationCapIcon,
  TargetIcon,
  TrophyIcon,
} from "lucide-react";
import { toast } from "sonner";
import AiRecommendations from "@/components/AiRecommendations";

// Define type for Si icons
type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

// Group technologies by category
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

// Generate a customized stack name and description based on liked technologies
function generateCustomStack(likedTech: string[]): {
  name: string;
  description: string;
  color: string;
} {
  const likedTechs = techStack.filter((tech) => likedTech.includes(tech.id));
  const techsByCategory = groupTechsByCategory(likedTechs);
  const categories = Object.keys(techsByCategory);

  // Create a dynamic stack name based on categories and top technologies
  let stackName = "";
  let stackDescription = "";
  let stackColor = "blue";

  // Determine the most appropriate color based on dominant categories
  if (categories.includes("frontend") && categories.includes("backend")) {
    stackColor = "purple";
  } else if (categories.includes("frontend")) {
    stackColor = "blue";
  } else if (categories.includes("backend")) {
    stackColor = "green";
  } else if (categories.includes("database")) {
    stackColor = "orange";
  } else if (categories.includes("devops") || categories.includes("cloud")) {
    stackColor = "pink";
  }

  // Generate stack name
  if (likedTechs.length === 0) {
    return {
      name: "Custom Stack",
      description: "Start swiping to discover your ideal tech stack!",
      color: "blue",
    };
  }

  // Check for well-known tech stack combinations
  if (
    likedTech.includes("react") &&
    likedTech.includes("nodejs") &&
    likedTech.includes("express") &&
    likedTech.includes("mongodb")
  ) {
    return {
      name: "MERN Stack",
      description:
        "Your choices align with the MERN stack (MongoDB, Express, React, Node.js) — a powerful JavaScript-based stack for building dynamic web applications.",
      color: "blue",
    };
  }

  if (
    likedTech.includes("nextjs") &&
    likedTech.includes("typescript") &&
    likedTech.includes("prisma")
  ) {
    return {
      name: "Modern TypeScript Stack",
      description:
        "You've selected a modern type-safe web development stack with Next.js, TypeScript, and Prisma — ideal for building robust, scalable applications with excellent developer experience.",
      color: "purple",
    };
  }

  if (
    likedTech.includes("django") &&
    likedTech.includes("python") &&
    (likedTech.includes("postgres") || likedTech.includes("mysql"))
  ) {
    return {
      name: "Django Full-Stack",
      description:
        "You've chosen a Python-based stack with Django and a SQL database, perfect for rapid development of secure, maintainable web applications with a batteries-included approach.",
      color: "green",
    };
  }

  if (
    (likedTech.includes("vue") || likedTech.includes("nuxt")) &&
    likedTech.includes("nodejs") &&
    likedTech.includes("mongodb")
  ) {
    return {
      name: "VENM Stack",
      description:
        "Your selections form the VENM stack (Vue.js, Express, Node.js, MongoDB) — a JavaScript stack centered around Vue.js that's great for building lightweight, reactive applications.",
      color: "emerald",
    };
  }

  // Generate dynamic stack name based on categories
  if (categories.includes("frontend") && categories.includes("backend")) {
    // Get most prominent tech from each category
    const frontendTech = techsByCategory.frontend[0];
    const backendTech = techsByCategory.backend[0];

    stackName = `${frontendTech.name}/${backendTech.name} Stack`;
    stackDescription = `Your stack combines ${frontendTech.name} on the frontend with ${backendTech.name} on the backend, creating a powerful combination for full-stack development.`;
  } else if (categories.length === 1) {
    // Single category stack
    const category = categories[0];
    const displayCategory =
      category.charAt(0).toUpperCase() + category.slice(1);
    stackName = `${displayCategory} Specialist Stack`;
    stackDescription = `Your selections focus on ${category} technologies, showing your specialization in this area. Consider exploring complementary technologies for a more comprehensive stack.`;
  } else {
    // Mixed stack
    const categoryNames = categories
      .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
      .join("/");
    stackName = `Custom ${categoryNames} Stack`;
    stackDescription = `Your selections span ${categories.join(
      ", "
    )}, creating a versatile tech stack for a wide range of development needs.`;
  }

  return { name: stackName, description: stackDescription, color: stackColor };
}

export default function ResultPage() {
  const [likedTech, setLikedTech] = React.useState<string[]>([]);
  const [customStack, setCustomStack] = React.useState<{
    name: string;
    description: string;
    color: string;
  }>({ name: "Custom Stack", description: "", color: "blue" });
  const [particles, setParticles] = React.useState<
    Array<{
      width: number;
      height: number;
      left: string;
      top: string;
      xMovement: number;
      yMovement: number;
      duration: number;
      delay: number;
    }>
  >([]);

  React.useEffect(() => {
    // Retrieve liked technologies from local storage
    const storedLikedTech = JSON.parse(
      localStorage.getItem("likedTech") || "[]"
    );
    setLikedTech(storedLikedTech);

    // Generate custom stack based on liked technologies
    setCustomStack(generateCustomStack(storedLikedTech));

    // Initialize particles after component mounts to avoid hydration mismatch
    const newParticles = Array.from({ length: 20 }).map(() => ({
      width: Math.random() * 100 + 10,
      height: Math.random() * 100 + 10,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      xMovement: Math.random() * 20 - 10,
      yMovement: Math.random() * 20 - 10,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Get all liked technologies
  const likedTechnologies = techStack.filter((tech) =>
    likedTech.includes(tech.id)
  );

  // Group liked technologies by category
  const techsByCategory = groupTechsByCategory(likedTechnologies);

  // Get categories sorted by number of technologies
  const categories = Object.keys(techsByCategory).sort(
    (a, b) => techsByCategory[b].length - techsByCategory[a].length
  );



  const handleShare = async () => {
    const text = `I matched with the ${customStack.name} on DevMatch! Check out my perfect tech stack combo!`;

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

  // Function to get the icon for a category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "frontend":
        return <CodeIcon className="size-4" />;
      case "backend":
        return <ServerIcon className="size-4" />;
      case "database":
        return <DatabaseIcon className="size-4" />;
      case "cloud":
        return <CloudIcon className="size-4" />;
      case "language":
        return <CodeIcon className="size-4" />;
      case "tools":
        return <CpuIcon className="size-4" />;
      case "devops":
        return <ServerIcon className="size-4" />;
      case "mobile":
        return <CodeIcon className="size-4" />;
      default:
        return <CpuIcon className="size-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 dark:from-white/5 dark:to-white/0"
            style={{
              width: particle.width,
              height: particle.height,
              left: particle.left,
              top: particle.top,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.1, 1],
              x: [0, particle.xMovement, 0],
              y: [0, particle.yMovement, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="container py-8 sm:py-16 px-4 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-full hover:bg-gray-900 hover:backdrop-blur-md border border-gray-800 shadow-sm px-4 text-white"
              >
                <ArrowLeftIcon className="size-4" /> Back
              </Button>
            </motion.div>
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 rounded-full hover:bg-gray-900 hover:backdrop-blur-md border border-gray-800 shadow-sm px-4 text-white"
              onClick={handleShare}
            >
              <Share2Icon className="size-4" /> Share
            </Button>
          </motion.div>
        </motion.div>

        {/* Title section - updating gradient colors for better visibility on black */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h1
              className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {customStack.name}
            </motion.h1>
          </motion.div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {customStack.description}
          </p>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Insights section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  className="size-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-md"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <SparklesIcon className="size-5 text-white" />
                </motion.div>
                <h2 className="text-2xl font-semibold text-white">
                  AI Insights
                </h2>
              </div>
            </div>

            <AiRecommendations likedTech={likedTech} />
          </motion.div>

          {/* Tech selection section - Now equal sized */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Selected technologies */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  className="size-8 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-600 shadow-md"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <RocketIcon className="size-5 text-white" />
                </motion.div>
                <h2 className="text-2xl font-semibold text-white">
                  Your Tech Selections
                </h2>
              </div>
            </div>

            <Card className="overflow-hidden border-none bg-gray-900/80 backdrop-blur-md shadow-lg">
              <CardContent className="p-6">
                {categories.length > 0 ? (
                  <AnimatePresence>
                    <div className="space-y-6">
                      {categories.map((category, idx) => (
                        <motion.div
                          key={category}
                          className="space-y-3"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 * idx }}
                        >
                          <motion.div
                            className="flex items-center gap-2 mb-2"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <div
                              className={`size-8 flex items-center justify-center rounded-full bg-gradient-to-br ${getCategoryColor(
                                category
                              )} shadow-sm`}
                            >
                              {getCategoryIcon(category)}
                            </div>
                            <h3 className="text-base font-medium capitalize text-white">
                              {category}
                            </h3>
                          </motion.div>
                          <div className="space-y-3">
                            {techsByCategory[category].map((tech, i) => {
                              const IconComponent = (
                                Si as Record<string, IconType>
                              )[tech.icon];
                              return (
                                <motion.div
                                  key={tech.id}
                                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 transition-all"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: 0.05 * i,
                                  }}
                                  whileHover={{
                                    scale: 1.02,
                                    backgroundColor: "rgba(31, 41, 55, 0.8)",
                                    borderColor: "rgba(75, 85, 99, 0.4)",
                                    y: -2,
                                  }}
                                >
                                  {IconComponent && (
                                    <motion.div
                                      className="p-2 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/30 shadow-sm"
                                      whileHover={{ rotate: 10, scale: 1.1 }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 10,
                                      }}
                                    >
                                      <IconComponent
                                        className={`size-5 ${getIconColor(
                                          tech.id
                                        )}`}
                                      />
                                    </motion.div>
                                  )}
                                  <div>
                                    <p className="font-medium text-white">
                                      {tech.name}
                                    </p>
                                    <p className="text-xs text-gray-400 line-clamp-1">
                                      {tech.description}
                                    </p>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                ) : (
                  <div className="text-center py-8">
                    <motion.div
                      className="size-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4"
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.6, 0.8, 0.6],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ListChecksIcon className="size-8 text-gray-400" />
                    </motion.div>
                    <p className="text-gray-400 mb-4">
                      You haven&apos;t selected any technologies yet.
                    </p>
                    <Link href="/">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button className="rounded-full px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md border-none">
                          Start Swiping
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                )}
              </CardContent>
              {likedTech.length > 0 && (
                <CardFooter className="pt-1 pb-4">
                  <Link href="/" className="w-full">
                    <motion.div
                      className="w-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-full hover:bg-gray-800 border border-gray-700/40 shadow-sm text-white"
                      >
                        Add more technologies
                      </Button>
                    </motion.div>
                  </Link>
                </CardFooter>
              )}
            </Card>

            {/* Learning Roadmap Section */}
            {likedTech.length > 0 && (
              <motion.div
                className="mt-8 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="mb-2">
                  <motion.div
                    className="flex items-center gap-3 mb-2"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className="size-8 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 shadow-md"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <GraduationCapIcon className="size-5 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-semibold text-white">
                      Your Learning Path
                    </h2>
                  </motion.div>
                </div>

                <Card className="overflow-hidden border-none bg-gray-900/80 backdrop-blur-md shadow-lg">
                  <CardContent className="p-6">
                    <div className="space-y-1 mb-4">
                      <h3 className="text-base font-medium text-white">
                        Master these skills to become a pro:
                      </h3>
                      <p className="text-xs text-gray-400">
                        Based on your technology choices
                      </p>
                    </div>

                    <div className="space-y-8 mt-6">
                      {/* Timeline roadmap based on user's tech */}
                      <div className="relative border-l border-gray-700 pl-6 ml-3 space-y-8">
                        {categories.slice(0, 3).map((category, idx) => {
                          // Get first tech in each category as the main focus
                          const mainTech = techsByCategory[category][0];
                          const IconComponent = (
                            Si as Record<string, IconType>
                          )[mainTech.icon];

                          return (
                            <motion.div
                              key={category}
                              className="relative"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: 0.2 * idx + 0.5,
                                duration: 0.4,
                              }}
                            >
                              {/* Timeline dot */}
                              <div className="absolute -left-9 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              </div>

                              <div className="flex flex-col space-y-3">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-base font-medium text-white capitalize">
                                    {idx === 0
                                      ? "Beginner"
                                      : idx === 1
                                      ? "Intermediate"
                                      : "Advanced"}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/70 border border-gray-700/50">
                                  {IconComponent && (
                                    <div className="p-2 rounded-full bg-gray-900 border border-gray-700/50">
                                      <IconComponent
                                        className={`size-5 ${getIconColor(
                                          mainTech.id
                                        )}`}
                                      />
                                    </div>
                                  )}
                                  <div className="w-full">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-white">
                                        {mainTech.name}
                                      </p>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {idx === 0
                                        ? `Learn the core concepts of ${mainTech.name} and build simple projects`
                                        : idx === 1
                                        ? `Master advanced patterns and optimize ${mainTech.name} applications`
                                        : `Architect complex systems with ${mainTech.name} and contribute to the ecosystem`}
                                    </p>

                                    {/* Documentation links */}
                                    <div className="mt-3 pt-2 border-t border-gray-700/30">
                                      <p className="text-xs font-medium text-gray-400 mb-1.5">
                                        Resources:
                                      </p>
                                      <div className="grid grid-cols-1 gap-1">
                                        {getTechResources(mainTech.id).map(
                                          (resource, i) => (
                                            <a
                                              key={i}
                                              href={resource.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
                                            >
                                              {resource.type === "docs" &&
                                                "📄 "}
                                              {resource.type === "tutorial" &&
                                                "📚 "}
                                              {resource.type === "course" &&
                                                "🎓 "}
                                              {resource.type === "community" &&
                                                "👥 "}
                                              {resource.name}
                                            </a>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {idx === 2 && (
                                  <div className="flex items-center gap-3 mt-2">
                                    <TrophyIcon className="size-5 text-yellow-500" />
                                    <p className="text-sm text-gray-300">
                                      Complete this path to become a
                                      sought-after developer
                                    </p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Resource links */}
                      <motion.div
                        className="border-t border-gray-800 pt-4 mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpenIcon className="size-4 text-blue-400" />
                          <h4 className="text-sm font-medium text-white">
                            Developer Resources
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <motion.a
                            href="https://roadmap.sh"
                            target="_blank"
                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2 p-2 rounded-md hover:bg-gray-800/50 transition-colors"
                            whileHover={{ x: 3 }}
                          >
                            <TargetIcon className="size-4" /> Developer Roadmaps
                          </motion.a>
                          <motion.a
                            href="https://github.com/trending"
                            target="_blank"
                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2 p-2 rounded-md hover:bg-gray-800/50 transition-colors"
                            whileHover={{ x: 3 }}
                          >
                            <CodeIcon className="size-4" /> GitHub Trending
                            Repositories
                          </motion.a>
                          <motion.a
                            href="https://devdocs.io/"
                            target="_blank"
                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2 p-2 rounded-md hover:bg-gray-800/50 transition-colors"
                            whileHover={{ x: 3 }}
                          >
                            <BookOpenIcon className="size-4" /> DevDocs API
                            Documentation
                          </motion.a>
                          <motion.a
                            href="https://stackoverflow.com/"
                            target="_blank"
                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2 p-2 rounded-md hover:bg-gray-800/50 transition-colors"
                            whileHover={{ x: 3 }}
                          >
                            <ServerIcon className="size-4" /> Stack Overflow
                          </motion.a>
                          <motion.a
                            href="https://www.reddit.com/r/programming/"
                            target="_blank"
                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2 p-2 rounded-md hover:bg-gray-800/50 transition-colors"
                            whileHover={{ x: 3 }}
                          >
                            <ServerIcon className="size-4" /> r/programming
                          </motion.a>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Badge at the bottom with author info */}
        <motion.div
          className="mt-16 flex flex-col items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Link href="/">
            <motion.div
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="font-semibold">DevMatch</span>
              <span>•</span>
              <span>Find your perfect tech match</span>
            </motion.div>
          </Link>

          <a
            href="https://khyaatikhanna.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Created by Khyaati Khanna
          </a>
        </motion.div>
      </div>
    </div>
  );
}

// Helper functions
function getCategoryColor(category: string): string {
  switch (category) {
    case "frontend":
      return "blue";
    case "backend":
      return "green";
    case "database":
      return "amber";
    case "language":
      return "indigo";
    case "cloud":
      return "sky";
    case "mobile":
      return "rose";
    case "devops":
      return "orange";
    case "tools":
      return "violet";
    default:
      return "zinc";
  }
}

function getIconColor(techId: string): string {
  // Map technology IDs to specific Tailwind classes
  const colorMap: Record<string, string> = {
    react: "text-blue-500",
    nextjs: "text-zinc-800 dark:text-zinc-300",
    vue: "text-emerald-500",
    angular: "text-red-600",
    svelte: "text-orange-600",
    tailwind: "text-sky-500",
    nodejs: "text-green-600",
    express: "text-zinc-700 dark:text-zinc-300",
    nestjs: "text-red-600",
    mongodb: "text-green-600",
    postgres: "text-blue-600",
    typescript: "text-blue-600",
    javascript: "text-yellow-500",
    python: "text-blue-600",
    prisma: "text-zinc-800 dark:text-zinc-100",
    aws: "text-orange-500",
    graphql: "text-pink-600",
    spring: "text-green-500",
    amplify: "text-orange-500",
    vercel: "text-pink-600",
    gitlab: "text-orange-600",
  };

  return colorMap[techId] || "text-zinc-600 dark:text-zinc-400";
}

// Helper function to get documentation resources for technologies in the roadmap
interface TechResource {
  name: string;
  url: string;
  type: "docs" | "tutorial" | "course" | "community";
}

function getTechResources(techId: string): TechResource[] {
  const resourceMap: Record<string, TechResource[]> = {
    // Frontend resources
    react: [
      { name: "Official React Docs", url: "https://react.dev/", type: "docs" },
      {
        name: "React Tutorial",
        url: "https://react.dev/learn",
        type: "tutorial",
      },
      {
        name: "React Community",
        url: "https://reactjs.org/community/support.html",
        type: "community",
      },
    ],
    nextjs: [
      {
        name: "Next.js Documentation",
        url: "https://nextjs.org/docs",
        type: "docs",
      },
      {
        name: "Learn Next.js",
        url: "https://nextjs.org/learn",
        type: "tutorial",
      },
      {
        name: "Next.js Discord",
        url: "https://discord.gg/nextjs",
        type: "community",
      },
    ],
    vue: [
      {
        name: "Vue.js Guide",
        url: "https://vuejs.org/guide/introduction.html",
        type: "docs",
      },
      {
        name: "Vue Mastery",
        url: "https://www.vuemastery.com/courses/intro-to-vue-3/intro-to-vue3",
        type: "course",
      },
      { name: "Vue Forum", url: "https://forum.vuejs.org/", type: "community" },
    ],
    angular: [
      { name: "Angular Docs", url: "https://angular.io/docs", type: "docs" },
      {
        name: "Angular Tutorial",
        url: "https://angular.io/tutorial",
        type: "tutorial",
      },
      {
        name: "Angular Community",
        url: "https://angular.io/community",
        type: "community",
      },
    ],
    svelte: [
      {
        name: "Svelte Tutorial",
        url: "https://svelte.dev/tutorial",
        type: "tutorial",
      },
      { name: "Svelte Docs", url: "https://svelte.dev/docs", type: "docs" },
      {
        name: "Svelte Discord",
        url: "https://discord.com/invite/svelte",
        type: "community",
      },
    ],
    tailwind: [
      {
        name: "Tailwind Docs",
        url: "https://tailwindcss.com/docs",
        type: "docs",
      },
      {
        name: "Tailwind UI Components",
        url: "https://tailwindui.com/components",
        type: "docs",
      },
      {
        name: "Tailwind Discord",
        url: "https://discord.gg/tailwindcss",
        type: "community",
      },
    ],

    // Backend resources
    nodejs: [
      {
        name: "Node.js Docs",
        url: "https://nodejs.org/en/docs/",
        type: "docs",
      },
      {
        name: "Node.js Learn",
        url: "https://nodejs.dev/en/learn/",
        type: "tutorial",
      },
      {
        name: "Node.js Discord",
        url: "https://discord.com/invite/nodejs",
        type: "community",
      },
    ],
    express: [
      { name: "Express Docs", url: "https://expressjs.com/", type: "docs" },
      {
        name: "Express Guide",
        url: "https://expressjs.com/en/guide/routing.html",
        type: "tutorial",
      },
      {
        name: "MDN Express Tutorial",
        url: "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs",
        type: "tutorial",
      },
    ],
    nestjs: [
      {
        name: "NestJS Documentation",
        url: "https://docs.nestjs.com/",
        type: "docs",
      },
      {
        name: "NestJS Fundamentals",
        url: "https://docs.nestjs.com/first-steps",
        type: "tutorial",
      },
      {
        name: "NestJS Discord",
        url: "https://discord.gg/nestjs",
        type: "community",
      },
    ],
    django: [
      {
        name: "Django Documentation",
        url: "https://docs.djangoproject.com/",
        type: "docs",
      },
      {
        name: "Django Tutorial",
        url: "https://docs.djangoproject.com/en/stable/intro/tutorial01/",
        type: "tutorial",
      },
      {
        name: "Django Forum",
        url: "https://forum.djangoproject.com/",
        type: "community",
      },
    ],
    flask: [
      {
        name: "Flask Documentation",
        url: "https://flask.palletsprojects.com/",
        type: "docs",
      },
      {
        name: "Flask Mega-Tutorial",
        url: "https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world",
        type: "tutorial",
      },
      {
        name: "Flask Discord",
        url: "https://discord.gg/pallets",
        type: "community",
      },
    ],
    spring: [
      {
        name: "Spring Boot Docs",
        url: "https://spring.io/projects/spring-boot",
        type: "docs",
      },
      {
        name: "Spring Guides",
        url: "https://spring.io/guides",
        type: "tutorial",
      },
      {
        name: "Spring Community",
        url: "https://spring.io/community",
        type: "community",
      },
    ],

    // Database resources
    mongodb: [
      { name: "MongoDB Docs", url: "https://docs.mongodb.com/", type: "docs" },
      {
        name: "MongoDB University",
        url: "https://university.mongodb.com/",
        type: "course",
      },
      {
        name: "MongoDB Community",
        url: "https://www.mongodb.com/community",
        type: "community",
      },
    ],
    postgres: [
      {
        name: "PostgreSQL Docs",
        url: "https://www.postgresql.org/docs/",
        type: "docs",
      },
      {
        name: "PostgreSQL Tutorial",
        url: "https://www.postgresqltutorial.com/",
        type: "tutorial",
      },
      {
        name: "PostgreSQL Community",
        url: "https://www.postgresql.org/community/",
        type: "community",
      },
    ],
    mysql: [
      { name: "MySQL Docs", url: "https://dev.mysql.com/doc/", type: "docs" },
      {
        name: "MySQL Tutorial",
        url: "https://www.mysqltutorial.org/",
        type: "tutorial",
      },
      {
        name: "MySQL Community",
        url: "https://forums.mysql.com/",
        type: "community",
      },
    ],
    redis: [
      {
        name: "Redis Docs",
        url: "https://redis.io/documentation",
        type: "docs",
      },
      {
        name: "Redis University",
        url: "https://university.redis.com/",
        type: "course",
      },
      {
        name: "Redis Discord",
        url: "https://discord.com/invite/redis",
        type: "community",
      },
    ],

    // Language resources
    typescript: [
      {
        name: "TypeScript Handbook",
        url: "https://www.typescriptlang.org/docs/handbook/intro.html",
        type: "docs",
      },
      {
        name: "TypeScript Playground",
        url: "https://www.typescriptlang.org/play",
        type: "tutorial",
      },
      {
        name: "TypeScript Discord",
        url: "https://discord.com/invite/typescript",
        type: "community",
      },
    ],
    javascript: [
      {
        name: "MDN JavaScript Guide",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        type: "docs",
      },
      {
        name: "JavaScript.info",
        url: "https://javascript.info/",
        type: "tutorial",
      },
      {
        name: "JavaScript Discord",
        url: "https://discord.gg/javascript",
        type: "community",
      },
    ],
    python: [
      { name: "Python Docs", url: "https://docs.python.org/3/", type: "docs" },
      { name: "Real Python", url: "https://realpython.com/", type: "tutorial" },
      {
        name: "Python Discord",
        url: "https://discord.com/invite/python",
        type: "community",
      },
    ],

    // Cloud resources
    aws: [
      {
        name: "AWS Documentation",
        url: "https://docs.aws.amazon.com/",
        type: "docs",
      },
      {
        name: "AWS Training",
        url: "https://aws.amazon.com/training/",
        type: "course",
      },
      {
        name: "AWS Community",
        url: "https://aws.amazon.com/developer/community/",
        type: "community",
      },
    ],
    firebase: [
      {
        name: "Firebase Docs",
        url: "https://firebase.google.com/docs",
        type: "docs",
      },
      {
        name: "Firebase Codelab",
        url: "https://firebase.google.com/codelabs",
        type: "tutorial",
      },
      {
        name: "Firebase Community",
        url: "https://firebase.google.com/community",
        type: "community",
      },
    ],
    vercel: [
      {
        name: "Vercel Documentation",
        url: "https://vercel.com/docs",
        type: "docs",
      },

      {
        name: "Deployment Guide",
        url: "https://vercel.com/docs/deployments/overview",
        type: "tutorial",
      },
      {
        name: "Vercel Templates",
        url: "https://vercel.com/templates",
        type: "tutorial",
      },
    ],

    // Mobile resources
    swift: [
      {
        name: "Swift Documentation",
        url: "https://www.swift.org/documentation/",
        type: "docs",
      },
      {
        name: "Swift by Sundell",
        url: "https://www.swiftbysundell.com/",
        type: "tutorial",
      },
      {
        name: "Hacking with Swift",
        url: "https://www.hackingwithswift.com/",
        type: "tutorial",
      },
    ],
    flutter: [
      { name: "Flutter Docs", url: "https://flutter.dev/docs", type: "docs" },
      {
        name: "Flutter Codelabs",
        url: "https://flutter.dev/docs/codelabs",
        type: "tutorial",
      },
      {
        name: "Flutter Community",
        url: "https://flutter.dev/community",
        type: "community",
      },
    ],

    // Tools resources
    gitlab: [
      {
        name: "GitLab Documentation",
        url: "https://docs.gitlab.com/",
        type: "docs",
      },
      {
        name: "GitLab CI/CD Reference",
        url: "https://docs.gitlab.com/ee/ci/",
        type: "docs",
      },
      {
        name: "Common Git Commands",
        url: "https://docs.gitlab.com/ee/gitlab-basics/start-using-git.html",
        type: "tutorial",
      },
      {
        name: "GitLab Learning Resources",
        url: "https://docs.gitlab.com/ee/tutorials/",
        type: "course",
      },
    ],
  };

  // If we have specific resources for this tech, return them
  if (resourceMap[techId]) {
    return resourceMap[techId];
  }

  // Special case for Vercel-related technologies that don't have specific entries
  if (techId.toLowerCase().includes("vercel")) {
    return resourceMap["vercel"];
  }

  // Special case for GitLab-related technologies
  if (techId.toLowerCase().includes("gitlab")) {
    return resourceMap["gitlab"];
  }

  // Try to provide a more direct URL but fall back to search if needed
  const techName = techId.toLowerCase().replace(/\s+/g, "");

  return [
    {
      name: `${techId} Documentation`,
      // Try to provide an official docs link if we can guess it; otherwise use a search
      url: `https://www.google.com/search?q=${encodeURIComponent(
        techId + " official documentation"
      )}`,
      type: "docs",
    },
    {
      name: `${techId} Tutorials`,
      url: `https://www.google.com/search?q=${encodeURIComponent(
        techId + " tutorials getting started"
      )}`,
      type: "tutorial",
    },
    {
      name: `${techId} Community`,
      // Check GitHub topics as a good starting point for many tech communities
      url: `https://github.com/topics/${techName}`,
      type: "community",
    },
  ];
}
