"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, ChevronDown } from "lucide-react";
import { useLocale } from "@/i18n/provider";
import { cn } from "@/lib/utils";

// Slots between now+30min (rounded up to nearest 15) and 22:30.
function generateSlots(): Date[] {
  const slots: Date[] = [];
  const now = new Date();
  const start = new Date(now);
  start.setMinutes(start.getMinutes() + 30, 0, 0);
  const mins = start.getMinutes();
  const remainder = mins % 15;
  if (remainder > 0) {
    start.setMinutes(mins + (15 - remainder));
  }
  const end = new Date(now);
  end.setHours(22, 30, 0, 0);
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
    d.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });

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
            className="mt-3 overflow-hidden"
          >
            <div className="relative">
              <select
                value={value ?? ""}
                onChange={(e) => onChange(Number(e.target.value))}
                className="flex h-12 w-full appearance-none rounded-2xl border border-input bg-background pl-11 pr-10 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              >
                {slots.map((s) => (
                  <option key={s.getTime()} value={s.getTime()}>
                    {fmtTime(s)}
                  </option>
                ))}
              </select>
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none" />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
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
