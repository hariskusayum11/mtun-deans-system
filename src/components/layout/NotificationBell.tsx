"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Info, CheckCircle, XCircle, AlertTriangle, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function NotificationBell() {
  const { data: session } = useSession();
  const t = useTranslations("Dashboard.header");
  const tCommon = useTranslations("Common");
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications every 30 seconds
  const { data: notifications, mutate } = useSWR<Notification[]>(
    session?.user?.id ? "/api/notifications" : null,
    fetcher,
    { refreshInterval: 30000 }
  );

  const unreadCount = notifications?.filter((n: Notification) => !n.isRead).length || 0;

  const getIconForNotificationType = (type: Notification["type"]) => {
    switch (type) {
      case "INFO":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "SUCCESS":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "WARNING":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "ERROR":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Mail className="h-4 w-4 text-slate-500" />;
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await fetch(`/api/notifications/${notification.id}`, {
        method: "PATCH",
      });
      mutate(); // Revalidate SWR cache to update unread count
    }
    setIsOpen(false);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-2xl transition-colors text-gray-700 hover:text-slate-900 hover:bg-slate-100"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right"
          >
            <h3 className="text-sm font-bold text-slate-900 px-4 py-2 border-b border-gray-100">
              {t("notifications")} ({unreadCount})
            </h3>
            {notifications && notifications.length > 0 ? (
              <ul className="divide-y divide-gray-50 max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors",
                      !notification.isRead ? "bg-blue-50/50" : "bg-white"
                    )}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getIconForNotificationType(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{notification.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 p-4 text-center">{tCommon("noNotifications")}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
