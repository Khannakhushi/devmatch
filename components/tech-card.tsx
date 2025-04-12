"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { XIcon, HeartIcon } from "lucide-react";
import { useSoundEffect } from "@/hooks/use-sound-effect";
import { Tech } from "@/lib/data";
import * as Si from "react-icons/si";
import { Badge } from "@/components/ui/badge";

interface Props {
  tech: Tech;
  active: boolean;
  onVote: (direction: "left" | "right") => void;
}

export function TechCard({ tech, active, onVote }: Props) {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const dragStartRef = React.useRef<null | { x: number; y: number }>(null);

  // Motion values for the card
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Add rotation effect based on drag
  const rotate = useTransform(x, [-150, 0, 150], [-15, 0, 15]);
  const scale = useTransform(
    x,
    [-175, -100, 0, 100, 175],
    [0.9, 0.975, 1, 0.975, 0.9]
  );

  // Add opacity effect for like/dislike indicators
  const leftOpacity = useTransform(x, [-150, -80, 0], [1, 0.5, 0]);
  const rightOpacity = useTransform(x, [0, 80, 150], [0, 0.5, 1]);

  const { playSwipeSound } = useSoundEffect();

  const resetPosition = () => {
    animate(x, 0, { duration: 0.2 });
    animate(y, 0, { duration: 0.2 });
    setIsAnimating(false);
  };

  const handleSwipe = (direction: "left" | "right") => {
    if (isAnimating) return;

    setIsAnimating(true);
    const targetX = direction === "right" ? 300 : -300;

    animate(x, targetX, {
      type: "spring",
      damping: 25,
      stiffness: 200,
      onComplete: () => {
        playSwipeSound(direction === "right" ? "like" : "dislike");
        onVote(direction);
      },
    });
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { velocity: { x: number }; offset: { x: number } }
  ) => {
    if (isAnimating) return;

    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    // Calculate the actual drag distance and direction
    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      setIsAnimating(true);
      const direction = offset > 0 ? "right" : "left";
      const targetX = direction === "right" ? 300 : -300;

      animate(x, targetX, {
        type: "spring",
        damping: 25,
        stiffness: 200,
        onComplete: () => {
          playSwipeSound(direction === "right" ? "like" : "dislike");
          onVote(direction);
        },
      });
    } else {
      resetPosition();
    }
  };

  // Fade-in animation for card appearance
  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  // Dynamically get the icon component from react-icons
  const IconComponent = Si[tech.icon as keyof typeof Si];

  // Track tap/click start position to differentiate between drags and taps
  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent) => {
    if (!cardRef.current) return;

    const clientX =
      "touches" in event
        ? event.touches[0].clientX
        : "clientX" in event
        ? event.clientX
        : 0;

    dragStartRef.current = {
      x: clientX,
      y: 0,
    };
  };

  // Add optional pros and cons to the Tech type conditionally
  const hasPros = tech.pros !== undefined && Array.isArray(tech.pros);
  const hasCons = tech.cons !== undefined && Array.isArray(tech.cons);

  // Function to prevent event propagation for buttons inside the card
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      ref={cardRef}
      style={{
        x,
        y,
        rotate,
        scale,
        position: "absolute",
        width: "100%",
        zIndex: active ? 10 : 1,
      }}
      drag={active && !isAnimating ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: active && !isAnimating ? 1.02 : 1 }}
      initial="hidden"
      animate="visible"
      variants={variants}
      className={cn(
        "cursor-grab touch-none active:cursor-grabbing",
        !active && "pointer-events-none"
      )}
    >
      <div className="relative overflow-hidden rounded-xl border bg-card shadow-xl min-h-[450px]">
        {/* Card Container */}
        <div
          className="relative w-full h-full"
          style={{
            transform: showDetails ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.6s",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front of card */}
          <div
            className="absolute w-full h-full p-6 cursor-pointer"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
            onClick={() => setShowDetails(true)}
          >
            <div className="relative flex flex-col items-center pt-4">
              {/* Like/Dislike Indicators */}
              <div className="pointer-events-none absolute left-0 right-0 top-0 flex justify-between px-4 py-2">
                <motion.div style={{ opacity: leftOpacity }}>
                  <div className="rounded-full bg-red-100 p-2 dark:bg-red-950">
                    <XIcon className="size-6 text-red-500" />
                  </div>
                </motion.div>
                <motion.div style={{ opacity: rightOpacity }}>
                  <div className="rounded-full bg-green-100 p-2 dark:bg-green-950">
                    <HeartIcon className="size-6 text-green-500" />
                  </div>
                </motion.div>
              </div>

              {/* Category badge */}
              <Badge
                variant="outline"
                className="capitalize mb-4 bg-accent/30 backdrop-blur-sm"
              >
                {tech.category}
              </Badge>

              {/* Tech Icon */}
              <motion.div
                className="flex size-28 items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {IconComponent && (
                  <IconComponent
                    className="size-24 drop-shadow-md"
                    style={{ color: getIconColor(tech.id) }}
                  />
                )}
              </motion.div>

              {/* Tech Info */}
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {tech.name}
                </h3>
                <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                  {tech.category === "frontend"
                    ? "Build beautiful user interfaces"
                    : tech.category === "backend"
                    ? "Power your application's server logic"
                    : tech.category === "database"
                    ? "Store and manage your data"
                    : tech.category === "language"
                    ? "The foundation of your development"
                    : tech.category === "cloud"
                    ? "Deploy and scale with ease"
                    : tech.category === "mobile"
                    ? "Create apps for iOS and Android"
                    : tech.category === "devops"
                    ? "Automate your development pipeline"
                    : tech.category === "tools"
                    ? "Enhance your development workflow"
                    : "Essential technology for modern development"}
                </p>
              </div>

              {/* Swipe buttons directly on the card */}
              <div className="flex justify-center gap-10 mt-6 w-full">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center rounded-full bg-red-100/70 backdrop-blur-sm p-4 text-red-600 dark:bg-red-950/70 shadow-sm relative z-10"
                  onClick={(e) => {
                    stopPropagation(e);
                    handleSwipe("left");
                  }}
                >
                  <XIcon className="size-7" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center rounded-full bg-green-100/70 backdrop-blur-sm p-4 text-green-600 dark:bg-green-950/70 shadow-sm relative z-10"
                  onClick={(e) => {
                    stopPropagation(e);
                    handleSwipe("right");
                  }}
                >
                  <HeartIcon className="size-7" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Back of card (details) */}
          <div
            className="absolute w-full h-full p-6 cursor-pointer"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            onClick={() => setShowDetails(false)}
          >
            <div className="relative flex flex-col gap-4">
              <motion.div
                className="absolute right-1 top-1 cursor-pointer rounded-full p-2 hover:bg-muted z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(false);
                }}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.95 }}
              >
                <XIcon className="size-5 text-muted-foreground" />
              </motion.div>

              <div className="flex items-center gap-3 mb-2">
                {IconComponent && (
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <IconComponent
                      className="size-12"
                      style={{ color: getIconColor(tech.id) }}
                    />
                  </motion.div>
                )}
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {tech.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className="mt-1 capitalize bg-accent/30 backdrop-blur-sm"
                  >
                    {tech.category}
                  </Badge>
                </div>
              </div>

              <div className="border-t border-b border-accent/40 py-3 my-1">
                <p className="text-sm">{tech.description}</p>
              </div>

              {hasPros && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Advantages:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {(tech.pros as string[]).map((pro, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hasCons && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Considerations:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {(tech.cons as string[]).map((con, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-red-500 mt-0.5">⚠</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-center gap-10 mt-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center rounded-full bg-red-100/70 backdrop-blur-sm p-4 text-red-600 dark:bg-red-950/70 shadow-sm relative z-10"
                  onClick={(e) => {
                    stopPropagation(e);
                    handleSwipe("left");
                  }}
                >
                  <XIcon className="size-7" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center rounded-full bg-green-100/70 backdrop-blur-sm p-4 text-green-600 dark:bg-green-950/70 shadow-sm relative z-10"
                  onClick={(e) => {
                    stopPropagation(e);
                    handleSwipe("right");
                  }}
                >
                  <HeartIcon className="size-7" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
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
