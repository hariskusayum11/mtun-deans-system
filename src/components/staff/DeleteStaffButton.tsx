"use client";

import { Trash2 } from "lucide-react";
import { deleteStaff } from "@/actions/data-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteStaffButtonProps {
  id: string;
}

export default function DeleteStaffButton({ id }: DeleteStaffButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this staff member? This action cannot be undone.")) {
      setIsDeleting(true);
      const result = await deleteStaff(id);
      if (result?.error) {
        alert(result.error); // Or use a more sophisticated toast/notification system
      } else {
        router.refresh(); // Refresh the page to reflect the deletion
      }
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
      title="Delete Staff"
    >
      {isDeleting ? (
        <span className="h-5 w-5 animate-spin rounded-full border-b-2 border-red-600"></span>
      ) : (
        <Trash2 className="h-5 w-5" />
      )}
    </button>
  );
}
