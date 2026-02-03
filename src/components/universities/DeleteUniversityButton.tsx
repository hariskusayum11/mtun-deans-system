"use client";

import { Trash2 } from "lucide-react";
import { deleteUniversity } from "@/actions/university-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteUniversityButtonProps {
  id: string;
}

export default function DeleteUniversityButton({ id }: DeleteUniversityButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this university? This action cannot be undone.")) {
      setIsDeleting(true);
      const result = await deleteUniversity(id);
      if (result?.error) {
        alert(result.error); // Or use a more sophisticated toast/notification system
      } else {
        // No need to revalidatePath here, as it's handled in the server action
        // router.refresh() could be used if revalidatePath wasn't used
      }
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
      title="Delete University"
    >
      {isDeleting ? (
        <span className="h-5 w-5 animate-spin rounded-full border-b-2 border-red-600"></span>
      ) : (
        <Trash2 className="h-5 w-5" />
      )}
    </button>
  );
}
