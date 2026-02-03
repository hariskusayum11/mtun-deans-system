"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  User as UserIcon,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from "next/link";
import RowActions from "../ui/row-actions";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/actions/user-actions";
import ConfirmModal from "../ui/ConfirmModal";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react"; // Import Trash2

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  university: string;
  image?: string;
}

interface UserTableProps {
  users: User[];
  addUserLink?: string;
}

const UserTable = ({ users: initialUsers, addUserLink }: UserTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const tCommon = useTranslations("Common");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);

  const filteredUsers = initialUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (userId: string) => {
    setUserToDeleteId(userId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDeleteId) {
      await deleteUser(userToDeleteId);
      router.refresh();
      setIsDeleteModalOpen(false);
      setUserToDeleteId(null);
    }
  };

  const getRoleBadgeStyles = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('admin')) return "bg-purple-50 text-purple-700 border-purple-100";
    if (r.includes('dean')) return "bg-blue-50 text-blue-700 border-blue-100";
    if (r.includes('entry')) return "bg-green-50 text-green-700 border-green-100";
    return "bg-gray-50 text-gray-700 border-gray-100";
  };

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
        {addUserLink && (
          <Link
            href={addUserLink}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add User
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
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">University</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600">
                            <UserIcon className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-gray-900 truncate">{user.name}</span>
                        <span className="text-xs text-gray-500 truncate">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-tight",
                      getRoleBadgeStyles(user.role)
                    )}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-600">{user.university}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end">
                      <RowActions 
                        id={user.id}
                        resourceName="User"
                        onEdit={() => router.push(`/dashboard/users/${user.id}/edit`)}
                        onDelete={() => handleDeleteClick(user.id)}
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
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-gray-900 truncate">{user.name}</span>
                    <span className="text-xs text-gray-500 truncate">{user.email}</span>
                  </div>
                </div>
                <RowActions 
                  id={user.id}
                  resourceName="User"
                  onEdit={() => router.push(`/dashboard/users/${user.id}/edit`)}
                  onDelete={() => handleDeleteClick(user.id)}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-tight",
                  getRoleBadgeStyles(user.role)
                )}>
                  {user.role.replace('_', ' ')}
                </span>
                <span className="text-xs font-medium text-gray-500">{user.university}</span>
              </div>
            </div>
          ))}
        </div>
        {filteredUsers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-gray-50 rounded-full">
                <Search className="h-8 w-8 text-gray-300" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-gray-900">No users found</p>
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
        title={tCommon("deleteUserTitle")}
        description={tCommon("deleteUserDesc")}
        variant="danger"
        icon={Trash2}
      />
    </div>
  );
};

export default UserTable;
