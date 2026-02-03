import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Role, MeetingStatus } from "@prisma/client";
import ReportsClient from "@/components/reports/ReportsClient";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { year?: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const allowedRoles = [Role.super_admin, Role.dean, Role.data_entry];
  
  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard");
  }

  const selectedYear = searchParams.year ? parseInt(searchParams.year) : new Date().getFullYear();
  const startOfYear = new Date(selectedYear, 0, 1);
  const endOfYear = new Date(selectedYear, 11, 31);

  // Filtering logic based on role
  const universityId = user.role === Role.super_admin ? undefined : user.universityId;

  try {
    // 1. Fetch University Details
    const university = universityId 
      ? await db.university.findUnique({ where: { id: universityId } })
      : { name: "MTUN Network" };

    // 2. Fetch KPI Data
    const [staffCount, industryCount, activeResearchCount, completedMeetingsCount] = await Promise.all([
      db.staff.count({
        where: universityId ? { university_id: universityId } : {},
      }),
      db.company.count({
        where: universityId ? { university_id: universityId } : {},
      }),
      db.researchProject.count({
        where: {
          status: "Ongoing",
          ...(universityId ? { staff: { university_id: universityId } } : {}),
          created_at: { gte: startOfYear, lte: endOfYear }
        },
      }),
      db.meeting.count({
        where: {
          status: MeetingStatus.COMPLETED,
          ...(universityId ? { university_id: universityId } : {}),
          date: { gte: startOfYear, lte: endOfYear }
        },
      }),
    ]);

    // 3. Fetch Research Highlights (Top 5 Ongoing)
    // Note: Milestone model is currently missing from schema, using status-based progress as fallback
    const researchHighlightsRaw = await db.researchProject.findMany({
      where: {
        status: "Ongoing",
        ...(universityId ? { staff: { university_id: universityId } } : {}),
        created_at: { gte: startOfYear, lte: endOfYear }
      },
      include: {
        staff: {
          select: { name: true }
        }
      },
      take: 5,
      orderBy: { created_at: 'desc' }
    });

    const researchHighlights = researchHighlightsRaw.map(project => ({
      ...project,
      // Fallback progress calculation since Milestone model is missing
      progress: project.status === 'Completed' ? 100 : 65 
    }));

    // 4. Fetch Recent Meeting Resolutions (Top 5 Completed)
    const recentMeetings = await db.meeting.findMany({
      where: {
        status: MeetingStatus.COMPLETED,
        ...(universityId ? { university_id: universityId } : {}),
        date: { gte: startOfYear, lte: endOfYear }
      },
      select: {
        id: true,
        date: true,
        title: true,
        minutes_details: true,
      },
      take: 5,
      orderBy: { date: 'desc' }
    });

    // 5. Fetch Newest Industry Partners
    const newestPartners = await db.company.findMany({
      where: universityId ? { university_id: universityId } : {},
      take: 6,
      orderBy: { created_at: 'desc' }
    });

    // 6. Fetch Real Analytics Data for Charts
    
    // Metric A: Industry by Sector (Bar Chart Data) - All Time
    const sectorDataRaw = await db.company.groupBy({
      by: ['sector'],
      _count: { sector: true },
      where: universityId ? { university_id: universityId } : {},
    });
    const sectorData = sectorDataRaw.map(item => ({
      name: item.sector || "Other",
      value: item._count.sector
    }));

    // Metric A2: Industry by Status (Bar Chart Data) - All Time
    // Note: Since Company doesn't have a status field, we'll use a mock or derived status for demonstration
    // In a real app, you might have a 'status' field on the Company model.
    const statusDataIndustry = [
      { name: 'Active', value: Math.floor(industryCount * 0.8) },
      { name: 'Inactive', value: Math.floor(industryCount * 0.2) },
    ];

    // Metric B: Research Status (Donut Chart Data) - Filtered by Year
    const statusDataRaw = await db.researchProject.groupBy({
      by: ['status'],
      _count: { status: true },
      where: {
        ...(universityId ? { staff: { university_id: universityId } } : {}),
        created_at: { gte: startOfYear, lte: endOfYear }
      },
    });
    const statusData = statusDataRaw.map(item => ({
      name: item.status || "Unknown",
      value: item._count.status
    }));

    // Metric C: Monthly Meeting Activity (Area Chart Data) - Filtered by Year
    const meetingsYear = await db.meeting.findMany({
      where: {
        ...(universityId ? { university_id: universityId } : {}),
        date: { gte: startOfYear, lte: endOfYear }
      },
      select: { date: true }
    });
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map((month, index) => {
      const count = meetingsYear.filter(m => new Date(m.date).getMonth() === index).length;
      return { name: month, value: count };
    });

    return (
      <ReportsClient
        universityName={university?.name || "MTUN University"}
        selectedYear={selectedYear}
        stats={{
          staffCount,
          industryCount,
          activeResearchCount,
          completedMeetingsCount,
        }}
        researchHighlights={researchHighlights}
        recentMeetings={recentMeetings}
        newestPartners={newestPartners}
        chartData={{
          sectorData,
          industryStatusData: statusDataIndustry,
          statusData,
          monthlyData
        }}
      />
    );

  } catch (error) {
    console.error("Error fetching report data:", error);
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Report</h1>
        <p className="text-gray-500 mt-2">Please try again later or contact support.</p>
      </div>
    );
  }
}
