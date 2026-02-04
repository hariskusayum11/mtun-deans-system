"use client";

import React, { useState } from "react";
import {
  Search,
  User as UserIcon,
  Briefcase,
  Mail,
  Pencil,
  Trash2,
  GraduationCap,
  Filter, // Added Filter icon for dropdown
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
import { Input } from "@/components/ui/input"; // Added Input component
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"; // Added Dropdown components
import toast from "react-hot-toast";
import Image from "next/image"; // Added Image component

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

  // Mock departments for filter dropdown
  const departments = [
    "All Departments",
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ];

  return (
    <TooltipProvider>
      {/* Header Section (Toolbar): Search Input and Department Filter */}
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name, position, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 rounded-xl border-slate-200 focus-visible:ring-blue-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
                <Filter className="h-4 w-4" />
                All Departments {/* Placeholder for department filter */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {departments.map((dept, index) => (
                <DropdownMenuItem key={index}>{dept}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Body Section (Table) */}
      <div className="p-0 overflow-x-auto">
        {filteredStaff.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            <GraduationCap className="h-16 w-16 text-slate-200 mx-auto mb-4" />
            <div className="text-lg font-bold text-slate-800">No staff members found.</div>
            <div className="text-sm mt-2">Try adjusting your search terms or filters.</div>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4 whitespace-nowrap">Staff Member</th>
                <th className="p-4 whitespace-nowrap">Academic Info</th>
                <th className="p-4 whitespace-nowrap">Workload</th>
                {isAdmin && <th className="p-4 whitespace-nowrap">University</th>}
                <th className="p-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-slate-100 flex-shrink-0">
                      <Image
                        src={member.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=f1f5f9&color=1e3a8a&size=128`}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email || "N/A"}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{member.position}</p>
                        <p className="text-xs text-slate-500">{member.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary" className="bg-blue-50 border-blue-100 text-blue-600 text-[9px] font-black uppercase tracking-widest">
                      {member._count.research_projects} PROJECTS
                    </Badge>
                  </td>
                  {isAdmin && (
                    <td className="p-4">
                      <Badge variant="secondary" className="bg-indigo-50 border-indigo-100 text-indigo-700 text-[9px] font-black uppercase tracking-widest">
                        {member.university?.short_code || "MTUN"}
                      </Badge>
                    </td>
                  )}
                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={`/dashboard/staff/${member.id}`} passHref>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600">
                              <Mail className="h-4 w-4" /> {/* Using Mail icon for View/Details */}
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold text-[10px] uppercase tracking-widest">
                          View Details
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={`/dashboard/staff/${member.id}/edit`} passHref>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold text-[10px] uppercase tracking-widest">
                          Edit Profile
                        </TooltipContent>
                      </Tooltip>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-red-600"
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
        )}
      </div>
    </TooltipProvider>
  );
};

export default StaffTable;
