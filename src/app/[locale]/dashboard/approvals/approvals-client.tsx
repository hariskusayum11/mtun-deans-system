"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  User as UserIcon, 
  Check, 
  X, 
  Eye,
  Inbox
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MeetingDetailsModal from "@/components/meetings/MeetingDetailsModal";
import ApproveMeetingButton from "@/components/meetings/ApproveMeetingButton";
import RejectMeetingButton from "@/components/meetings/RejectMeetingButton";

interface ApprovalsClientProps {
  meetings: any[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function ApprovalsClient({ meetings }: ApprovalsClientProps) {
  if (meetings.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Inbox className="w-16 h-16 text-slate-200" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">All Caught Up!</h2>
        <p className="text-slate-500 font-medium mt-2">No meetings pending your approval at the moment.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
    >
      <AnimatePresence mode="popLayout">
        {meetings.map((meeting) => (
          <motion.div
            key={meeting.id}
            variants={item}
            layout
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            whileHover={{ scale: 1.02 }}
            className="h-full"
          >
            <Card className="h-full flex flex-col border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-l-[6px] border-l-amber-500 bg-white rounded-2xl md:rounded-[2rem] group/card">
              <CardHeader className="p-4 md:p-6 pb-0 flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-slate-50 rounded-full border border-slate-100 shadow-inner">
                  <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600" />
                  <span className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-wider">
                    {format(new Date(meeting.date), "MMM dd")}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600" />
                  <span className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-wider">
                    {format(new Date(meeting.start_time), "HH:mm")}
                  </span>
                </div>
                <Badge className="bg-amber-500 text-white border-none shadow-lg shadow-amber-500/30 rounded-full px-2 md:px-3 py-0.5 md:py-1 text-[7px] md:text-[8px] font-black uppercase tracking-[0.15em]">
                  Pending
                </Badge>
              </CardHeader>

              <CardContent className="p-4 md:p-6 flex-1 space-y-4 md:space-y-5">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight group-hover/card:text-blue-600 transition-colors duration-300">
                  {meeting.title}
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600 font-bold bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50 group-hover/card:bg-white group-hover/card:shadow-sm transition-all duration-300">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-50">
                      <MapPin className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Location</span>
                      <span className="text-slate-700 text-sm line-clamp-1">{meeting.location || "Virtual Meeting"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 font-bold bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50 group-hover/card:bg-white group-hover/card:shadow-sm transition-all duration-300">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-50">
                      <Building2 className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">University</span>
                      <span className="text-slate-700 text-sm line-clamp-1">{meeting.university?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                        <AvatarImage src={meeting.created_by?.image} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-[10px] font-black">
                          {meeting.created_by?.name?.substring(0, 2).toUpperCase() || "US"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.1em]">Requested By</span>
                      <span className="text-sm font-black text-slate-800">{meeting.created_by?.name || "System User"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-3 bg-slate-50/80 backdrop-blur-sm border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="w-full sm:w-auto">
                  <MeetingDetailsModal meeting={meeting} />
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="flex-1 sm:flex-none">
                    <RejectMeetingButton id={meeting.id} />
                  </div>
                  <div className="flex-1 sm:flex-none">
                    <ApproveMeetingButton id={meeting.id} />
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
