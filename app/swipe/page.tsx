"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { TechCard } from "@/components/tech-card";
import { techStack, Tech } from "@/lib/data";
import { XIcon, HeartIcon, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { SiReact } from "react-icons/si";
import {
  Code2,
  Server,
  Database,
  Languages,
  Cloud,
  Smartphone,
  GitBranch,
  Wrench,
} from "lucide-react";

// Get all unique categories
const allCategories = Array.from(
  new Set(techStack.map((tech) => tech.category))
);

export default function SwipePage() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [likedTech, setLikedTech] = React.useState<string[]>([]);
  const [dislikedTech, setDislikedTech] = React.useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showProgress] = React.useState(true);
  const [selectedCategories, setSelectedCategories] =
    React.useState<string[]>(allCategories);
  const [filteredTechStack, setFilteredTechStack] = React.useState<Tech[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isRestarting, setIsRestarting] = React.useState(false);
  const [totalItems] = React.useState(10);
  const router = useRouter();

  // Animated blob references
  const blobTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Filter and shuffle tech stack based on selected categories
  React.useEffect(() => {
    const filtered = techStack
      .filter((tech) => selectedCategories.includes(tech.category))
      .sort(() => Math.random() - 0.5);

    // Limit to totalItems or the length of the filtered array (whichever is smaller)
    const limitedFiltered = filtered.slice(0, totalItems);
    setFilteredTechStack(limitedFiltered);
    setCurrentIndex(0);
  }, [selectedCategories, totalItems]);

  // Remove auto-hide progress bar effect
  React.useEffect(() => {
    // Always show the progress bar
    // No need to set anything since showProgress is already true by default
  }, []);

  // Animation for blobs
  React.useEffect(() => {
    const animateBlobs = () => {
      const blobs = document.querySelectorAll(".blob");
      blobs.forEach((blob) => {
        const blobElement = blob as HTMLElement;
        // Random movement within a small range
        const xMove = Math.random() * 8 - 4; // -4 to 4px
        const yMove = Math.random() * 8 - 4; // -4 to 4px

        // Apply subtle rotation and position change
        blobElement.style.transform = `translate(${xMove}px, ${yMove}px) rotate(${
          Math.random() * 10 - 5
        }deg)`;

        // Subtle size change
        const scale = 0.95 + Math.random() * 0.1; // 0.95 to 1.05
        blobElement.style.scale = scale.toString();
      });

      // Schedule next animation
      blobTimerRef.current = setTimeout(animateBlobs, 3000);
    };

    // Start animation
    animateBlobs();

    // Clean up
    return () => {
      if (blobTimerRef.current) {
        clearTimeout(blobTimerRef.current);
      }
    };
  }, []);

  const handleVote = (direction: "left" | "right") => {
    if (currentIndex >= filteredTechStack.length) return;

    const tech = filteredTechStack[currentIndex];

    if (direction === "right") {
      setLikedTech((prev) => [...prev, tech.id]);
      toast.success(`Added ${tech.name} to your stack!`);
    } else {
      setDislikedTech((prev) => [...prev, tech.id]);
    }

    // Move to next card immediately
    if (currentIndex === filteredTechStack.length - 1) {
      const updatedLiked = [
        ...likedTech,
        ...(direction === "right" ? [tech.id] : []),
      ];
      localStorage.setItem("likedTech", JSON.stringify(updatedLiked));

      // Animate transition to result page
      setIsRestarting(true);
      setTimeout(() => {
        router.push("/result");
      }, 500);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Calculate progress percentage
  const progressPercentage = React.useMemo(() => {
    if (filteredTechStack.length === 0) return 0;

    // Calculate based on both liked and disliked tech
    const totalReviewed = likedTech.length + dislikedTech.length;
    const totalAvailable = filteredTechStack.length;

    return Math.min(100, (totalReviewed / totalAvailable) * 100);
  }, [filteredTechStack.length, likedTech.length, dislikedTech.length]);

  // Add console logging to debug progress bar updates
  React.useEffect(() => {
    console.log(
      `Progress: ${progressPercentage.toFixed(1)}% | Current: ${
        currentIndex + 1
      }/${filteredTechStack.length} | Reviewed: ${
        likedTech.length + dislikedTech.length
      }`
    );
  }, [
    progressPercentage,
    currentIndex,
    filteredTechStack.length,
    likedTech,
    dislikedTech,
  ]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        // Don't allow deselecting if it's the last category
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const resetFilters = () => {
    setSelectedCategories(allCategories);
    toast.success("Filters reset to show all categories");
  };

  // Used in previous implementation, keeping for potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      frontend: "🖥️",
      backend: "⚙️",
      database: "🗄️",
      language: "📝",
      cloud: "☁️",
      mobile: "📱",
      devops: "🚀",
      tools: "🔧",
    };
    return emojis[category] || "🔍";
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div
          className="blob absolute w-[500px] h-[500px] rounded-full bg-purple-400/20 mix-blend-multiply blur-3xl"
          style={{ top: "10%", left: "15%", transition: "all 3s ease-in-out" }}
        />
        <div
          className="blob absolute w-[600px] h-[600px] rounded-full bg-blue-400/20 mix-blend-multiply blur-3xl"
          style={{ top: "40%", left: "50%", transition: "all 3s ease-in-out" }}
        />
        <div
          className="blob absolute w-[400px] h-[400px] rounded-full bg-pink-400/20 mix-blend-multiply blur-3xl"
          style={{ top: "60%", left: "30%", transition: "all 3s ease-in-out" }}
        />
      </div>

      {/* Side categories - fixed positioned with better styling */}
      <motion.div
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 bottom-0 w-16 md:w-40 bg-background/80 backdrop-blur-md border-r shadow-md z-10 flex flex-col overflow-y-auto p-3"
      >
        <div className="flex flex-col space-y-2 mt-16">
          {allCategories.map((category) => {
            const isActive = selectedCategories.includes(category);
            return (
              <motion.button
                key={category}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(0,0,0,0.05)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleCategory(category)}
                className={`relative group flex flex-col md:flex-row items-center justify-start md:justify-between p-2 rounded-lg cursor-pointer transition-all 
                  ${
                    isActive
                      ? `${getBgGradientClass(category)} text-white`
                      : "hover:bg-accent"
                  }`}
              >
                <div className="flex items-center gap-2">
                  {category === "frontend" && <Code2 className="size-4" />}
                  {category === "backend" && <Server className="size-4" />}
                  {category === "database" && <Database className="size-4" />}
                  {category === "language" && <Languages className="size-4" />}
                  {category === "cloud" && <Cloud className="size-4" />}
                  {category === "mobile" && <Smartphone className="size-4" />}
                  {category === "devops" && <GitBranch className="size-4" />}
                  {category === "tools" && <Wrench className="size-4" />}
                  <span className="hidden md:inline text-xs font-medium capitalize">
                    {category}
                  </span>
                </div>

                {isActive && (
                  <motion.div
                    className="absolute right-2 top-2 hidden md:flex size-3 items-center justify-center rounded-full bg-primary"
                    layoutId="active-indicator"
                  />
                )}
              </motion.button>
            );
          })}

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.05)" }}
            whileTap={{ scale: 0.95 }}
            onClick={resetFilters}
            className="mt-2 flex flex-col md:flex-row items-center justify-center gap-2 rounded-lg p-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="size-4" />
            <span className="hidden md:block">Reset Filters</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main card area - with proper margin to avoid sidebar overlap */}
      <div className="w-full max-w-sm ml-20 md:ml-44 pt-8">
        {/* Progress bar - repositioned above the cards */}
        <motion.div
          className="mb-6 w-full"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Progress
            value={progressPercentage}
            className="h-3 bg-accent/30 rounded-full"
          />
          <div className="mt-2 flex justify-between px-1 text-sm font-medium">
            <span>
              Progress: {likedTech.length + dislikedTech.length} of{" "}
              {filteredTechStack.length}
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              {Math.round(progressPercentage)}% complete
            </span>
          </div>
        </motion.div>

        {/* Card stack */}
        <div className="relative h-[520px]">
          <AnimatePresence mode="popLayout">
            {filteredTechStack.length > 0 ? (
              // Render only the current card and a preview of the next card for stability
              [0, 1]
                .map((offset) => {
                  const index =
                    (currentIndex + offset) % filteredTechStack.length;
                  const tech = filteredTechStack[index];
                  const isActive = offset === 0;

                  return (
                    <TechCard
                      key={`${tech.id}-${index}`}
                      tech={tech}
                      active={isActive}
                      onVote={(direction) => handleVote(direction)}
                    />
                  );
                })
                .reverse()
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6 bg-card rounded-xl border shadow-lg">
                  <h3 className="text-xl font-semibold mb-2">
                    No matches found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try selecting different categories or reset your filters.
                  </p>
                  <Button onClick={resetFilters}>Reset Filters</Button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {currentIndex < filteredTechStack.length &&
          filteredTechStack.length > 0 && (
            <motion.div
              className="hidden" // Keep hidden as buttons are in card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Button
                variant="outline"
                size="icon"
                className="size-16 rounded-full transition-all hover:scale-105 hover:bg-red-100 dark:hover:bg-red-950"
                onClick={() => handleVote("left")}
              >
                <XIcon className="size-8 text-red-500" />
                <span className="sr-only">Dislike</span>
              </Button>
              <Button
                size="icon"
                className="size-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all hover:scale-105 hover:opacity-90"
                onClick={() => handleVote("right")}
              >
                <HeartIcon className="size-8 text-white" />
                <span className="sr-only">Like</span>
              </Button>
            </motion.div>
          )}

        {/* Summary of selected techs */}
        {likedTech.length > 0 && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Your selections ({likedTech.length})
              </h3>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {likedTech.map((id) => {
                const tech = techStack.find((t) => t.id === id);
                if (!tech) return null;

                const IconComponent = SiReact;
                return (
                  <motion.div
                    key={id}
                    className="flex items-center gap-1 rounded-full border bg-background/70 backdrop-blur-sm px-2 py-1 text-xs"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {IconComponent && (
                      <IconComponent
                        size={12}
                        style={{ color: getIconColor(tech.id) }}
                      />
                    )}
                    <span>{tech.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Helper function to get background gradient for each category
function getBgGradientClass(category: string): string {
  const classes: Record<string, string> = {
    frontend: "bg-gradient-to-r from-blue-400 to-blue-600",
    backend: "bg-gradient-to-r from-green-400 to-green-600",
    database: "bg-gradient-to-r from-orange-400 to-orange-600",
    language: "bg-gradient-to-r from-purple-400 to-purple-600",
    cloud: "bg-gradient-to-r from-cyan-400 to-cyan-600",
    mobile: "bg-gradient-to-r from-pink-400 to-pink-600",
    devops: "bg-gradient-to-r from-amber-400 to-amber-600",
    tools: "bg-gradient-to-r from-indigo-400 to-indigo-600",
  };
  return classes[category] || "bg-gradient-to-r from-gray-400 to-gray-600";
}

// Helper function to get the appropriate color for each tech
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
