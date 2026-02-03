"use client";

import GearLoader from "@/components/ui/GearLoader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <GearLoader size="w-32 h-32" />
    </div>
  );
}
