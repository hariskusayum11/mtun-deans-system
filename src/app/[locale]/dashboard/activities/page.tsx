import { getCompanies, createIndustryActivity } from "@/actions/data-actions";
import SubmitButton from "@/components/form/SubmitButton";
import { auth } from "@/lib/auth";
import { Role, Company } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function ActivitiesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const allowedRoles = [Role.super_admin, Role.dean, Role.data_entry];
  if (!allowedRoles.includes(session.user.role)) {
    return <div className="container mx-auto p-4 text-red-500">You do not have permission to view this page.</div>;
  }

  let companies: Company[] = [];
  try {
    companies = await getCompanies();
  } catch (error) {
    console.error("Error fetching companies:", error);
    return <div className="container mx-auto p-4 text-red-500">Error loading companies. Please check logs.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Industry Activity</h1>

      <div className="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto">
        <form action={createIndustryActivity} className="space-y-6">
          <input type="hidden" name="university_id" value={session.user.universityId || ""} />

          {/* Top Row: Company Selection (Full Width) */}
          <div>
            <label htmlFor="company_id" className="block text-sm font-semibold text-gray-700 mb-1">
              Company
            </label>
            <select
              id="company_id"
              name="company_id"
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Middle Section: Grid for other fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="project_name" className="block text-sm font-semibold text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                id="project_name"
                name="project_name"
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              >
                <option value="">Select Status</option>
                <option value="Planned">Planned</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="pic_company" className="block text-sm font-semibold text-gray-700 mb-1">
                PIC Company
              </label>
              <input
                type="text"
                id="pic_company"
                name="pic_company"
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
            </div>
            <div>
              <label htmlFor="pic_university" className="block text-sm font-semibold text-gray-700 mb-1">
                PIC University
              </label>
              <input
                type="text"
                id="pic_university"
                name="pic_university"
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
            </div>
          </div>

          {/* Bottom Section: Action/Description (Full Width) */}
          <div>
            <label htmlFor="action" className="block text-sm font-semibold text-gray-700 mb-1">
              Action/Description
            </label>
            <textarea
              id="action"
              name="action"
              rows={4}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            ></textarea>
          </div>

          <SubmitButton label="Save Activity" className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700" />
        </form>
      </div>
    </div>
  );
}
