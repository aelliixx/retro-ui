"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

/**
 * The notification stack — balloons from the tray, minus the balloon
 * physics: toasts appear instantly in a fixed corner, wait out their timer
 * (or the ✕ key), and vanish. No slide-in, no fade.
 *
 * Mount `<ToastProvider>` once — it renders the live region and the stack.
 * Push with the `useToast()` hook:
 *
 * ```tsx
 * const toast = useToast();
 * toast.info("Saved", "Your document is on the disk.");
 * toast.error("Merge conflict", "Resolve it by hand.", { duration: 0 });
 * ```
 *
 * `duration` is milliseconds; `0` sticks until dismissed. The stack is a
 * polite live region (`error` toasts assert with `role="alert"`).
 */

type ToastVariant = "info" | "error";

type ToastOptions = {
  title: string;
  description?: string;
  /** "info" (accent) or "error" (danger) — mirrors Dialog */
  variant?: ToastVariant;
  /** ms before auto-dismiss; 0 = sticky until the ✕ key */
  duration?: number;
};

type ToastItem = Required<Pick<ToastOptions, "variant" | "duration">> &
  Omit<ToastOptions, "variant" | "duration"> & { id: number };

type ToastPush = (options: ToastOptions) => number;

type ToastContextValue = {
  push: ToastPush;
  dismiss: (id: number) => void;
  /** push with variant: "info" */
  info: (title: string, description?: string, options?: Partial<ToastOptions>) => number;
  /** push with variant: "error" */
  error: (title: string, description?: string, options?: Partial<ToastOptions>) => number;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("retro/ui: useToast() must be used inside <ToastProvider>");
  }
  return ctx;
}

type ToastProviderProps = {
  /** class for the fixed bottom-corner stack */
  className?: string;
  children?: React.ReactNode;
};

function ToastProvider({ className, children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      setToasts((current) => [
        ...current,
        {
          id,
          title: options.title,
          description: options.description,
          variant: options.variant ?? "info",
          duration: options.duration ?? 5000,
        },
      ]);
      return id;
    },
    [],
  );

  const value = useMemo(
    () => ({
      push,
      dismiss,
      info: (title: string, description?: string, options?: Partial<ToastOptions>) =>
        push({ title, description, ...options, variant: "info" }),
      error: (title: string, description?: string, options?: Partial<ToastOptions>) =>
        push({ title, description, ...options, variant: "error" }),
    }),
    [push, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        data-slot="toast-region"
        aria-label="Notifications"
        className={cn(
          "pointer-events-none fixed right-4 bottom-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2",
          className,
        )}
      >
        {toasts.map((item) => (
          <Toast key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    if (item.duration <= 0) return;
    const timer = setTimeout(() => onDismiss(item.id), item.duration);
    return () => clearTimeout(timer);
  }, [item, onDismiss]);

  return (
    <div
      data-slot="toast"
      data-variant={item.variant}
      role={item.variant === "error" ? "alert" : "status"}
      className={cn(
        "pointer-events-auto relative border border-ink bg-surface p-3 pr-9 text-ink shadow-out",
        // the variant rail — a solid cut down the left edge
        'before:absolute before:inset-y-0 before:left-0 before:w-1 before:content-[""]',
        item.variant === "error" ? "before:bg-danger" : "before:bg-accent",
      )}
    >
      <div className="flex items-start gap-2.5">
        <Glyph variant={item.variant} />
        <div className="min-w-0">
          <p className="text-sm font-semibold">{item.title}</p>
          {item.description ? (
            <p className="mt-0.5 text-sm text-ink-muted">{item.description}</p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        data-slot="toast-dismiss"
        aria-label="Dismiss notification"
        className={cn(
          "focus-etched absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center border border-ink bg-surface text-sm font-bold",
          "enabled:cursor-pointer enabled:hover:bg-surface-2 enabled:active:shadow-in",
        )}
        onClick={() => onDismiss(item.id)}
      >
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  );
}

function Glyph({ variant }: { variant: ToastVariant }) {
  return variant === "error" ? (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      className="mt-0.5 shrink-0 text-danger"
    >
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <circle cx="8" cy="8" r="5.5" fill="var(--surface)" />
      <rect x="4.6" y="7" width="6.8" height="2" fill="currentColor" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      className="mt-0.5 shrink-0 text-accent"
    >
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <circle cx="8" cy="8" r="5.5" fill="var(--surface)" />
      <rect x="7.1" y="3.7" width="1.8" height="2" fill="currentColor" />
      <rect x="7.1" y="6.8" width="1.8" height="5" fill="currentColor" />
    </svg>
  );
}

export { ToastProvider, useToast };
export type { ToastOptions, ToastVariant, ToastProviderProps };
