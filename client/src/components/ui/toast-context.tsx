// src/components/ui/toast-context.tsx
import { createContext, useContext } from "react";

export type Toast = {
  id: number;
  title: string;
  description?: string;
};

type ToastContextType = {
  toast: (opts: { title: string; description?: string }) => void;
  toasts: Toast[];
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
