import { db } from "@/lib/db";
import PublicLayout from "@/components/layout/PublicLayout";
import { ChevronRight, Briefcase, Globe, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getIndustryData() {
  try {
    const partners = await db.company.findMany({
      include: {
        university: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    return partners;
  } catch (error) {
    console.error("Error fetching industry partners:", error);
    return [];
  }
}

export default async function IndustryPage() {
  const t = await getTranslations("Industry");
  const partners = await getIndustryData();

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
              <span className="text-slate-600">{t("hero.breadcrumbs.industry")}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tighter">
              {t("hero.title")} <span className="text-blue-600">{t("hero.titleAccent")}</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl leading-relaxed">
              {t("hero.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {partners.length === 0 ? (
          <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-slate-100">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-blue-900">{t("noResults")}</h3>
            <p className="text-slate-500 mt-2">{t("noResultsSub")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {partners.map((partner) => (
              <div 
                key={partner.id}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col items-center text-center space-y-6"
              >
                <div className="w-full aspect-video relative flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                  {partner.image_url ? (
                    <img src={partner.image_url} alt={partner.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                      <Briefcase className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-blue-900 group-hover:text-blue-600 transition-colors">{partner.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{partner.sector || t("defaultSector")}</p>
                </div>
                
                <div className="pt-4 border-t border-slate-50 w-full flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("hubLabel")}</span>
                    <span className="text-xs font-bold text-blue-600">{partner.university.short_code}</span>
                  </div>
                  {partner.website && (
                    <Button asChild variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 rounded-lg font-bold gap-2">
                      <a href={partner.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-3 h-3" />
                        {t("website")}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
