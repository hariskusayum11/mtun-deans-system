import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Role, MeetingStatus } from "@prisma/client";
import ApprovalsClient from "./approvals-client";

export default async function PendingApprovalsPage() {
  const session = await auth();

  if (!session?.user || (session.user.role !== Role.dean && session.user.role !== Role.super_admin)) {
    redirect("/dashboard");
  }

  const user = session.user;

  let whereClause: any = {
    status: MeetingStatus.PENDING,
  };

  if (user.role === Role.dean && user.universityId) {
    whereClause.university_id = user.universityId;
  } else if (user.role === Role.dean && !user.universityId) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Pending Approvals</h1>
          <p className="text-slate-500 font-medium">
            You are a Dean but not associated with a university. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  const pendingMeetings = await db.meeting.findMany({
    where: whereClause,
    include: {
      university: true,
      created_by: {
        select: {
          name: true,
          image: true,
        }
      },
      participants: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        }
      }
    },
    orderBy: {
      date: "asc",
    },
  });

  return (
    <div className="container mx-auto py-6 md:py-12 px-4 md:px-6 space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Pending <span className="text-blue-600">Approvals</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-lg">
            Review and manage meeting requests for your university.
          </p>
        </div>
        <div className="w-fit bg-white shadow-xl shadow-blue-500/10 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-[1.5rem] border border-blue-50 flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] md:text-sm font-black text-slate-700 uppercase tracking-widest">
            {pendingMeetings.length} Request{pendingMeetings.length !== 1 ? 's' : ''} Waiting
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/20 via-transparent to-transparent rounded-full hidden lg:block" />
        <ApprovalsClient meetings={pendingMeetings} />
      </div>
    </div>
  );
}
