"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, ChevronDown } from "lucide-react";
import { useLocale } from "@/i18n/provider";
import { OPEN_HOUR, CLOSE_HOUR } from "@/lib/hours";
import { cn } from "@/lib/utils";

// Slots = max(now+30min, today's OPEN_HOUR) → today's CLOSE_HOUR - 30min,
// rounded up to nearest 15 min. Empty if we're already past closing.
function generateSlots(): Date[] {
  const slots: Date[] = [];
  const now = new Date();

  const earliest = new Date(now);
  earliest.setMinutes(earliest.getMinutes() + 30, 0, 0);
  const r = earliest.getMinutes() % 15;
  if (r > 0) earliest.setMinutes(earliest.getMinutes() + (15 - r));

  const openToday = new Date(now);
  openToday.setHours(OPEN_HOUR, 0, 0, 0);

  const start = earliest.getTime() > openToday.getTime() ? earliest : openToday;

  const end = new Date(now);
  end.setHours(CLOSE_HOUR - 1, 30, 0, 0); // 22:30 if CLOSE_HOUR=23

  if (end.getTime() < start.getTime()) return [];
  for (let t = start.getTime(); t <= end.getTime(); t += 15 * 60 * 1000) {
    slots.push(new Date(t));
  }
  return slots;
}

export function SchedulePicker({
  value,
  onChange,
  locale,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  locale: string;
}) {
  const { t } = useLocale();
  const slots = useMemo(generateSlots, []);
  const hasSlots = slots.length > 0;

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <p className="text-sm font-semibold mb-2">{t.scheduled.title}</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={cn(
            "flex items-center gap-2 px-3 py-3 rounded-2xl border text-left transition-all",
            value === null
              ? "border-primary bg-accent text-foreground"
              : "border-border bg-card hover:bg-secondary"
          )}
        >
          <Zap className="h-4 w-4 text-primary shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate">
              {t.scheduled.asap.split("(")[0].trim()}
            </p>
            <p className="text-[10px] text-muted-foreground">≈30 min</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => {
            if (hasSlots) {
              onChange(
                value !== null
                  ? value
                  : slots[Math.min(2, slots.length - 1)].getTime()
              );
            }
          }}
          className={cn(
            "flex items-center gap-2 px-3 py-3 rounded-2xl border text-left transition-all",
            value !== null
              ? "border-primary bg-accent text-foreground"
              : "border-border bg-card hover:bg-secondary"
          )}
        >
          <Clock className="h-4 w-4 text-primary shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate">
              {t.scheduled.laterToday}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {value !== null
                ? fmtTime(new Date(value))
                : hasSlots
                  ? t.scheduled.pickTime
                  : "—"}
            </p>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {value !== null && hasSlots && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-visible"
          >
            <TimeDropdown
              slots={slots}
              value={value}
              onChange={onChange}
              fmtTime={fmtTime}
            />
            <p className="text-[10px] text-muted-foreground mt-1.5">
              {t.scheduled.note}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!hasSlots && (
        <p className="mt-3 text-xs text-muted-foreground italic">
          {locale === "en"
            ? "No slots available today — order ASAP or come back tomorrow."
            : locale === "ru"
              ? "На сегодня слотов нет — закажите сейчас или приходите завтра."
              : "На сьогодні слотів немає — замовте зараз або поверніться завтра."}
        </p>
      )}
    </div>
  );
}

// Custom dropdown so we can cap the panel height — the native <select>
// renders a list as tall as the option count on desktop, which blew up
// the whole viewport with 80+ slots.
function TimeDropdown({
  slots,
  value,
  onChange,
  fmtTime,
}: {
  slots: Date[];
  value: number;
  onChange: (v: number) => void;
  fmtTime: (d: Date) => string;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    // Scroll the currently selected option into view when opening.
    setTimeout(() => {
      activeRef.current?.scrollIntoView({ block: "nearest" });
    }, 0);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const currentLabel = fmtTime(new Date(value));

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-12 w-full items-center justify-between rounded-2xl border border-input bg-background pl-11 pr-4 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 relative"
      >
        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
        <span>{currentLabel}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-2 rounded-2xl border border-border bg-popover shadow-xl overflow-hidden"
            role="listbox"
          >
            <div className="max-h-64 overflow-y-auto py-1">
              {slots.map((s) => {
                const t = s.getTime();
                const active = t === value;
                return (
                  <button
                    key={t}
                    ref={active ? activeRef : undefined}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(t);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2 text-sm transition-colors text-left",
                      active
                        ? "bg-accent text-foreground font-semibold"
                        : "hover:bg-secondary"
                    )}
                  >
                    {fmtTime(s)}
                    {active && (
                      <span className="text-primary text-xs">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
