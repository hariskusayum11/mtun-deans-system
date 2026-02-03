"use client";

import React from "react";
import PublicNavbar from "./PublicNavbar";
import Footer from "@/components/public/Footer";
import BackgroundOrbs from "@/components/public/BackgroundOrbs";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <BackgroundOrbs />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNavbar />
        <main className="flex-1 pt-24 md:pt-32">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
