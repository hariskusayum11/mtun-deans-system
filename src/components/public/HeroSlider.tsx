"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { cn } from "@/lib/utils";

interface HeroSliderProps {
  slides: {
    image: string;
    alt: string;
    title: string;
    description: string;
    ctaText?: string;
    ctaLink?: string;
  }[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const autoplay = useRef(
    Autoplay(
      { delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }
    )
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  useEffect(() => {
    if (emblaApi) {
      onInit(emblaApi);
      emblaApi.on("select", onSelect);
      emblaApi.on("reInit", onInit);
      emblaApi.on("reInit", onSelect);
    }
  }, [emblaApi, onInit, onSelect]);

  return (
    <div className="relative w-full h-[600px] overflow-hidden no-print">
      <div className="embla__viewport h-full" ref={emblaRef}>
        <div className="embla__container h-full flex">
          {slides.map((slide, index) => (
            <div key={index} className="embla__slide relative flex-[0_0_100%] h-full">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover absolute inset-0 z-0"
                priority={index === 0} // Prioritize loading the first image
                sizes="100vw" // Critical for Next/Image fill layout
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent z-10 flex items-center justify-center text-white">
                <div className="text-center max-w-3xl px-4">
                  <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl font-light mb-8">
                    {slide.description}
                  </p>
                  {slide.ctaText && slide.ctaLink && (
                    <Link href={slide.ctaLink} className="bg-gold-500 hover:bg-gold-600 text-blue-900 font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300">
                      {slide.ctaText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots for navigation */}
      <div className="embla__dots absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={cn(
              "embla__dot w-3 h-3 rounded-full bg-white transition-all duration-300",
              index === selectedIndex ? "w-8 bg-blue-500" : "opacity-50"
            )}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
