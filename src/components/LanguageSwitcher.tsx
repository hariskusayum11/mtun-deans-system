'use client';

import { useState, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  // ✅ ใช้รูปภาพธงจาก CDN แทน Emoji (แสดงผลได้ทุกเครื่อง)
  const languages = [
    { 
      code: 'en', 
      label: 'English', 
      flagUrl: 'https://flagcdn.com/w40/gb.png', // ธงอังกฤษ
      short: 'EN' 
    },
    { 
      code: 'ms', 
      label: 'Bahasa Melayu', 
      flagUrl: 'https://flagcdn.com/w40/my.png', // ธงมาเลเซีย
      short: 'MS' 
    },
  ];

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  const handleSelect = (nextLocale: string) => {
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="relative z-50">
      {/* --- ปุ่มกดหลัก (Trigger) : ปรับให้เล็กและสวยขึ้น --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={cn(
          // ปรับ padding ให้น้อยลง (px-2 py-1.5) เพื่อความกะทัดรัด
          "flex items-center gap-1.5 px-2 py-1.5 rounded-full transition-all duration-200",
          "bg-white/70 hover:bg-white/90 border border-slate-200/60 backdrop-blur-md shadow-sm", 
          "text-slate-700 font-bold text-[11px] uppercase tracking-wider", // ลดขนาดตัวอักษร
          isOpen && "bg-white ring-1 ring-blue-200 border-blue-300"
        )}
      >
        {/* แสดงรูปธงวงกลมเล็กๆ ที่ปุ่ม */}
        <img 
          src={currentLang.flagUrl} 
          alt={currentLang.label} 
          className="w-4 h-4 rounded-full object-cover shadow-sm"
        />
        <span>{currentLang.short}</span>
        <ChevronDown 
          className={cn(
            "w-3 h-3 text-slate-400 transition-transform duration-300",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* --- Backdrop --- */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsOpen(false)} />
      )}

      {/* --- เมนู Dropdown --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-44 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-100/80 overflow-hidden z-50"
          >
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={cn(
                    "w-full px-3 py-2.5 flex items-center justify-between text-sm transition-colors",
                    "hover:bg-blue-50/50",
                    locale === lang.code ? "text-blue-700 bg-blue-50 font-medium" : "text-slate-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* แสดงรูปธงใน Dropdown */}
                    <img 
                      src={lang.flagUrl} 
                      alt={lang.label} 
                      className="w-5 h-5 rounded-full object-cover shadow-sm border border-slate-100"
                    />
                    <span>{lang.label}</span>
                  </div>
                  {locale === lang.code && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}