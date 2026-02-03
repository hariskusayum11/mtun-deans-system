import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// กำหนดภาษาที่รองรับ
const locales = ['en', 'ms'];

export default getRequestConfig(async ({requestLocale}) => {
  // ดึงค่า locale ออกมา (เวอร์ชันใหม่ต้อง await)
  let locale = await requestLocale;

  // ถ้าไม่มีค่าส่งมา ให้ใช้ default เป็น 'en'
  if (!locale || !locales.includes(locale as any)) {
    locale = 'en'; 
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    locale // <--- ⚠️ จุดที่ต้องเพิ่มคือบรรทัดนี้ครับ! ต้องส่งค่า locale กลับไปด้วย
  };
});