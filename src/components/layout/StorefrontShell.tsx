"use client";

import React from "react";
import { usePathname } from "next/navigation";
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

      {/* Storefront Page Content */}
      <main className="flex-1">{children}</main>

      {/* Global Brand Footer */}
      <Footer />

      {/* Live In-Context Visual Editor for Storefront Texts & Hyperlinks */}
      <LiveVisualEditor />
    </>
  );
}
