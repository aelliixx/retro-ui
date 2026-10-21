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

import { cn } from "../../lib/utils";

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
 * toast.success("Copy complete", "3 files written to C:\\TEMP.");
 * toast.error("Merge conflict", "Resolve it by hand.", { duration: 0 });
 * ```
 *
 * `duration` is milliseconds; `0` sticks until dismissed. A pointer parked
 * on a toast holds its timer — leaving restarts the full duration — so a
 * toast never dies while someone is reading it. The stack is a polite
 * live region (`error` toasts assert with `role="alert"`).
 */

type ToastVariant = "info" | "success" | "error";

/**
 * The colour family of a toast — the glyph and the edge rail. Every tone
 * is a design token, so a toast never hardcodes a colour; add a token for
 * a brand hue rather than reaching past the system.
 */
type ToastTone = "accent" | "success" | "danger" | "neutral";

/** where the stack sits in the viewport */
type ToastPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-center";

type ToastOptions = {
  title: string;
  description?: string;
  /** "info" (accent), "success" (green) or "error" (danger) */
  variant?: ToastVariant;
  /** colour for the glyph and the edge rail — defaults to the variant's */
  tone?: ToastTone;
  /** custom glyph, replacing the variant's */
  icon?: React.ReactNode;
  /** ms before auto-dismiss; 0 = sticky until the ✕ key */
  duration?: number;
};

type ToastItem = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
  tone: ToastTone;
  icon?: React.ReactNode;
  duration: number;
};

type ToastPush = (options: ToastOptions) => number;

type ToastContextValue = {
  push: ToastPush;
  dismiss: (id: number) => void;
  /** push with variant: "info" */
  info: (title: string, description?: string, options?: Partial<ToastOptions>) => number;
  /** push with variant: "success" */
  success: (title: string, description?: string, options?: Partial<ToastOptions>) => number;
  /** push with variant: "error" */
  error: (title: string, description?: string, options?: Partial<ToastOptions>) => number;
};

/** the tone each variant wears unless the caller says otherwise */
const VARIANT_TONE: Record<ToastVariant, ToastTone> = {
  info: "accent",
  success: "success",
  error: "danger",
};

/** tone → (edge rail, glyph) — both plain design tokens */
const TONE_CLASSES: Record<ToastTone, { rail: string; text: string }> = {
  accent: { rail: "before:bg-accent", text: "text-accent" },
  success: { rail: "before:bg-success", text: "text-success" },
  danger: { rail: "before:bg-danger", text: "text-danger" },
  neutral: { rail: "before:bg-ink-muted", text: "text-ink-muted" },
};

/** position → the corner/edge the stack is pinned to */
const POSITION_CLASSES: Record<ToastPosition, string> = {
  "bottom-left": "left-4 bottom-4",
  "bottom-right": "right-4 bottom-4",
  "top-left": "left-4 top-4",
  "top-right": "right-4 top-4",
  "top-center": "left-1/2 top-4 -translate-x-1/2",
  "bottom-center": "left-1/2 bottom-4 -translate-x-1/2",
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
  /** class for the fixed stack */
  className?: string;
  /** where the stack sits in the viewport */
  position?: ToastPosition;
  children?: React.ReactNode;
};

function ToastProvider({
  className,
  position = "bottom-left",
  children,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      const variant = options.variant ?? "info";
      setToasts((current) => [
        ...current,
        {
          id,
          title: options.title,
          description: options.description,
          variant,
          tone: options.tone ?? VARIANT_TONE[variant],
          icon: options.icon,
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
      success: (title: string, description?: string, options?: Partial<ToastOptions>) =>
        push({ title, description, ...options, variant: "success" }),
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
        data-position={position}
        aria-label="Notifications"
        className={cn(
          "pointer-events-none fixed z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2",
          POSITION_CLASSES[position],
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
  // a pointer parked on the toast holds the timer; when it leaves, the
  // full duration restarts — a toast shouldn't die while people read it
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (item.duration <= 0 || hovered) return;
    const timer = setTimeout(() => onDismiss(item.id), item.duration);
    return () => clearTimeout(timer);
  }, [item, onDismiss, hovered]);

  const tone = TONE_CLASSES[item.tone];

  return (
    <div
      data-slot="toast"
      data-variant={item.variant}
      data-tone={item.tone}
      data-hovered={hovered || undefined}
      role={item.variant === "error" ? "alert" : "status"}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={cn(
        "pointer-events-auto relative border border-ink bg-surface p-3 pr-9 text-ink shadow-out",
        // the tone rail — a solid cut down the left edge
        'before:absolute before:inset-y-0 before:left-0 before:w-1 before:content-[""]',
        tone.rail,
      )}
    >
      <div className="flex items-start gap-2.5">
        {/* the glyph wears the tone; a custom icon replaces it entirely */}
        <span className={cn("mt-0.5 shrink-0", tone.text)}>
          {item.icon ?? <Glyph variant={item.variant} />}
        </span>
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
  if (variant === "error") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        width="16"
        height="16"
      >
        <circle cx="8" cy="8" r="7" fill="currentColor" />
        <circle cx="8" cy="8" r="5.5" fill="var(--surface)" />
        <rect x="4.6" y="7" width="6.8" height="2" fill="currentColor" />
      </svg>
    );
  }
  if (variant === "success") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        width="16"
        height="16"
      >
        <circle cx="8" cy="8" r="7" fill="currentColor" />
        <circle cx="8" cy="8" r="5.5" fill="var(--surface)" />
        <path d="M4.9 8.3 7 10.4 11.1 5.9" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      height="16"
    >
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <circle cx="8" cy="8" r="5.5" fill="var(--surface)" />
      <rect x="7.1" y="3.7" width="1.8" height="2" fill="currentColor" />
      <rect x="7.1" y="6.8" width="1.8" height="5" fill="currentColor" />
    </svg>
  );
}

export { ToastProvider, useToast };
export type {
  ToastOptions,
  ToastVariant,
  ToastTone,
  ToastPosition,
  ToastProviderProps,
};
