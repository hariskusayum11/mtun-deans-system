"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  User as UserIcon,
  Briefcase,
  Mail,
  Building,
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  GraduationCap,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteStaff } from "@/actions/data-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

interface StaffMember {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string | null;
  image_url: string | null;
  expertise: string | null;
  university: {
    name: string;
    short_code: string;
  } | null;
  _count: {
    research_projects: number;
  };
}

interface StaffTableProps {
  staff: StaffMember[];
  isAdmin: boolean;
}

const StaffTable = ({ staff: initialStaff, isAdmin }: StaffTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredStaff = initialStaff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleDelete = async (id: string) => {
    const result = await deleteStaff(id);
    toast.success("Staff member deleted successfully!");
    router.refresh();
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Toolbar - Integrated style like Meetings */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, position, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select className="bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm font-bold text-gray-600 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer">
              <option>All Departments</option>
            </select>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-gray-100">
                  <th className="px-10 py-5">Staff Member</th>
                  <th className="px-10 py-5">Academic Info</th>
                  <th className="px-10 py-5 text-center">Workload</th>
                  {isAdmin && <th className="px-10 py-5">University</th>}
                  <th className="px-10 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStaff.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50/80 transition-all group"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                          {member.image_url ? (
                            <img
                              src={member.image_url}
                              alt={member.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600">
                              <UserIcon className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-bold text-gray-900 block">
                            {member.name}
                          </span>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Mail className="h-3 w-3" />
                            <span className="text-[10px] font-medium">
                              {member.email || "N/A"}
                            </span>
                          </div>
                          {member.expertise && (
                            <div className="flex items-center gap-1.5 pt-1">
                              <Tag className="h-3 w-3 text-blue-500" />
                              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                                {member.expertise}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-gray-700">
                          <GraduationCap className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm font-bold">
                            {member.position}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">
                          {member.department}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <Badge
                        variant="outline"
                        className="rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-wider border-gray-200 text-gray-600 bg-gray-50"
                      >
                        {member._count.research_projects} Projects
                      </Badge>
                    </td>
                    {isAdmin && (
                      <td className="px-10 py-6">
                        <Badge className="rounded-lg px-2.5 py-1 text-[10px] font-black border uppercase tracking-tight bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm">
                          {member.university?.short_code || "MTUN"}
                        </Badge>
                      </td>
                    )}
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              asChild
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 rounded-xl border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                            >
                              <Link href={`/dashboard/staff/${member.id}/projects`}>
                                <Briefcase className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="font-bold text-[10px] uppercase tracking-widest">
                            Manage Projects
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              asChild
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                            >
                              <Link href={`/dashboard/staff/${member.id}/edit`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="font-bold text-[10px] uppercase tracking-widest">
                            Edit Profile
                          </TooltipContent>
                        </Tooltip>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 rounded-xl border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2rem]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-black">
                                Delete Staff Member?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="font-medium text-gray-500">
                                This action cannot be undone. This will
                                permanently delete{" "}
                                <span className="font-bold text-gray-900">
                                  {member.name}
                                </span>{" "}
                                and all associated research data from the
                                system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl font-bold">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(member.id)}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
                              >
                                Delete Member
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredStaff.map((member) => (
              <div key={member.id} className="p-4 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden shadow-sm">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600">
                          <UserIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-gray-900 truncate">{member.name}</span>
                      <span className="text-[10px] text-gray-500 truncate">{member.email || "No Email"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-blue-600 hover:bg-blue-50">
                      <Link href={`/dashboard/staff/${member.id}/projects`}>
                        <Briefcase className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-600 hover:bg-gray-100">
                      <Link href={`/dashboard/staff/${member.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[10px] text-gray-600 font-medium">
                    <GraduationCap className="h-3 w-3 text-gray-400" />
                    {member.position} • {member.department}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-gray-200 text-gray-600 bg-gray-50">
                      {member._count.research_projects} Projects
                    </Badge>
                    {isAdmin && (
                      <Badge className="text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 border-indigo-100">
                        {member.university?.short_code || "MTUN"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredStaff.length === 0 && (
            <div className="px-10 py-20 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-200" />
                </div>
                <p className="text-sm font-bold text-gray-400">No staff members found.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default StaffTable;
