import { db } from "@/lib/db";
import PublicLayout from "@/components/layout/PublicLayout";
import { ChevronRight, GraduationCap, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

async function getStaffData() {
  try {
    // Fetching from Staff model as it contains more academic details
    const staff = await db.staff.findMany({
      include: {
        university: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    return staff;
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
}

export default async function StaffPage() {
  const t = await getTranslations("Staff");
  const staffMembers = await getStaffData();

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* Glass Hero Banner */}
      <section className="w-full py-20 bg-white/60 backdrop-blur-md border-b border-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#E0F2FE,transparent)] opacity-40" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="space-y-4">
            <nav className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-400">
              <Link href="/" className="hover:text-blue-600 transition-colors">{t("hero.breadcrumbs.home")}</Link>
              <ChevronRight className="h-3 w-3 mx-2" />
              <span className="text-slate-600">{t("hero.breadcrumbs.staff")}</span>
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
        {staffMembers.length === 0 ? (
          <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-slate-100">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-blue-900">{t("noResults")}</h3>
            <p className="text-slate-500 mt-2">{t("noResultsSub")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {staffMembers.map((staff) => (
              <div 
                key={staff.id}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all group text-center flex flex-col"
              >
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-blue-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-sm group-hover:border-blue-100 transition-all duration-500">
                    <Image
                      src={staff.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=f1f5f9&color=1e3a8a&size=128`}
                      alt={staff.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-blue-800 p-2 shadow-lg flex items-center justify-center text-white">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-bold text-blue-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {staff.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{staff.position}</p>
                  <div className="pt-2">
                    <Badge variant="outline" className="bg-blue-50 border-blue-100 text-blue-600 text-[9px] font-black uppercase tracking-widest">
                      {staff.university.short_code}
                    </Badge>
                  </div>
                  {staff.email && (
                    <p className="text-[10px] text-slate-400 mt-2 flex items-center justify-center gap-1">
                      <Mail className="w-3 h-3" />
                      {staff.email}
                    </p>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50">
                  <Button asChild variant="ghost" className="w-full text-blue-900 hover:bg-blue-50 rounded-xl font-bold gap-2">
                    <Link href={`/staff/${staff.id}`}>
                      {t("viewProfile")}
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
