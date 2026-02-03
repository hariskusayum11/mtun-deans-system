"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { LogOut, Trash2, CheckCircle, XCircle, Info } from "lucide-react"; // Import necessary icons
import { cn } from "@/lib/utils"; // Import cn
import { createPortal } from "react-dom"; // Import createPortal

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  variant?: "danger" | "info" | "success"; // Added 'success' variant
  icon?: React.ElementType; // New prop for custom icon
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = "danger",
  icon: IconComponent, // Destructure and rename icon prop
}) => {
  const t = useTranslations("Common");

  const iconMap = {
    danger: Trash2,
    info: Info,
    success: CheckCircle,
    logout: LogOut, // Specific icon for logout
    reject: XCircle, // Specific icon for reject
    approve: CheckCircle, // Specific icon for approve
  };

  const defaultIcon = IconComponent || iconMap[variant] || Info; // Use provided icon or map to variant
  const IconToRender = defaultIcon; // Assign to a variable for JSX

  const iconBgClass =
    variant === "danger"
      ? "bg-red-50 text-red-500"
      : variant === "info"
      ? "bg-blue-50 text-blue-500"
      : "bg-emerald-50 text-emerald-500";

  const confirmButtonClass =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
      : variant === "info"
      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20";

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
          >
            {/* Icon Area with Glowing Background */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={cn(
                  "absolute inset-0 rounded-full blur-xl",
                  variant === "danger" ? "bg-red-200" : variant === "info" ? "bg-blue-200" : "bg-emerald-200"
                )}
              />
              <div className={cn(
                "relative w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-white/30 shadow-lg",
                iconBgClass
              )}>
                <IconToRender className="w-8 h-8" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{title}</h2>
            <p className="text-slate-600 mb-8">{description}</p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="h-12 px-6 rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={onConfirm}
                className={`h-12 px-6 rounded-xl font-bold ${confirmButtonClass}`}
              >
                {t("confirm")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body // Render into the document body
  );
};

export default ConfirmModal;
