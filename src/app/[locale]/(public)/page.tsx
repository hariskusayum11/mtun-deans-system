import HomeClient from "@/components/public/HomeClient";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";

export default async function PublicPage() {
  const t = await getTranslations("Home.research.areas");
  // Fetch data for the landing page
  const [staffCount, researchCount, partnerCount, featuredStaff, partners, latestNews] = await Promise.all([
    db.staff.count(),
    db.researchProject.count(),
    db.externalPartner.count(),
    db.staff.findMany({
      take: 4,
      include: { university: true },
    }),
    db.externalPartner.findMany({
      take: 10,
    }),
    db.industryActivity.findMany({
      take: 3,
      include: { university: true },
      orderBy: { date: 'desc' }
    })
  ]);

  const data = {
    stats: {
      staff: staffCount,
      research: researchCount,
      partners: partnerCount,
    },
    featuredStaff: featuredStaff.map(s => ({
      id: s.id,
      name: s.name,
      position: s.position,
      image_url: s.image_url,
      university: {
        short_code: s.university.short_code
      }
    })),
    partners: partners.map(p => ({
      name: p.name,
      image_url: null 
    })),
    latestNews: latestNews.map(n => ({
      id: n.id,
      title: n.project_name,
      date: n.date.toISOString(),
      type: 'industry',
    })),
    researchAreas: [
      { title: t("ai"), icon: "FlaskConical" },
      { title: t("energy"), icon: "FlaskConical" },
      { title: t("manufacturing"), icon: "FlaskConical" },
      { title: t("materials"), icon: "FlaskConical" },
    ],
  };

  return <HomeClient data={data} />;
}
