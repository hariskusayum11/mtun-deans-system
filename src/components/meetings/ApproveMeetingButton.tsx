"use client";

import { useTransition } from "react";
import { updateMeetingStatus } from "@/actions/approval-actions";
import { MeetingStatus } from "@prisma/client";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useState } from "react";

interface ApproveMeetingButtonProps {
  id: string;
  className?: string;
  children?: React.ReactNode;
}

export default function ApproveMeetingButton({ id, className, children }: ApproveMeetingButtonProps) {
  const t = useTranslations("Meetings.approveButton");
  const tCommon = useTranslations("Common");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const handleApproveConfirm = async () => {
    setIsApproveModalOpen(false);
    startTransition(async () => {
      const result = await updateMeetingStatus(id, MeetingStatus.APPROVED);
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
        onClick={() => setIsApproveModalOpen(true)}
        className={cn(
          "flex items-center bg-[#10b981] hover:bg-[#059669] text-white font-black py-2.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95 text-[10px] uppercase tracking-wider whitespace-nowrap",
          className
        )}
        disabled={isPending}
      >
        {children || (
          <>
            <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
            {t("label")}
          </>
        )}
      </button>

      <ConfirmModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={handleApproveConfirm}
        title={tCommon("approveTitle")}
        description={tCommon("approveDesc")}
        variant="info"
        icon={CheckCircle}
      />
    </>
  );
}
