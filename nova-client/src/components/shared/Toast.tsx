"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "warning" | "info" | "loading";

export interface ToastProps {
  id: string;
  variant?: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}

const toastIcons = {
  success: <Check className="h-5 w-5 text-emerald-400" />,
  error: <X className="h-5 w-5 text-rose-400" />,
  warning: <AlertCircle className="h-5 w-5 text-amber-400" />,
  info: <Info className="h-5 w-5 text-indigo-400" />,
  loading: <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />,
};

const toastColors = {
  success: "bg-emerald-500/10 border-emerald-500/20",
  error: "bg-rose-500/10 border-rose-500/20",
  warning: "bg-amber-500/10 border-amber-500/20",
  info: "bg-indigo-500/10 border-indigo-500/20",
  loading: "bg-indigo-500/10 border-indigo-500/20",
};

export function Toast({ variant = "info", title, description, duration = 5000, onClose }: ToastProps) {
  React.useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl min-w-[320px] max-w-md",
        toastColors[variant]
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{toastIcons[variant]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm">{title}</p>
        {description && <p className="text-sm text-slate-300 mt-1">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastProps[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onClose={() => onRemove(toast.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
