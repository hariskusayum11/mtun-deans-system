import { getCompanyById, deleteIndustryActivityAction } from "@/actions/data-actions";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Activity, 
  Mail, 
  Phone, 
  Globe, 
  Building2,
  Trash2,
  Clock,
  User,
  Calendar,
  Pencil
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ActivityFormModal from "@/components/industry/ActivityFormModal";
import { Button } from "@/components/ui/button";

export default async function CompanyActivitiesPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const company = await getCompanyById(params.id);

  if (!company) {
    return (
      <div className="p-20 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Company not found</h2>
        <p className="text-slate-500 mt-2">The company you are looking for does not exist or has been removed.</p>
        <Link href="/dashboard/industry" className="mt-8 inline-flex items-center text-blue-600 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Industry List
        </Link>
      </div>
    );
  }

  const filteredActivities =
    session.user.role === Role.super_admin
      ? company.industry_activities
      : company.industry_activities.filter((activity) => activity.university_id === session.user.universityId);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link 
            href="/dashboard/industry" 
            className="inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-2"
          >
            <ArrowLeft className="h-3 w-3 mr-2" />
            Back to Industry List
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Collaboration History</h1>
          <p className="text-gray-500 font-medium">Detailed profile and activity logs for {company.name}.</p>
        </div>
        <ActivityFormModal companyId={company.id} universityId={session.user.universityId || ""} />
      </div>

      {/* Company Profile Card */}
      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Left: Branding */}
            <div className="p-10 bg-slate-50/50 border-r border-slate-100 flex flex-col items-center md:items-start text-center md:text-left gap-6 min-w-[300px]">
              <Avatar className="h-24 w-24 rounded-3xl border-4 border-white shadow-xl">
                <AvatarImage src={company.image_url || ""} alt={company.name} />
                <AvatarFallback className="bg-blue-600 text-white text-3xl font-black">
                  {company.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{company.name}</h2>
                <Badge className="mt-2 bg-blue-50 text-blue-700 border-blue-100 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                  {company.sector || "General Sector"}
                </Badge>
              </div>
            </div>

            {/* Right: Contact Details */}
            <div className="flex-1 p-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Email Address</span>
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  {company.email || "N/A"}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Phone Number</span>
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  {company.phone || "N/A"}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Website</span>
                <div className="flex items-center gap-3 text-blue-600 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-[200px]">
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  ) : "N/A"}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Address</span>
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="truncate max-w-[200px]">{company.address || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity History Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <Activity className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Activity History</h2>
          <Badge variant="outline" className="ml-2 rounded-full px-3 py-0.5 text-[10px] font-black border-slate-200 text-slate-500">
            {filteredActivities.length} Entries
          </Badge>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
              <Clock className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No activities recorded yet</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto font-medium">Start tracking your collaboration by adding the first activity above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((activity) => (
              <div key={activity.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-start gap-6 flex-1">
                    {/* Date Badge */}
                    <div className="bg-blue-50 text-blue-700 p-3 rounded-2xl font-black text-center min-w-[70px] border border-blue-100 shadow-sm">
                      <div className="text-[10px] uppercase tracking-widest opacity-60">{new Date(activity.date).toLocaleString('default', { month: 'short' })}</div>
                      <div className="text-2xl leading-none mt-1">{new Date(activity.date).getDate()}</div>
                      <div className="text-[10px] opacity-60 mt-1">{new Date(activity.date).getFullYear()}</div>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{activity.project_name}</h3>
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                          activity.status.toLowerCase().includes('complete') ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-blue-50 text-blue-700 border-blue-100"
                        )}>
                          {activity.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <Building2 className="w-3 h-3" />
                          </div>
                          {activity.pic_company}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-400">
                            <User className="w-3 h-3" />
                          </div>
                          {activity.pic_university}
                        </div>
                      </div>

                      {activity.action && (
                        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-sm text-slate-600 font-medium leading-relaxed">
                          {activity.action}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center justify-end gap-2">
                    <div className="flex items-center gap-2">
                      <ActivityFormModal 
                        companyId={company.id} 
                        universityId={session.user.universityId || ""} 
                        initialData={activity}
                        trigger={
                          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                            <Pencil className="h-4 w-4 text-slate-500" />
                          </Button>
                        }
                      />
                      <form action={deleteIndustryActivityAction}>
                        <input type="hidden" name="id" value={activity.id} />
                        <button className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
