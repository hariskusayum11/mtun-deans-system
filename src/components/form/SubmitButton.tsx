"use client";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils"; // Import cn utility

interface SubmitButtonProps {
  label?: string;
  className?: string; // Allow className prop
}

export default function SubmitButton({ label = "Save", className }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50",
        className // Apply additional classes
      )}
    >
      {pending ? (
        <span className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></span>
      ) : (
        label
      )}
    </button>
  );
}
