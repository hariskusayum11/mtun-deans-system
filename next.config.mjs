import createNextIntlPlugin from 'next-intl/plugin';

// ✅ ระบุตำแหน่งไฟล์ i18n.ts ให้ชัดเจน
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", 
      },
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "ouch-cdn2.icons8.com",
      },
      {
        protocol: "https",
        hostname: "icons8.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
