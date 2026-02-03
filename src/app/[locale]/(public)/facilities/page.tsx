import { db } from "@/lib/db";
import PublicLayout from "@/components/layout/PublicLayout";
import { ChevronRight, MapPin, Building2, Microscope } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";

async function getFacilitiesData() {
  try {
    const facilities = await db.facility.findMany({
      include: {
        university: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    return facilities;
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return [];
  }
}

export default async function FacilitiesPage() {
  const t = await getTranslations("Facilities");
  const facilities = await getFacilitiesData();

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
              <span className="text-slate-600">{t("hero.breadcrumbs.facilities")}</span>
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
        {facilities.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-sm border border-slate-100">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
              <Microscope className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-blue-950">{t("noResults")}</h3>
            <p className="text-slate-500 mt-2">{t("noResultsSub")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility) => (
              <div 
                key={facility.id}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={facility.image_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"}
                    alt={facility.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Glass Overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/20 backdrop-blur-md border-t border-white/30">
                    <div className="flex items-center gap-2 text-white">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-widest">{facility.university.short_code}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-4 flex-1">
                  <h3 className="text-xl font-black text-blue-950 leading-tight group-hover:text-blue-600 transition-colors">
                    {facility.name}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                    {facility.description || t("defaultDescription")}
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Building2 className="w-3 h-3" />
                    {facility.location || t("defaultLocation")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
