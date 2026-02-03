import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // ภาษาทั้งหมดที่รองรับ
  locales: ['en', 'ms'],
  
  // ภาษาหลัก (ถ้าไม่ระบุภาษาจะใช้อันนี้)
  defaultLocale: 'en',
  
  // บังคับให้มีภาษาใน URL เสมอ เช่น /en/about
  localePrefix: 'always' 
});

// สร้างฟังก์ชัน Link, redirect, usePathname, useRouter แบบรองรับภาษา
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);