"use client";

import React from 'react';
import { 
  Building, 
  MapPin, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { deleteFacility } from "@/actions/data-actions";
import RowActions from "../ui/row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Facility {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  university: {
    name: string;
    short_code: string;
  } | null;
}

interface FacilityTableProps {
  facilities: Facility[];
  isAdmin: boolean;
}

const FacilityTable = ({ facilities, isAdmin }: FacilityTableProps) => {
  const t = useTranslations("Facilities.table");
  const router = useRouter();

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-gray-100">
              <th className="px-10 py-5">{t("headers.facility")}</th>
              <th className="px-10 py-5">{t("headers.location")}</th>
              {isAdmin && <th className="px-10 py-5">{t("headers.university")}</th>}
              <th className="px-10 py-5 text-right">{t("headers.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {facilities.map((facility) => (
              <tr key={facility.id} className="hover:bg-gray-50/80 transition-all group">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 rounded-2xl border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
                      <AvatarImage src={facility.image_url || ""} alt={facility.name} className="object-cover" />
                      <AvatarFallback className="bg-blue-50 text-blue-600">
                        <Building className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{facility.name}</span>
                      {facility.description && (
                        <span className="text-xs text-gray-500 line-clamp-1 max-w-xs">{facility.description}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{facility.location || "N/A"}</span>
                  </div>
                </td>
                {isAdmin && (
                  <td className="px-10 py-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-tight bg-indigo-50 text-indigo-700 border-indigo-100">
                      {facility.university?.short_code || "MTUN"}
                    </span>
                  </td>
                )}
                <td className="px-10 py-6 text-right">
                  <RowActions 
                    id={facility.id}
                    resourceName="Facility"
                    onEdit={() => router.push(`/dashboard/facilities/${facility.id}/edit`)}
                    onDelete={async () => {
                      if (window.confirm(t("deleteConfirm"))) {
                        await deleteFacility(facility.id);
                        router.refresh();
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
            {facilities.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 4 : 3} className="px-10 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                      <Building className="w-8 h-8 text-gray-200" />
                    </div>
                    <p className="text-sm font-bold text-gray-400">{t("empty")}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacilityTable;
