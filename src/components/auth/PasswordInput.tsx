"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  register: UseFormRegisterReturn;
}

export const PasswordInput = ({
  label,
  error,
  register,
  className,
  placeholder,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        </div>
        <input
          {...register}
          type={showPassword ? "text" : "password"}
          className={cn(
            "block w-full rounded-xl border-slate-200 bg-white/50 pl-12 pr-10 py-3.5 text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus:bg-white",
            "hover:border-slate-300",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          placeholder={placeholder}
          {...props}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};
