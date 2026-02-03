"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default function LoginForm() {
  const t = useTranslations("Auth.login"); // เรียกใช้คำแปลหมวด Auth
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(t("errorLogin"));
      } else {
        toast.success(t("successLogin"));
        router.push("/dashboard"); // ล็อกอินผ่านให้ไป Dashboard
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm mx-auto">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">{t("email")}</Label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <Input
            id="email"
            type="email"
            placeholder="admin@mtun.edu.my"
            className="block w-full rounded-xl border-slate-200 bg-white/50 pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus:bg-white hover:border-slate-300 h-12"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <PasswordInput
          label={t("password")}
          register={{
            name: "password",
            onChange: (e: any) => setPassword(e.target.value),
            onBlur: () => {},
            ref: () => {}
          } as any}
          value={password}
          required
          disabled={loading}
          className="h-12"
        />
      </div>

      <div className="flex justify-end">
        <Link 
          href="/forgot-password" 
          className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          {t("forgotPassword")}
        </Link>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/25 transition-all duration-200 active:scale-[0.98]" 
        disabled={loading}
      >
        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
        {t("signInButton")}
      </Button>
    </form>
  );
}
