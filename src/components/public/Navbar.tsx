"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { GraduationCap, Lock, Menu, X } from "lucide-react"; // Using GraduationCap and Lock icons
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("Nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("about"), href: "/about" },
    { name: t("research"), href: "/research" },
    { name: t("industry"), href: "/industry" },
    { name: t("facilities"), href: "/facilities" },
    { name: t("news"), href: "/news" },
  ];

  return (
    <>
      {/* Top Bar - Language Switcher */}
      <div className="bg-blue-900 text-white text-sm py-2 px-4 flex justify-end items-center no-print">
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={cn(
          "sticky top-0 z-50 w-full py-4 transition-all duration-300 no-print",
          scrolled ? "shadow-lg backdrop-blur-md bg-white/80" : "bg-white"
        )}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-800 mr-2" />
            <span className="text-xl font-bold text-blue-800">{t("portalName")}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-700 hover:text-blue-600 font-medium">
                {link.name}
              </Link>
            ))}
            <Link
              href="/login"
              className="flex items-center space-x-2 border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md transition-colors font-medium"
            >
              <Lock className="h-5 w-5" />
              <span>{t("staffPortal")}</span>
            </Link>
          </div>

          {/* Mobile Navigation (Sheet) */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-blue-800">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <div className="flex flex-col h-full bg-white">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <GraduationCap className="h-6 w-6 text-blue-800 mr-2" />
                      <span className="text-lg font-bold text-blue-800">{t("portalName")}</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto py-6 px-6 space-y-4">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href} 
                        className="block text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                  <div className="p-6 border-t border-gray-100">
                    <Link
                      href="/login"
                      className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20"
                    >
                      <Lock className="h-5 w-5" />
                      <span>{t("staffPortal")}</span>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
}
