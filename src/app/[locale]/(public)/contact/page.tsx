import PublicLayout from "@/components/layout/PublicLayout";
import { ChevronRight, Mail, Phone, MapPin, Send, Globe, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const t = useTranslations("Contact");

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* Glass Hero Banner */}
      <section className="w-full py-20 bg-white/60 backdrop-blur-xl border-b border-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#E0F2FE,transparent)] opacity-40" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="space-y-4">
            <nav className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-400">
              <Link href="/" className="hover:text-blue-600 transition-colors">{t("hero.breadcrumbs.home")}</Link>
              <ChevronRight className="h-3 w-3 mx-2" />
              <span className="text-slate-600">{t("hero.breadcrumbs.contact")}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-black text-blue-950 tracking-tighter">
              {t("hero.title")} <span className="text-blue-600">{t("hero.titleAccent")}</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl leading-relaxed">
              {t("hero.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 space-y-10">
              <h3 className="text-2xl font-black text-blue-950 tracking-tight">{t("info.title")}</h3>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("info.location.label")}</p>
                    <p className="text-sm font-bold text-blue-950 leading-relaxed">{t("info.location.value")}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("info.email.label")}</p>
                    <p className="text-sm font-bold text-blue-950">{t("info.email.value")}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("info.phone.label")}</p>
                    <p className="text-sm font-bold text-blue-950">{t("info.phone.value")}</p>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-50 space-y-6">
                <h4 className="text-sm font-black text-blue-950 uppercase tracking-widest">{t("info.hours.title")}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-500">{t("info.hours.monFri")}</span>
                    <span className="text-blue-950">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-500">{t("info.hours.satSun")}</span>
                    <span className="text-rose-500">{t("info.hours.closed")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-sm border border-slate-100 space-y-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-blue-950 tracking-tight">{t("form.title")}</h2>
                <p className="text-slate-500 font-medium">{t("form.description")}</p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t("form.fullName")}</label>
                    <Input className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 text-blue-950 font-medium" placeholder={t("form.placeholderName")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t("form.email")}</label>
                    <Input className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 text-blue-950 font-medium" placeholder={t("form.placeholderEmail")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t("form.subject")}</label>
                  <Input className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 text-blue-950 font-medium" placeholder={t("form.placeholderSubject")} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t("form.message")}</label>
                  <Textarea className="min-h-[180px] rounded-[2rem] bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 text-blue-950 font-medium p-6" placeholder={t("form.placeholderMessage")} />
                </div>
                <div className="pt-4">
                  <Button className="h-16 px-12 rounded-2xl bg-blue-800 hover:bg-blue-900 text-white font-black text-lg shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95 gap-3">
                    <Send className="w-5 h-5" />
                    {t("form.submit")}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full h-[450px] rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 grayscale hover:grayscale-0 transition-all duration-1000">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127482.4195518466!2d101.616949!3d3.139003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc362abd08e7d3%3A0x232e171219011547!2sKuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur!5e0!3m2!1sen!2smy!4v1705330000000!5m2!1sen!2smy" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </main>
    </div>
  );
}
