"use client";

import React, { useState } from "react";
import { Search, FlaskConical, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { truncateText } from "@/lib/utils";
import { motion } from "framer-motion";

interface ResearchListClientProps {
  projects: any[];
}

export default function ResearchListClient({ projects }: ResearchListClientProps) {
  const t = useTranslations("Research.list");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none rounded-2xl border-slate-200 font-bold text-slate-600">{t("filters")}</Button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-sm border border-slate-100">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-blue-950">{t("noResults")}</h3>
          <p className="text-slate-500 mt-2">{t("noResultsSub")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="bg-slate-50 border-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                  {project.status || t("statusOngoing")}
                </Badge>
              </div>
              
              <h3 className="text-xl font-black text-blue-950 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                {project.title}
              </h3>
              
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 flex-1">
                {truncateText(project.description, 160)}
              </p>
              
              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("leadResearcher")}</span>
                  <span className="text-sm font-bold text-blue-950">{project.staff.name}</span>
                </div>
                <Link href={`/research/${project.id}`} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-800 hover:text-white transition-all">
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
