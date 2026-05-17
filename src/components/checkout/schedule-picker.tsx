"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap } from "lucide-react";
import { useLocale } from "@/i18n/provider";
import { cn } from "@/lib/utils";

// Returns the next half-hour slots between now+1h and end-of-day (22:00 by default).
function generateSlots(): Date[] {
  const slots: Date[] = [];
  const now = new Date();
  const start = new Date(now);
  // Round up to next 30min, +60 min lead time.
  start.setMinutes(start.getMinutes() + 60);
  start.setMinutes(start.getMinutes() < 30 ? 30 : 60, 0, 0);
  const end = new Date(now);
  end.setHours(22, 0, 0, 0);
  for (let t = start.getTime(); t <= end.getTime(); t += 30 * 60 * 1000) {
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
            if (slots.length > 0 && value === null)
              onChange(slots[Math.min(2, slots.length - 1)].getTime());
          }}
          className={cn(
            "flex items-center gap-2 px-3 py-3 rounded-2xl border text-left transition-all",
            value !== null
              ? "border-primary bg-accent text-foreground"
              : "border-border bg-card hover:bg-secondary",
            !hasSlots && "opacity-50 cursor-not-allowed"
          )}
          disabled={!hasSlots}
        >
          <Clock className="h-4 w-4 text-primary shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate">
              {t.scheduled.laterToday}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {value !== null
                ? new Date(value).toLocaleTimeString(locale, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : t.scheduled.pickTime}
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
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {slots.map((s) => {
                const active = s.getTime() === value;
                return (
                  <button
                    key={s.getTime()}
                    type="button"
                    onClick={() => onChange(s.getTime())}
                    className={cn(
                      "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors",
                      active
                        ? "bg-primary text-white border-primary"
                        : "border-border bg-card hover:bg-secondary"
                    )}
                  >
                    {s.toLocaleTimeString(locale, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {t.scheduled.note}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
