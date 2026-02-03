// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css"; // ⚠️ แก้ Path: ถอยหลัง 1 ขั้นเพื่อหาไฟล์ css
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MTUN Deans' System",
  description: "Management dashboard for 4 Technical Universities.",
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 1. ดึงคำศัพท์ของภาษานั้นๆ มาเตรียมไว้
  const messages = await getMessages({ locale }); // Explicitly pass locale to getMessages

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextAuthProvider>
          <NextIntlClientProvider messages={messages}>
            <Toaster position="top-center" />
            {children}
          </NextIntlClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
