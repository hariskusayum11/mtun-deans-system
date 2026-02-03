"use client";

import { createUser } from "@/actions/user-actions";
import { getUniversities } from "@/actions/university-actions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { University } from "@prisma/client";
import UserForm from "@/components/users/UserForm";
import { z } from "zod";
import { CreateUserSchema } from "@/lib/validators";

type UserFormInputs = z.infer<typeof CreateUserSchema>;

export default function CreateUserPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(true);

  useEffect(() => {
    async function fetchUniversities() {
      const fetchedUniversities = await getUniversities();
      setUniversities(fetchedUniversities);
      setLoadingUniversities(false);
    }
    fetchUniversities();
  }, []);

  const onSubmit = async (data: UserFormInputs) => {
    setFormError(null);
    const result = await createUser(data);
    if (result?.error) {
      setFormError(result.error);
    } else {
      router.push("/dashboard/users");
    }
  };

  if (loadingUniversities) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">User Management</h1>
        <p className="text-gray-500 mt-1">Create a new system user and assign their role and university.</p>
      </div>

      <UserForm 
        universities={universities} 
        onSubmit={onSubmit} 
        isSubmitting={false} // Handled by useForm's isSubmitting internally if needed, but we pass it for UI
        error={formError}
      />
    </div>
  );
}
