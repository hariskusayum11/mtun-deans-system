import { db } from "@/lib/db";
import PublicLayout from "@/components/layout/PublicLayout";
import { ChevronRight, Calendar, Newspaper, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

async function getNewsData() {
  try {
    // Using IndustryActivity as a proxy for news/events
    const news = await db.industryActivity.findMany({
      include: {
        university: true,
        company: true
      },
      orderBy: {
        date: 'desc'
      }
    });
    return news;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export default async function NewsPage() {
  const t = await getTranslations("News");
  const newsItems = await getNewsData();
  const featuredNews = newsItems[0];
  const recentNews = newsItems.slice(1);

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* Glass Hero Banner */}
      <section className="w-full py-20 bg-white/60 backdrop-blur-xl border-b border-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#E0F2FE,transparent)] opacity-40" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="space-y-4">
            <nav className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-400">
              <Link href="/" className="hover:text-blue-600 transition-colors">{t("hero.breadcrumbs.home")}</Link>
              <ChevronRight className="h-3 w-3 mx-2" />
              <span className="text-slate-600">{t("hero.breadcrumbs.news")}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-black text-blue-950 tracking-tighter">
              {t("hero.title")} <span className="text-blue-600">{t("hero.titleAccent")}</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl leading-relaxed">
              {t("hero.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        
        {newsItems.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-sm border border-slate-100">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
              <Newspaper className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-blue-950">{t("noResults")}</h3>
            <p className="text-slate-500 mt-2">{t("noResultsSub")}</p>
          </div>
        ) : (
          <>
            {/* Featured News */}
            {featuredNews && (
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-lg border border-slate-100 flex flex-col lg:flex-row gap-12 items-center group hover:border-blue-200 transition-all">
                <div className="w-full lg:w-1/2 aspect-video relative rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop"
                    alt={featuredNews.project_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-blue-600 text-white border-none rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-lg">
                      {t("featuredBadge")}
                    </Badge>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="flex items-center gap-3 text-xs font-bold text-blue-600 uppercase tracking-widest">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredNews.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-blue-950 leading-tight group-hover:text-blue-600 transition-colors">
                    {featuredNews.project_name}
                  </h2>
                  <p className="text-slate-600 text-lg leading-relaxed font-medium">
                    {featuredNews.action || t("defaultAction")}
                  </p>
                  <div className="pt-4">
                    <Link href="#" className="inline-flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest group/link">
                      {t("readFullStory")} <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Recent News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentNews.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col"
                >
                  <div className="relative h-48 w-full mb-8 rounded-2xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
                      alt={item.project_name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 backdrop-blur-md text-blue-600 border-none rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm">
                        {item.university.short_code}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <h3 className="text-xl font-black text-blue-950 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                      {item.project_name}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium">
                      {item.action || "A significant milestone achieved in collaboration with our industry partners."}
                    </p>
                  </div>

                  <div className="pt-8 mt-auto border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("partnerLabel")} {item.company.name}</span>
                    <Link href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
