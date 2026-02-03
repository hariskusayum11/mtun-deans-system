import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import DashboardAdminClient from "@/components/dashboard/DashboardAdminClient";
import DataEntryDashboardClient from "@/components/dashboard/DataEntryDashboardClient";
import DeanDashboardClient from "@/components/dashboard/DeanDashboardClient";
import { Role, MeetingStatus } from "@prisma/client";
import { Zap } from "lucide-react";
import { startOfYear, endOfYear, startOfDay, endOfDay } from "date-fns";

export default async function DashboardPage() {
  // Removed artificial delay for debugging loading.tsx
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  const t = await getTranslations("Dashboard.fallback");
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  // =========================================================
  // 👑 SUPER ADMIN VIEW
  // =========================================================
  if (user.role === Role.super_admin) {
    let dbStatus = 'Operational';
    let dbColor = 'text-emerald-600';
    
    try {
      await db.user.findFirst();
      
      const totalUniversities = await db.university.count();
      const totalUsers = await db.user.count();
      const activeStaff = await db.user.count({
        where: { role: Role.data_entry }
      });
      
      const allUsers = await db.user.findMany({
        include: { university: true }
      });

      const recentUsers = await db.user.findMany({
        orderBy: { created_at: 'desc' },
        take: 5,
        include: { university: true }
      });

      const uniCounts: Record<string, number> = {};
      allUsers.forEach(u => {
        if (u.role === Role.data_entry && u.university) {
          const code = u.university.short_code;
          uniCounts[code] = (uniCounts[code] || 0) + 1;
        }
      });
      
      const mainUnis = ['UMP', 'UniMAP', 'UTeM', 'UTHM'];
      const staffByUni = mainUnis.map(name => ({
        name,
        staff: uniCounts[name] || 0
      }));

      const roleCounts = {
        [Role.super_admin]: 0,
        [Role.dean]: 0,
        [Role.data_entry]: 0
      };
      allUsers.forEach(u => {
        roleCounts[u.role]++;
      });

      const roleDistribution = [
        { name: 'Super Admin', value: roleCounts[Role.super_admin], color: '#4F46E5' },
        { name: 'Dean', value: roleCounts[Role.dean], color: '#10B981' },
        { name: 'Staff/Data Entry', value: roleCounts[Role.data_entry], color: '#F59E0B' },
      ];

      return (
        <DashboardAdminClient 
          stats={{
            totalUniversities,
            totalUsers,
            activeStaff,
            dbStatus,
            dbColor
          }}
          staffByUni={staffByUni}
          roleDistribution={roleDistribution}
          recentUsers={recentUsers}
        />
      );
    } catch (error) {
      console.error("Dashboard Data Fetch Error:", error);
      return (
        <DashboardAdminClient 
          stats={{
            totalUniversities: 0,
            totalUsers: 0,
            activeStaff: 0,
            dbStatus: 'System Error',
            dbColor: 'text-rose-600'
          }}
          staffByUni={[]}
          roleDistribution={[]}
          recentUsers={[]}
        />
      );
    }
  }

  // =========================================================
  // ⌨️ DATA ENTRY VIEW
  // =========================================================
  if (user.role === Role.data_entry && user.universityId) {
    try {
      const recentStaff = await db.staff.findMany({
        where: { university_id: user.universityId },
        orderBy: { created_at: 'desc' },
        take: 5
      });

      const recentResearch = await db.researchProject.findMany({
        where: { staff: { university_id: user.universityId } },
        orderBy: { created_at: 'desc' },
        take: 5
      });

      const recentMeetings = await db.meeting.findMany({
        where: { university_id: user.universityId },
        orderBy: { date: 'desc' },
        take: 5
      });

      // Combine and sort
      const myTotalSubmissions = await db.meeting.count({
        where: { created_by_id: user.id },
      });

      const myPendingApproval = await db.meeting.count({
        where: { created_by_id: user.id, status: MeetingStatus.PENDING },
      });

      const myApproved = await db.meeting.count({
        where: { created_by_id: user.id, status: MeetingStatus.APPROVED },
      });

      const myNeedsRevision = await db.meeting.count({
        where: { created_by_id: user.id, status: MeetingStatus.REJECTED },
      });

      const university = await db.university.findUnique({
        where: { id: user.universityId },
        select: { name: true, logo_url: true, short_code: true },
      });

      const clientUser = {
        name: user.name || "Staff",
        image: user.image,
        university: university ? {
          name: university.name,
          logo: university.logo_url,
          short_code: university.short_code,
          coverImage: null, // DataEntryDashboardClient doesn't use coverImage, but keeping it consistent with DeanDashboardClient
        } : null,
      };

      const combinedActivity: any[] = [
        ...recentStaff.map(s => ({ id: s.id, type: 'staff', title: s.name, status: 'Active', date: s.created_at })),
        ...recentResearch.map(r => ({ id: r.id, type: 'research', title: r.title, status: r.status || 'Ongoing', date: r.created_at })),
        ...recentMeetings.map(m => ({ id: m.id, type: 'meeting', title: m.title, status: m.status, date: m.date }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

      return (
        <DataEntryDashboardClient 
          user={clientUser}
          stats={{
            myTotalSubmissions,
            myPendingApproval,
            myApproved,
            myNeedsRevision,
          }}
          recentActivity={combinedActivity}
        />
      );
    } catch (error) {
      console.error("Data Entry Dashboard Error:", error);
      return (
        <DataEntryDashboardClient 
          user={{
            name: user.name || "Staff",
            image: user.image,
            university: null,
          }}
          stats={{
            myTotalSubmissions: 0,
            myPendingApproval: 0,
            myApproved: 0,
            myNeedsRevision: 0,
          }}
          recentActivity={[]}
        />
      );
    }
  }

  // =========================================================
  // 🏛️ DEAN VIEW
  // =========================================================
  if (user.role === Role.dean && user.universityId) {
    try {
      const universityId = user.universityId;
      const now = new Date();
      const yearStart = startOfYear(now);
      const yearEnd = endOfYear(now);
      const dayStart = startOfDay(now);
      const dayEnd = endOfDay(now);

      const [
        university,
        pendingApprovalsList,
        activeResearchCount,
        totalStaffCount,
        industryPartnersCount,
        totalMeetingsCount,
        recentMeetings,
        recentResearch,
        meetingsYear,
        upcomingMeetings,
        calendarMeetings
      ] = await Promise.all([
        db.university.findUnique({ 
          where: { id: universityId },
          select: { name: true, logo_url: true, short_code: true }
        }),
        db.meeting.findMany({
          where: { university_id: universityId, status: MeetingStatus.PENDING },
          include: { 
            created_by: { select: { name: true, image: true } },
            university: { select: { name: true } }
          },
          orderBy: { date: 'asc' },
          take: 3
        }),
        db.researchProject.count({
          where: { staff: { university_id: universityId }, status: 'Ongoing' }
        }),
        db.staff.count({
          where: { university_id: universityId }
        }),
        db.company.count({
          where: { university_id: universityId }
        }),
        db.meeting.count({
          where: { university_id: universityId }
        }),
        db.meeting.findMany({
          where: { university_id: universityId },
          orderBy: { date: 'desc' },
          take: 3
        }),
        db.researchProject.findMany({
          where: { staff: { university_id: universityId } },
          orderBy: { created_at: 'desc' },
          take: 2
        }),
        db.meeting.findMany({
          where: { university_id: universityId, date: { gte: yearStart, lte: yearEnd } },
          select: { date: true }
        }),
        db.meeting.findMany({
          where: { 
            university_id: universityId, 
            date: { gte: dayStart, lte: dayEnd },
            status: { in: [MeetingStatus.APPROVED, MeetingStatus.COMPLETED] }
          },
          orderBy: { start_time: 'asc' }
        }),
        db.meeting.findMany({
          where: { university_id: universityId },
          select: { id: true, date: true, title: true, start_time: true, location: true }
        })
      ]);

      const combinedActivity = [
        ...recentMeetings.map(m => ({ id: m.id, type: 'meeting', title: m.title, status: m.status, date: m.date })),
        ...recentResearch.map(r => ({ id: r.id, type: 'research', title: r.title, status: r.status || 'Ongoing', date: r.created_at }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyData = months.map((month, index) => {
        const count = meetingsYear.filter(m => new Date(m.date).getMonth() === index).length;
        return { name: month, value: count };
      });

      // Map to the requested interface
      const clientUser = {
        name: user.name || "Dean",
        image: user.image,
        university: university ? {
          name: university.name,
          logo: university.logo_url,
          short_code: university.short_code,
          coverImage: (university as any).cover_image_url // Assuming this field might exist or be added
        } : null
      };

      return (
        <DeanDashboardClient 
          user={clientUser}
          stats={{
            staffCount: totalStaffCount,
            researchCount: activeResearchCount,
            partnerCount: industryPartnersCount,
            meetingCount: totalMeetingsCount
          }}
          pendingApprovals={pendingApprovalsList}
          monthlyStats={monthlyData}
          upcomingMeetings={upcomingMeetings}
          recentActivity={combinedActivity}
          calendarMeetings={calendarMeetings}
        />
      );
    } catch (error) {
      console.error("Dean Dashboard Error:", error);
    }
  }

  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-black text-slate-900">{t("welcome", { name: user.name || "User" })}</h1>
      <p className="text-slate-500 mt-4 font-medium">{t("description")}</p>
      <div className="mt-10 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20">
        <Zap className="h-5 w-5" />
        {t("cta")}
      </div>
    </div>
  );
}
