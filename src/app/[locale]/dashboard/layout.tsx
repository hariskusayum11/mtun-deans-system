import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/layout/Header";
import SessionTimeout from "@/components/auth/SessionTimeout";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar user={user} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-[#0a1128] text-white p-4 flex items-center justify-between shadow-md z-30">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 bg-[#0a1128] border-r-white/5 w-72">
                <Sidebar user={user} />
              </SheetContent>
            </Sheet>
            <span className="font-black tracking-tighter text-xl">MTUN</span>
          </div>
          <Header user={user} />
        </header>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <Header user={user} />
        </div>

        <main className="flex-1 overflow-y-auto p-0">
          {children}
        </main>
      </div>
      <SessionTimeout timeoutMinutes={15} />
    </div>
  );
}
