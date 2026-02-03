import { getUniversities } from "@/actions/university-actions";
import UniversityTable from "@/components/universities/UniversityTable";

export default async function UniversityManagementPage() {
  const universities = await getUniversities();

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">University Management</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">Manage MTUN member universities and their profiles.</p>
      </div>

      <UniversityTable 
        universities={universities} 
        addUniversityLink="/dashboard/universities/create" 
      />
    </div>
  );
}
