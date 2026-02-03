import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { University, Users, Building2, FlaskConical, Globe, MapPin, FileText } from "lucide-react";
import Image from "next/image";

export default async function MyUniversityPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== Role.dean || !session.user.universityId) {
    redirect("/dashboard");
  }

  const university = await db.university.findUnique({
    where: { id: session.user.universityId },
    include: {
      staff: true,
      facilities: true,
      _count: {
        select: {
          staff: true,
          facilities: true,
          activities: true,
        }
      }
    }
  });

  if (!university) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">University not found</h1>
        <p className="text-gray-500">Please contact the system administrator.</p>
      </div>
    );
  }

  // Fetch research projects separately since they are linked via staff
  const researchProjects = await db.researchProject.findMany({
    where: {
      staff: {
        university_id: university.id
      }
    },
    include: {
      staff: true
    }
  });

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-8">
      {/* Header Section */}
      <Card className="border-none shadow-xl shadow-blue-200/20 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl md:rounded-[2rem] overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl bg-white shadow-lg flex items-center justify-center p-3 md:p-4 border border-blue-100 shrink-0">
              {university.logo_url ? (
                <img 
                  src={university.logo_url} 
                  alt={university.name} 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <University className="w-12 h-12 md:w-16 md:h-16 text-blue-600" />
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                {university.name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 text-slate-500 font-medium text-sm">
                {university.website && (
                  <a 
                    href={university.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 md:gap-2 hover:text-blue-600 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    {new URL(university.website).hostname}
                  </a>
                )}
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  {university.short_code}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          <TabsList className="bg-slate-100/50 p-1 rounded-xl md:rounded-2xl border border-slate-200/50 w-fit md:w-auto">
            <TabsTrigger value="overview" className="rounded-lg md:rounded-xl px-4 md:px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs md:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="staff" className="rounded-lg md:rounded-xl px-4 md:px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs md:text-sm">
              Staff ({university._count.staff})
            </TabsTrigger>
            <TabsTrigger value="facilities" className="rounded-lg md:rounded-xl px-4 md:px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs md:text-sm">
              Facilities ({university._count.facilities})
            </TabsTrigger>
            <TabsTrigger value="research" className="rounded-lg md:rounded-xl px-4 md:px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs md:text-sm">
              Research ({researchProjects.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 border-none shadow-lg rounded-[2rem] bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  About the University
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 leading-relaxed font-medium">
                <p>
                  {university.name} ({university.short_code}) is a member of the Malaysian Technical University Network (MTUN). 
                  Dedicated to providing high-quality technical and vocational education and training (TVET).
                </p>
                <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900">Location</h4>
                    <p className="text-sm">Main Campus, Malaysia</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg rounded-[2rem] bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-black">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-slate-700">Total Staff</span>
                  </div>
                  <span className="text-xl font-black text-blue-700">{university._count.staff}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold text-slate-700">Facilities</span>
                  </div>
                  <span className="text-xl font-black text-indigo-700">{university._count.facilities}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <FlaskConical className="w-5 h-5 text-amber-600" />
                    <span className="font-bold text-slate-700">Research</span>
                  </div>
                  <span className="text-xl font-black text-amber-700">{researchProjects.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staff">
          <Card className="border-none shadow-lg rounded-2xl md:rounded-[2rem] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-black text-slate-900 whitespace-nowrap">Name</TableHead>
                    <TableHead className="font-black text-slate-900 whitespace-nowrap">Position</TableHead>
                    <TableHead className="font-black text-slate-900 whitespace-nowrap">Department</TableHead>
                    <TableHead className="font-black text-slate-900 whitespace-nowrap">Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {university.staff.map((member) => (
                    <TableRow key={member.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-slate-900 whitespace-nowrap">{member.name}</TableCell>
                      <TableCell className="text-slate-600 font-medium whitespace-nowrap">{member.position}</TableCell>
                      <TableCell className="text-slate-600 font-medium whitespace-nowrap">{member.department}</TableCell>
                      <TableCell className="text-blue-600 font-medium whitespace-nowrap">{member.email || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                {university.staff.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-slate-400 font-medium">
                      No staff members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </TabsContent>

        <TabsContent value="facilities">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {university.facilities.map((facility) => (
              <Card key={facility.id} className="border-none shadow-md rounded-[2rem] bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="aspect-video relative bg-slate-100">
                  {facility.image_url ? (
                    <img 
                      src={facility.image_url} 
                      alt={facility.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Building2 className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <CardHeader className="p-6">
                  <CardTitle className="text-lg font-black text-slate-900">{facility.name}</CardTitle>
                  <CardDescription className="font-medium line-clamp-2">
                    {facility.description || "No description available."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <MapPin className="w-3 h-3" />
                    {facility.location || "Main Campus"}
                  </div>
                </CardContent>
              </Card>
            ))}
            {university.facilities.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No facilities listed yet.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="research">
          <Card className="border-none shadow-lg rounded-2xl md:rounded-[2rem] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-black text-slate-900 whitespace-nowrap">Project Title</TableHead>
                    <TableHead className="font-black text-slate-900 whitespace-nowrap">Lead Researcher</TableHead>
                    <TableHead className="font-black text-slate-900 whitespace-nowrap">Status</TableHead>
                    <TableHead className="font-black text-slate-900 whitespace-nowrap">Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {researchProjects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-slate-900 min-w-[200px]">{project.title}</TableCell>
                      <TableCell className="text-slate-600 font-medium whitespace-nowrap">{project.staff.name}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {project.status || "Ongoing"}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-400 text-xs font-medium whitespace-nowrap">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                {researchProjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-slate-400 font-medium">
                      No research projects found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </TabsContent>
      </Tabs>
    </div>
  );
}
