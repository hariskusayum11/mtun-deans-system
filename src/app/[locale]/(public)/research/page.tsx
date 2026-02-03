import { db } from "@/lib/db";
import PublicLayout from "@/components/layout/PublicLayout";
import { ChevronRight, FlaskConical, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { truncateText } from "@/lib/utils";

async function getResearchData() {
  try {
    const projects = await db.researchProject.findMany({
      include: {
        staff: {
          include: {
            university: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    return projects;
  } catch (error) {
    console.error("Error fetching research projects:", error);
    return [];
  }
}

export default async function ResearchPage() {
  const t = await getTranslations("Research.page");
  const projects = await getResearchData();

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
              <span className="text-slate-600">{t("hero.breadcrumbs.research")}</span>
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
        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-slate-100">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
              <FlaskConical className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-blue-900">{t("noResults")}</h3>
            <p className="text-slate-500 mt-2">{t("noResultsSub")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col md:flex-row items-center gap-8"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className="bg-slate-50 border-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                      {project.status || t("defaultStatus")}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-blue-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {project.description || t("defaultDescription")}
                  </p>
                </div>
                
                <div className="w-full md:w-64 pt-6 md:pt-0 md:pl-8 md:border-l border-slate-50 flex flex-col justify-center space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("leadResearcher")}</p>
                    <p className="text-sm font-bold text-blue-900">{project.staff?.name || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("university")}</p>
                    <p className="text-xs font-bold text-blue-600">{project.staff?.university?.short_code || "MTUN"}</p>
                  </div>
                  <Link href={`/research/${project.id}`} className="inline-flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest group/link">
                    {t("viewDetails")} <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
