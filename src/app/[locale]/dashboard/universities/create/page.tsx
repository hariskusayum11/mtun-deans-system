"use client";

import { createUniversity } from "@/actions/university-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UniversityForm from "@/components/universities/UniversityForm";

export default function CreateUniversityPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setFormError(null);
    const result = await createUniversity(data);
    if (result?.error) {
      setFormError(result.error);
    } else {
      router.push("/dashboard/universities");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">University Management</h1>
        <p className="text-gray-500 mt-1">Register a new MTUN member university and set up its profile.</p>
      </div>

      <UniversityForm 
        onSubmit={onSubmit} 
        isSubmitting={false} 
        error={formError}
      />
    </div>
  );
}
