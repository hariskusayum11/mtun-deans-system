"use client";

import { getUserById, updateUser } from "@/actions/user-actions";
import { getUniversities } from "@/actions/university-actions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { University, Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import UserForm from "@/components/users/UserForm";

interface EditUserPageProps {
  params: {
    id: string;
  };
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [universities, setUniversities] = useState<University[]>([]);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (params.id) {
        const fetchedUser = await getUserById(params.id);
        if (fetchedUser) {
          setUserData({
            ...fetchedUser,
            name: fetchedUser.name || "",
            university_id: fetchedUser.university_id || "",
          });
        } else {
          setFormError("User not found.");
        }
      }
      
      const fetchedUniversities = await getUniversities();
      setUniversities(fetchedUniversities);
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  const onSubmit = async (data: any) => {
    setFormError(null);
    if (!session || session.user.role !== Role.super_admin) {
      setFormError("You are not authorized to update users.");
      return;
    }

    const result = await updateUser(params.id, data);
    if (result?.error) {
      setFormError(result.error);
    } else {
      router.push("/dashboard/users");
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
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">User Management</h1>
        <p className="text-gray-500 mt-1">Update user information and system permissions.</p>
      </div>

      <UserForm 
        universities={universities} 
        onSubmit={onSubmit} 
        isSubmitting={false}
        error={formError}
        defaultValues={userData}
        title="Edit User"
        description={`Updating profile for ${userData?.name || 'User'}`}
        submitLabel="Save Changes"
      />
    </div>
  );
}
