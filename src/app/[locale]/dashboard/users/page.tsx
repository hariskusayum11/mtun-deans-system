import { getUsers } from "@/actions/user-actions";
import UserTable from "@/components/users/UserTable";

export default async function UserManagementPage() {
  const users = await getUsers();

  // Transform Prisma data to match UserTable expectations if necessary
  const formattedUsers = users.map((user: any) => ({
    id: user.id,
    name: user.name || "Unknown User",
    email: user.email || "",
    role: user.role,
    university: user.university?.name || "MTUN Central",
    image: user.image,
  }));

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">User Management</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">Manage system access and roles for all university staff.</p>
      </div>

      <UserTable users={formattedUsers} addUserLink="/dashboard/users/create" />
    </div>
  );
}
