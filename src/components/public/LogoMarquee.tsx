"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoMarqueeProps {
  logos: {
    src: string;
    alt: string;
  }[];
}

export default function LogoMarquee({ logos }: LogoMarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    // The CSS animation will handle the scrolling, no need for manual JS animation loop
    // Ensure the `animate-marquee` class is defined in `tailwind.config.js`
  }, [logos]);

  return (
    <div className="relative w-full overflow-hidden py-8 bg-gray-100 no-print">
      <div
        ref={marqueeRef}
        className="flex space-x-12 animate-marquee group" // Added group for hover effects
      >
        {/* Duplicate logos to ensure seamless loop */}
        {[...logos, ...logos].map((logo, index) => (
          <div key={index} className="flex-shrink-0 flex items-center justify-center h-16 w-32 transition-all duration-300 grayscale group-hover:grayscale-0 hover:!grayscale-0">
            {logo.src ? (
              <Image
                src={logo.src}
                alt={logo.alt}
                width={100}
                height={50}
                className="object-contain"
              />
            ) : (
              <span className="text-xl font-bold text-gray-700">{logo.alt}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
