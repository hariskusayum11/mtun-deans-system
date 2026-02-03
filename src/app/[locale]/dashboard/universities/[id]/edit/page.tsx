"use client";

import { getUniversityById, updateUniversity } from "@/actions/university-actions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import UniversityForm from "@/components/universities/UniversityForm";

interface EditUniversityPageProps {
  params: {
    id: string;
  };
}

export default function EditUniversityPage({ params }: EditUniversityPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [universityData, setUniversityData] = useState<any>(null);

  useEffect(() => {
    async function fetchUniversity() {
      if (params.id) {
        const fetchedUniversity = await getUniversityById(params.id);
        if (fetchedUniversity) {
          setUniversityData(fetchedUniversity);
        } else {
          setFormError("University not found.");
        }
      }
      setLoading(false);
    }
    fetchUniversity();
  }, [params.id]);

  const onSubmit = async (data: any) => {
    setFormError(null);
    if (!session || session.user.role !== Role.super_admin) {
      setFormError("You are not authorized to update universities.");
      return;
    }

    const result = await updateUniversity(params.id, data);
    if (result?.error) {
      setFormError(result.error);
    } else {
      router.push("/dashboard/universities");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">University Management</h1>
        <p className="text-gray-500 mt-1">Update university profile and information.</p>
      </div>

      <UniversityForm 
        onSubmit={onSubmit} 
        isSubmitting={false} 
        error={formError}
        defaultValues={universityData}
        title="Edit University"
        description={`Updating profile for ${universityData?.name || 'University'}`}
        submitLabel="Save Changes"
      />
    </div>
  );
}
