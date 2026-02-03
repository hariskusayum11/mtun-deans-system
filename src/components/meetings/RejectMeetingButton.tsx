"use client";

import { useTransition } from "react";
import { updateMeetingStatus } from "@/actions/approval-actions";
import { MeetingStatus } from "@prisma/client";
import { XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useState } from "react";

interface RejectMeetingButtonProps {
  id: string;
  className?: string;
  children?: React.ReactNode;
}

export default function RejectMeetingButton({ id, className, children }: RejectMeetingButtonProps) {
  const t = useTranslations("Meetings.rejectButton");
  const tCommon = useTranslations("Common");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleRejectConfirm = async () => {
    setIsRejectModalOpen(false);
    startTransition(async () => {
      const result = await updateMeetingStatus(id, MeetingStatus.REJECTED);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success || t("toastSuccess"));
        router.refresh(); // Revalidate data
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsRejectModalOpen(true)}
        className={cn(
          "flex items-center bg-white border-2 border-rose-100 hover:border-rose-200 hover:bg-rose-50 text-rose-500 font-black py-2.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-[10px] uppercase tracking-wider whitespace-nowrap",
          className
        )}
        disabled={isPending}
      >
        {children || (
          <>
            <XCircle className="h-3.5 w-3.5 mr-1.5" />
            {t("label")}
          </>
        )}
      </button>

      <ConfirmModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        title={tCommon("rejectTitle")}
        description={tCommon("rejectDesc")}
        variant="danger"
        icon={XCircle}
      />
    </>
  );
}
