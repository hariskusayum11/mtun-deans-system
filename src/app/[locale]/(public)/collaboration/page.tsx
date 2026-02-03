import { db } from "@/lib/db";
import PublicLayout from "@/components/layout/PublicLayout";
import { ChevronRight, Handshake, ArrowRight, Building2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

async function getCollaborationData() {
  try {
    const collaborations = await db.researchProject.findMany({
      where: {
        collaborators: {
          some: {} // Projects that have at least one collaborator
        }
      },
      include: {
        collaborators: true,
        staff: {
          include: {
            university: true
          }
        }
      },
      orderBy: {
        updated_at: 'desc'
      }
    });
    return collaborations;
  } catch (error) {
    console.error("Error fetching collaborations:", error);
    return [];
  }
}

export default async function CollaborationPage() {
  const t = await getTranslations("Collaboration");
  const collaborations = await getCollaborationData();

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
              <span className="text-slate-600">{t("hero.breadcrumbs.collaboration")}</span>
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
      <main className="max-w-7xl mx-auto px-6 py-16">
        {collaborations.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-sm border border-slate-100">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
              <Handshake className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-blue-950">{t("noResults")}</h3>
            <p className="text-slate-500 mt-2">{t("noResultsSub")}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {collaborations.map((project) => (
              <div 
                key={project.id}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col md:flex-row items-center gap-8"
              >
                {/* Left: Partner Info */}
                <div className="w-full md:w-48 shrink-0 flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 rounded-2xl bg-slate-50 p-4 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500 shadow-inner">
                    <Building2 className="w-10 h-10 text-slate-400 group-hover:text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("partnerLabel")}</p>
                    <p className="text-sm font-bold text-blue-950">{project.collaborators[0]?.name || t("defaultPartner")}</p>
                  </div>
                </div>

                {/* Middle: Project Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                      {project.status || t("defaultStatus")}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• {project.staff.university.short_code}</span>
                  </div>
                  <h3 className="text-2xl font-black text-blue-950 leading-tight group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                    {project.description || t("defaultDescription")}
                  </p>
                </div>

                {/* Right: Action */}
                <div className="shrink-0">
                  <Button asChild variant="ghost" className="rounded-full w-12 h-12 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                    <Link href={`/research/${project.id}`}>
                      <ArrowRight className="w-6 h-6" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
