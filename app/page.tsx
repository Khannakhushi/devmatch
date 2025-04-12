"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import * as Si from "react-icons/si";

// Tech icons to display in the background
const backgroundIcons = [
  {
    icon: Si.SiReact,
    color: "#61DAFB",
    size: 48,
    position: "top-[10%] left-[15%] hidden sm:block",
  },
  {
    icon: Si.SiNextdotjs,
    color: "#000000",
    size: 40,
    position: "top-[30%] right-[20%] hidden sm:block",
  },
  {
    icon: Si.SiTypescript,
    color: "#3178C6",
    size: 36,
    position: "bottom-[25%] left-[20%] hidden sm:block",
  },
  {
    icon: Si.SiNodedotjs,
    color: "#339933",
    size: 44,
    position: "bottom-[15%] right-[15%] hidden sm:block",
  },
  {
    icon: Si.SiMongodb,
    color: "#47A248",
    size: 42,
    position: "top-[15%] left-[45%]",
  },
  {
    icon: Si.SiTailwindcss,
    color: "#06B6D4",
    size: 38,
    position: "bottom-[40%] right-[45%]",
  },
  // Adding more icons for a richer background
  {
    icon: Si.SiPython,
    color: "#3776AB",
    size: 46,
    position: "top-[50%] left-[10%] hidden sm:block",
  },
  {
    icon: Si.SiJavascript,
    color: "#F7DF1E",
    size: 34,
    position: "top-[60%] right-[10%] hidden sm:block",
  },
  {
    icon: Si.SiDocker,
    color: "#2496ED",
    size: 40,
    position: "bottom-[60%] left-[60%] hidden sm:block",
  },
  {
    icon: Si.SiGo,
    color: "#00ADD8",
    size: 36,
    position: "bottom-[10%] left-[40%] hidden sm:block",
  },
  {
    icon: Si.SiVuedotjs,
    color: "#4FC08D",
    size: 42,
    position: "top-[5%] right-[40%] hidden sm:block",
  },
  {
    icon: Si.SiRust,
    color: "#000000",
    size: 38,
    position: "bottom-[35%] right-[10%] hidden sm:block",
  },
  {
    icon: Si.SiGraphql,
    color: "#E10098",
    size: 32,
    position: "top-[35%] left-[5%] hidden sm:block",
  },
  {
    icon: Si.SiKubernetes,
    color: "#326CE5",
    size: 44,
    position: "bottom-[5%] right-[30%] hidden sm:block",
  },
];

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 md:p-6">
      {/* Animated background icons - now with improved visibility and varied animations */}
      {backgroundIcons.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute opacity-10 dark:opacity-15 ${item.position} z-0`}
          animate={{
            y: [
              0,
              index % 3 === 0 ? -20 : -10,
              0,
              index % 3 === 0 ? 20 : 10,
              0,
            ],
            x: [
              0,
              index % 2 === 0 ? 15 : -15,
              0,
              index % 2 === 0 ? -15 : 15,
              0,
            ],
            rotate: [
              0,
              index % 4 === 0 ? 15 : -15,
              0,
              index % 4 === 0 ? -15 : 15,
              0,
            ],
            scale: [
              1,
              index % 5 === 0 ? 1.1 : 1,
              1,
              index % 5 === 0 ? 0.9 : 1,
              1,
            ],
          }}
          transition={{
            duration: 8 + (index % 7),
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <item.icon size={item.size} color={item.color} />
        </motion.div>
      ))}

      {/* Flying logos in the foreground */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
        {backgroundIcons.slice(0, 10).map((icon, i) => {
          // Use deterministic values instead of random
          const size = 20 + (i % 3) * 10;
          const duration = 15 + (i % 5) * 5;
          const delay = i * 0.7;
          const startX = (i * 7) % 100;
          const startY = 110 + (i % 3) * 5;
          const endY = -20 - (i % 4) * 5;
          const moveX = i % 2 === 0 ? 70 : -70;

          return (
            <motion.div
              key={`floating-${i}`}
              className="absolute"
              style={{
                left: `${startX}%`,
                top: `${startY}%`,
              }}
              animate={{
                top: `${endY}%`,
                rotate: [0, 360],
                x: [0, moveX, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "linear",
              }}
            >
              <icon.icon
                size={size}
                color={icon.color}
                className="opacity-30 dark:opacity-40" /* Increased opacity for better visibility */
              />
            </motion.div>
          );
        })}
      </div>

      {/* Animated background glow */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute left-1/4 top-1/4 size-64 md:size-96 rounded-full bg-blue-500/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-1/4 bottom-1/4 size-64 md:size-96 rounded-full bg-purple-500/20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <Card className="relative w-full max-w-md overflow-hidden border-0 bg-background/80 px-4 py-5 sm:p-6 backdrop-blur-sm">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
          animate={{
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="relative flex flex-col items-center gap-5 sm:gap-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl sm:text-5xl font-bold text-transparent">
              DevMatch
            </h1>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <p className="text-muted-foreground text-center text-sm sm:text-base px-1">
              Find your perfect tech stack match. Start swiping to discover your
              ideal development tools.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Link href="/swipe" className="w-full block sm:inline-block">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] w-full sm:w-auto"
              >
                Start Swiping
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex justify-center gap-3 pt-3 sm:pt-4"
          >
            {[
              Si.SiReact,
              Si.SiTypescript,
              Si.SiNextdotjs,
              Si.SiTailwindcss,
            ].map((Icon, i) => (
              <Icon
                key={i}
                className="text-muted-foreground opacity-50 hover:opacity-100 transition-opacity size-5 sm:size-6"
              />
            ))}
          </motion.div>
        </div>
      </Card>
    </main>
  );
}
