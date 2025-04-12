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
  // Initialize with all categories selected by default
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

  // Add a useEffect to initialize with all categories selected
  React.useEffect(() => {
    // Make sure all categories are selected on initial load
    setSelectedCategories(allCategories);
  }, []);

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

      {/* Category Sidebar - fixed mobile styling */}
      <motion.div
        className="fixed left-0 top-16 bottom-0 z-30 w-20 md:w-48 bg-card/30 backdrop-blur-md border-r shadow-sm overflow-hidden"
        initial={{ x: -80 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex flex-col h-full p-2 md:pt-4">
          <h3 className="hidden md:block mb-4 px-3 text-center text-sm font-medium text-muted-foreground">
            Tech Categories
          </h3>

          <div className="flex-1 flex flex-col gap-2 overflow-auto py-2">
            {allCategories.map((category, _) => {
              const isActive = selectedCategories.includes(category);
              return (
                <motion.button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`relative flex md:flex-row flex-col items-center gap-2 rounded-lg p-3 text-sm font-medium transition-all overflow-hidden ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(0,0,0,0.05)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.1 * _,
                    duration: 0.3,
                  }}
                >
                  {/* Background gradient when active */}
                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 opacity-20 ${getBgGradientClass(
                        category
                      )}`}
                      layoutId={`bg-${category}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                      exit={{ opacity: 0 }}
                    />
                  )}

                  <span className="text-xl">{getEmoji(category)}</span>
                  <span className="hidden md:block text-xs capitalize">
                    {category}
                  </span>

                  {isActive && (
                    <motion.div
                      className="absolute right-2 top-2 hidden md:flex size-4 items-center justify-center rounded-full bg-white border shadow-sm"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

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

      {/* Main card area - ensure proper spacing on mobile */}
      <div className="w-full max-w-sm ml-20 md:ml-48 mt-16 md:mt-0">
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
