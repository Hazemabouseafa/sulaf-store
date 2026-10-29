"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Preloader } from "@/components/motion/Preloader";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { LiveVisualEditor } from "@/components/live-editor/LiveVisualEditor";

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  return (
    <>
      {/* 8-Petal Rosette Blooming Preloader for Storefront */}
      <Preloader />

      {/* Global Storefront Navbar */}
      <Navbar />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Storefront Page Content with Soothing Silk Route Entrance Transition */}
      <div className="flex-1 flex flex-col w-full relative">
        <AnimatePresence mode="wait" initial={true}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: 0.42,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex-1 flex flex-col w-full"
          >
            <main className="flex-1 w-full">{children}</main>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Global Brand Footer */}
      <Footer />

      {/* Live In-Context Visual Editor for Storefront Texts & Hyperlinks */}
      <LiveVisualEditor />
    </>
  );
}
