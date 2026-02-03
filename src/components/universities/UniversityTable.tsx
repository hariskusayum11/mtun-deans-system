"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Globe,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from "next/link";
import RowActions from "../ui/row-actions";
import { useRouter } from "next/navigation";
import { deleteUniversity } from "@/actions/university-actions";
import ConfirmModal from "../ui/ConfirmModal";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react"; // Import Trash2

interface University {
  id: string;
  name: string;
  short_code: string;
  logo_url?: string | null;
  website?: string | null;
}

interface UniversityTableProps {
  universities: University[];
  addUniversityLink?: string;
}

const UniversityTable = ({ universities: initialUniversities, addUniversityLink }: UniversityTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const tCommon = useTranslations("Common");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [universityToDeleteId, setUniversityToDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (universityId: string) => {
    setUniversityToDeleteId(universityId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (universityToDeleteId) {
      await deleteUniversity(universityToDeleteId);
      router.refresh();
      setIsDeleteModalOpen(false);
      setUniversityToDeleteId(null);
    }
  };

  const filteredUniversities = initialUniversities.filter(uni => 
    uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.short_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search universities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
        {addUniversityLink && (
          <Link
            href={addUniversityLink}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add University
          </Link>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Logo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">University Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Short Code</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Website</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUniversities.map((uni) => (
                <tr key={uni.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="h-10 w-10 rounded-xl bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
                      {uni.logo_url ? (
                        <img src={uni.logo_url} alt={uni.name} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900">{uni.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-tight bg-blue-50 text-blue-700 border-blue-100">
                      {uni.short_code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {uni.website ? (
                      <a 
                        href={uni.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 inline-flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 italic">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end">
                      <RowActions 
                        id={uni.id}
                        resourceName="University"
                        onEdit={() => router.push(`/dashboard/universities/${uni.id}/edit`)}
                        onDelete={() => handleDeleteClick(uni.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredUniversities.map((uni) => (
            <div key={uni.id} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
                    {uni.logo_url ? (
                      <img src={uni.logo_url} alt={uni.name} className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-gray-900 truncate">{uni.name}</span>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{uni.short_code}</span>
                  </div>
                </div>
                <RowActions 
                  id={uni.id}
                  resourceName="University"
                  onEdit={() => router.push(`/dashboard/universities/${uni.id}/edit`)}
                  onDelete={() => handleDeleteClick(uni.id)}
                />
              </div>
              {uni.website && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Globe className="h-3 w-3" />
                  <a href={uni.website} target="_blank" rel="noopener noreferrer" className="truncate hover:text-blue-600">
                    {uni.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
        {filteredUniversities.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-gray-50 rounded-full">
                <Search className="h-8 w-8 text-gray-300" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-gray-900">No universities found</p>
                <p className="text-sm text-gray-500">Try adjusting your search terms.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={tCommon("deleteUniTitle")}
        description={tCommon("deleteUniDesc")}
        variant="danger"
        icon={Trash2}
      />
    </div>
  );
};

export default UniversityTable;
