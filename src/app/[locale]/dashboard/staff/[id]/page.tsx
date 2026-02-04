import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import React from "react";
import { ArrowLeft, PlusCircle, FlaskConical, User as UserIcon, Mail, Phone, Building2 } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./research-columns"; // Columns for staff's research projects
import ProjectForm from "@/components/research/ProjectForm"; // Project form for adding/editing
import { getResearchProjectsByStaffId } from "@/actions/research"; // New action to fetch staff's projects
import { getExternalPartners } from "@/actions/data-actions"; // To get partners for the form

export default async function StaffDetailsPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const t = await getTranslations("Staff");
  const tResearch = await getTranslations("Research");

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  const staffMember = await db.staff.findUnique({
    where: { id: params.id },
    include: {
      university: true,
    },
  });

  if (!staffMember) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] p-4 space-y-4 w-full max-w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">
            Staff Details
          </h2>
          <Link
            href="/dashboard/staff"
            className="inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-3 w-3 mr-2" />
            Back to Staff List
          </Link>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden p-20 text-center">
          <h2 className="text-2xl font-black text-slate-900">Staff not found</h2>
          <p className="text-slate-500 mt-2">The staff member you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  // Authorization check for viewing staff details
  if (user.role !== Role.super_admin && staffMember.university_id !== user.universityId) {
    return <div className="p-10 text-center text-red-500 font-bold">Access Denied</div>;
  }

  const staffProjects = await getResearchProjectsByStaffId(params.id);
  const partnersList = await getExternalPartners();

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-4 space-y-4 w-full max-w-full">
      {/* Header (Outside Card) */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
          Staff Profile: {staffMember.name}
        </h2>
        <Link
          href="/dashboard/staff"
          className="inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-3 w-3 mr-2" />
          Back to Staff List
        </Link>
      </div>

      {/* Staff Profile Card */}
      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Left: Branding */}
            <div className="p-10 bg-slate-50/50 border-r border-slate-100 flex flex-col items-center md:items-start text-center md:text-left gap-6 min-w-[300px]">
              <Avatar className="h-24 w-24 rounded-3xl border-4 border-white shadow-xl">
                <AvatarImage src={staffMember.image_url || ""} alt={staffMember.name} />
                <AvatarFallback className="bg-blue-600 text-white text-3xl font-black">
                  {staffMember.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{staffMember.name}</h2>
                <p className="text-sm text-slate-500 mt-1">{staffMember.position}</p>
                <p className="text-xs text-slate-400">{staffMember.department}</p>
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
                  {staffMember.email || "N/A"}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Phone Number</span>
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  {staffMember.phone || "N/A"}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">University</span>
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  {staffMember.university?.name || "N/A"}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Faculty</span>
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  {staffMember.faculty || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Research Projects Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Research Projects</h2>
            <Badge variant="outline" className="ml-2 rounded-full px-3 py-0.5 text-[10px] font-black border-slate-200 text-slate-500">
              {staffProjects.length} Projects
            </Badge>
          </div>
          {(user.role === Role.super_admin || user.role === Role.data_entry) && (
            <ProjectForm
              universityId={user.universityId || ""}
              staffList={[staffMember]} // Pre-select current staff member
              partnersList={partnersList}
              trigger={
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 gap-2"
                >
                  <PlusCircle className="h-5 w-5" />
                  Add Project
                </Button>
              }
            />
          )}
        </div>

        {staffProjects.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
              <FlaskConical className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{tResearch("list.noResults")}</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto font-medium">{tResearch("list.noResultsSub")}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <DataTable
              columns={columns as any}
              data={staffProjects as any}
            />
          </div>
        )}
      </div>
    </div>
  );
}
