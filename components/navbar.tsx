"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { HomeIcon, RotateCcw, Info } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/swipe", label: "Start Swiping", icon: RotateCcw },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-background/80 px-4 backdrop-blur-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
            <span className="text-sm font-bold text-white">DM</span>
          </div>
          <span className="hidden bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent sm:inline-block">
            DevMatch
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex md:items-center md:gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative gap-1 px-3 text-sm ${
                    isActive ? "font-medium" : "font-normal"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                      layoutId="navbar-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Khannakhushi/devmatch"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80"
          >
            <SiGithub className="h-5 w-5" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
