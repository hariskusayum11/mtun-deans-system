"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, Clock, MapPin, Users, FileText, Paperclip } from "lucide-react";
import { format } from "date-fns";
import ApproveMeetingButton from "./ApproveMeetingButton";
import RejectMeetingButton from "./RejectMeetingButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MeetingDetailsModalProps {
  meeting: any;
}

export default function MeetingDetailsModal({ meeting }: MeetingDetailsModalProps) {
  const participants = meeting.participants || [];
  const displayParticipants = participants.slice(0, 5);
  const remainingCount = participants.length - displayParticipants.length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1.5 hover:bg-white hover:shadow-sm rounded-xl font-black text-[10px] uppercase tracking-wider text-slate-400 hover:text-blue-600 transition-all duration-300 px-2 h-9 whitespace-nowrap">
          <Eye className="h-3.5 w-3.5" />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900">Meeting Details</DialogTitle>
          <DialogDescription className="font-medium">
            Full agenda and participants for this meeting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title & Status */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-blue-600">{meeting.title}</h3>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-50 text-yellow-700 border border-yellow-100">
              {meeting.status}
            </span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Calendar className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Date</p>
                <p className="text-sm font-bold text-slate-700">{format(new Date(meeting.date), "dd MMMM yyyy")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Clock className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Time</p>
                <p className="text-sm font-bold text-slate-700">{format(new Date(meeting.start_time), "HH:mm")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <MapPin className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Location</p>
                <p className="text-sm font-bold text-slate-700">{meeting.location || "Not specified"}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Participants</p>
                  <p className="text-sm font-bold text-slate-700">
                    {participants.length > 0 ? `${participants.length} Invited` : "None listed"}
                  </p>
                </div>
              </div>
              
              {participants.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {displayParticipants.map((p: any) => (
                    <div key={p.id} className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={p.image} />
                        <AvatarFallback className="text-[8px] font-black bg-blue-50 text-blue-600">
                          {p.name?.substring(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] font-bold text-slate-600">{p.name || p.email}</span>
                    </div>
                  ))}
                  {remainingCount > 0 && (
                    <div className="flex items-center justify-center bg-slate-200 px-2 py-1 rounded-lg border border-slate-300 shadow-sm">
                      <span className="text-[10px] font-black text-slate-500">+{remainingCount} more</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Agenda */}
          <div className="space-y-2">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Meeting Agenda
            </h4>
            <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm prose prose-sm max-w-none">
              {meeting.agenda_details ? (
                <div dangerouslySetInnerHTML={{ __html: meeting.agenda_details }} />
              ) : (
                <p className="text-slate-400 italic">No agenda details provided.</p>
              )}
            </div>
          </div>

          {/* Attachments */}
          {(meeting.agenda_file_url || meeting.minutes_file_url) && (
            <div className="space-y-2">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments
              </h4>
              <div className="flex flex-wrap gap-3">
                {meeting.agenda_file_url && (
                  <a 
                    href={meeting.agenda_file_url} 
                    target="_blank" 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    Agenda File
                  </a>
                )}
                {meeting.minutes_file_url && (
                  <a 
                    href={meeting.minutes_file_url} 
                    target="_blank" 
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    Minutes File
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <RejectMeetingButton id={meeting.id} />
            <ApproveMeetingButton id={meeting.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
