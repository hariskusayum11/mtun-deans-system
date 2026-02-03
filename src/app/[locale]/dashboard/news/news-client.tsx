"use client";

import { useState } from "react";
import { Plus, Search, Newspaper, Calendar } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import RowActions from "@/components/ui/row-actions";
import { useRouter } from "next/navigation";

interface NewsItem {
  id: string;
  headline: string;
  date: Date;
  category: string;
  status: string;
}

interface NewsClientProps {
  initialNews: NewsItem[];
}

export default function NewsClient({ initialNews }: NewsClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNews = initialNews.filter(news => 
    news.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">News Management</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1 font-medium">Publish and manage university news and events.</p>
        </div>
        <Link
          href="/dashboard/news/create"
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add News
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search headlines, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
            <select className="bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm font-bold text-gray-600 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer">
                <option>All Categories</option>
                <option>Academic</option>
                <option>Event</option>
                <option>Research</option>
            </select>
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-gray-100">
                <th className="px-10 py-5">Headline</th>
                <th className="px-10 py-5">Date</th>
                <th className="px-10 py-5">Category</th>
                <th className="px-10 py-5">Status</th>
                <th className="px-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredNews.map((news) => (
                <tr key={news.id} className="hover:bg-gray-50/80 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <Newspaper className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-gray-900 max-w-md truncate">{news.headline}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {news.date.toLocaleDateString('en-GB')}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border bg-slate-50 text-slate-600 border-slate-100">
                      {news.category}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <span className={cn(
                      "inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                      news.status === 'Published' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                    )}>
                      {news.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end">
                        <RowActions 
                          id={news.id}
                          resourceName="News"
                          onEdit={`/dashboard/news/${news.id}/edit`}
                          onDelete={() => {
                            if(confirm("Are you sure you want to delete this news?")) {
                              // Handle delete logic
                            }
                          }}
                        />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-50">
          {filteredNews.map((news) => (
            <div key={news.id} className="p-4 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Newspaper className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-gray-900 truncate">{news.headline}</span>
                    <span className="text-[10px] text-gray-400 font-black flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3" /> {news.date.toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </div>
                <RowActions 
                  id={news.id}
                  resourceName="News"
                  onEdit={`/dashboard/news/${news.id}/edit`}
                  onDelete={() => {
                    if(confirm("Are you sure you want to delete this news?")) {
                      // Handle delete logic
                    }
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border bg-slate-50 text-slate-600 border-slate-100">
                  {news.category}
                </span>
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                  news.status === 'Published' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                )}>
                  {news.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
