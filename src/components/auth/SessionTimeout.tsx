"use client";

import { useEffect, useRef, useCallback } from "react";
import { signOut, useSession } from "next-auth/react";
import debounce from "lodash.debounce"; // Import debounce

interface SessionTimeoutProps {
  timeoutMinutes?: number; // Optional timeout duration in minutes
}

export default function SessionTimeout({ timeoutMinutes = 15 }: SessionTimeoutProps) {
  const { data: session, status } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (session) { // Only set timer if user is authenticated
      timeoutRef.current = setTimeout(() => {
        signOut({ callbackUrl: "/login" });
      }, timeoutMinutes * 60 * 1000); // Convert minutes to milliseconds
    }
  }, [session, timeoutMinutes]);

  const handleActivity = useCallback(
    debounce(() => {
      resetTimer();
    }, 500), // Debounce activity handler to avoid excessive resets
    [resetTimer]
  );

  useEffect(() => {
    // Initialize timer on component mount or session change
    resetTimer();

    // Add event listeners for user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    // Clean up event listeners and timer on component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, [session, resetTimer, handleActivity]);

  // Render nothing, as this component is purely for logic
  return null;
}
