/* eslint-disable react/no-unescaped-entities */
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Fingerprint,
  Flame,
  Heart,
  Code,
  Lightbulb,
  MoveRight,
  HandHeart,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import * as Si from "react-icons/si";

const features = [
  {
    title: "Discover Your Perfect Stack",
    description:
      "Swipe through popular technologies and frameworks to discover what resonates with your preferences and needs.",
    icon: Lightbulb,
  },
  {
    title: "Smart Recommendations",
    description:
      "Our algorithm analyzes your likes to recommend the perfect tech stack combination tailored to your preferences.",
    icon: Flame,
  },
  {
    title: "Filter by Category",
    description:
      "Focus on specific areas like frontend, backend, databases, or cloud technologies to find exactly what you need.",
    icon: Fingerprint,
  },
  {
    title: "Interactive Card UI",
    description:
      "Fluid, intuitive interface with detailed information about each technology at your fingertips.",
    icon: HandHeart,
  },
  {
    title: "Personalized Results",
    description:
      "Get a complete breakdown of your tech preferences by category, helping you understand your development style.",
    icon: Sparkles,
  },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = React.useState("about");

  return (
    <div className="container mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-3xl"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
              About DevMatch
            </h1>
          </motion.div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Find your perfect tech stack with a fun, swipeable interface.
            DevMatch helps developers discover technologies that resonate with
            their preferences.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="border-b p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 h-9">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="how">How It Works</TabsTrigger>
                <TabsTrigger value="tech">Technology</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="p-6">
            {activeTab === "about" && (
              <div className="space-y-4">
                <p>
                  DevMatch is a playful, interactive tool designed to help
                  developers discover their ideal tech stack through a familiar
                  swipe-based interface. Whether you're exploring new
                  technologies or trying to find the perfect combination for
                  your next project, DevMatch makes the process fun and
                  engaging.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-4">
                  Key Features
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                      className="flex gap-3 rounded-lg border p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{feature.title}</h4>
                        <p className="text-muted-foreground text-sm mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <Link href="/swipe">
                    <Button size="lg" className="gap-2">
                      Start Swiping <MoveRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "how" && (
              <div className="space-y-5">
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      1
                    </span>
                    <span>Start Swiping</span>
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Browse through a curated collection of technologies. Swipe
                    right for the ones you like and left for those you
                    don&apos;t. Each card contains important information about
                    the technology.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      2
                    </span>
                    <span>Filter Your Options</span>
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Use the category filters to focus on specific areas of
                    interest like frontend frameworks, backend technologies,
                    databases, or cloud services.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      3
                    </span>
                    <span>Get Your Match</span>
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    After swiping through technologies, our algorithm analyzes
                    your preferences to recommend your ideal tech stack. Your
                    result will show compatible technologies that work well
                    together based on your likes.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      4
                    </span>
                    <span>Explore Your Breakdown</span>
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    View a detailed breakdown of your preferences by category.
                    This helps you understand your development style and what
                    types of technologies you gravitate towards.
                  </p>
                </div>

                <div className="mt-8 flex justify-center">
                  <Link href="/swipe">
                    <Button size="lg" className="gap-2">
                      Try It Now <Heart className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "tech" && (
              <div className="space-y-6">
                <p>
                  DevMatch is built with modern web technologies, providing a
                  smooth, responsive experience across devices. Here&apos;s what
                  powers our application:
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-3 rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Si.SiNextdotjs className="h-8 w-8" />
                      <div>
                        <h4 className="font-medium">Next.js 15</h4>
                        <p className="text-muted-foreground text-sm">
                          React framework with App Router
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Si.SiTailwindcss className="h-8 w-8 text-[#06B6D4]" />
                      <div>
                        <h4 className="font-medium">Tailwind CSS</h4>
                        <p className="text-muted-foreground text-sm">
                          Utility-first CSS framework
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Code className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-medium">Shadcn UI</h4>
                        <p className="text-muted-foreground text-sm">
                          Beautifully designed components
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Si.SiFramer className="h-8 w-8 text-[#0055FF]" />
                      <div>
                        <h4 className="font-medium">Framer Motion</h4>
                        <p className="text-muted-foreground text-sm">
                          Animation and gesture library
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Si.SiTypescript className="h-8 w-8 text-[#3178C6]" />
                      <div>
                        <h4 className="font-medium">TypeScript</h4>
                        <p className="text-muted-foreground text-sm">
                          Type-safe JavaScript
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Si.SiReact className="h-8 w-8 text-[#61DAFB]" />
                      <div>
                        <h4 className="font-medium">React 19</h4>
                        <p className="text-muted-foreground text-sm">
                          UI component library
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg border bg-muted/50 p-4">
                  <h4 className="font-medium">Local Data Storage</h4>
                  <p className="text-muted-foreground mt-1">
                    DevMatch uses client-side data only with localStorage to
                    save your preferences, ensuring a seamless and private
                    experience without requiring any backend services.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16 text-center"
      >
        <div className="flex items-center justify-center space-x-1">
          <span className="text-muted-foreground">Made with</span>
          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          <span className="text-muted-foreground">by</span>
          <Link
            href="https://khyaatikhanna.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-primary transition-colors"
          >
            Khyaati Khanna
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </motion.footer>
    </div>
  );
}
