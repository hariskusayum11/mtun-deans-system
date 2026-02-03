"use client";

import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart as BarChartIcon } from "lucide-react";

interface IndustryChartProps {
  dataBySector: { name: string; value: number }[];
  dataByStatus: { name: string; value: number }[];
}

export default function IndustryChart({ dataBySector, dataByStatus }: IndustryChartProps) {
  const [view, setView] = useState<"sector" | "status">("sector");

  const activeData = view === "sector" ? dataBySector : dataByStatus;

  return (
    <Card className="border-none shadow-lg rounded-[2rem] overflow-hidden bg-slate-50/50 border border-slate-100">
      <CardHeader className="pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 space-y-0">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <BarChartIcon className="h-4 w-4 text-blue-600" />
          Industry Partners
        </CardTitle>
        <Tabs value={view} onValueChange={(v) => setView(v as any)} className="no-print w-full sm:w-auto">
          <TabsList className="bg-slate-200/50 rounded-lg h-8 p-1 w-full sm:w-auto">
            <TabsTrigger value="sector" className="flex-1 sm:flex-none text-[10px] font-bold px-3 h-6 rounded-md data-[state=active]:bg-white">
              By Sector
            </TabsTrigger>
            <TabsTrigger value="status" className="flex-1 sm:flex-none text-[10px] font-bold px-3 h-6 rounded-md data-[state=active]:bg-white">
              By Status
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="h-[250px] sm:h-[300px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activeData.length > 0 ? activeData : [{ name: 'No Data', value: 0 }]}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              cursor={{ fill: '#f1f5f9' }}
            />
            <Bar dataKey="value" fill={view === 'sector' ? "#2563eb" : "#10b981"} radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
