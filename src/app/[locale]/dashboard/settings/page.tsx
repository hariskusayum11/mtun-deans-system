"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, User, Mail, Lock, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
          Settings
        </h1>
        <p className="text-sm md:text-base text-gray-500 font-medium">
          Manage your account security and system preferences.
        </p>
      </div>

      <div className="grid gap-6 md:gap-8">
        {/* Profile Section */}
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl md:rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 md:px-8 py-4 md:py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-slate-900">
                  Account Profile
                </CardTitle>
                <CardDescription className="font-medium">
                  Your basic account information.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">
                  Full Name
                </Label>
                <Input
                  disabled
                  value={user.name || "N/A"}
                  className="rounded-xl border-slate-200 bg-slate-50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    disabled
                    value={user.email || "N/A"}
                    className="pl-10 rounded-xl border-slate-200 bg-slate-50 h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Role</Label>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                    {user.role.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl md:rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 md:px-8 py-4 md:py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-slate-900">
                  Security
                </CardTitle>
                <CardDescription className="font-medium">
                  Update your password to keep your account secure.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">
                  New Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl border-slate-200 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl border-slate-200 h-12"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl md:rounded-2xl text-sm font-black transition-all shadow-xl shadow-blue-500/25 active:scale-95 gap-2">
                <Save className="h-4 w-4" />
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
