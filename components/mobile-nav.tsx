"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, HomeIcon, RotateCcw, Info, X } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/swipe", label: "Start Swiping", icon: RotateCcw },
    { href: "/about", label: "About", icon: Info },
  ];

  // Close the menu when navigating to a new page
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex w-60 flex-col p-0">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-sm font-bold text-white">DM</span>
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                DevMatch
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="flex flex-col gap-1 p-4">
            <AnimatePresence>
              {links.map((link, i) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link href={link.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className={`w-full justify-start gap-2 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-purple-600"
                            : ""
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </Button>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
