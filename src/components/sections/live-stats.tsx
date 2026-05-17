"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ChefHat, Clock, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/i18n/provider";
import { workingHoursStatus } from "@/lib/hours";

interface Stats {
  ordersToday: number;
  inOven: number;
}

export function LiveStats() {
  const { t } = useLocale();
  const [stats, setStats] = useState<Stats>({ ordersToday: 0, inOven: 0 });
  const [hours, setHours] = useState(() => workingHoursStatus());

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/stats/live", { cache: "no-store" });
        const body = await res.json();
        if (!cancelled && body.ok) {
          setStats({
            ordersToday: body.ordersToday,
            inOven: body.inOven,
          });
        }
      } catch {
        /* ignore */
      }
    };
    void load();
    const interval = setInterval(load, 30_000);
    const tick = setInterval(() => setHours(workingHoursStatus()), 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
      clearInterval(tick);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
      <motion.span
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${
          hours.open
            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
            : "bg-rose-500/10 text-rose-500 border border-rose-500/30"
        }`}
      >
        {hours.open ? (
          <CheckCircle2 className="h-3.5 w-3.5" />
        ) : (
          <Clock className="h-3.5 w-3.5" />
        )}
        {hours.open
          ? t.status.open
          : t.status.opensAt.replace("{time}", hours.next)}
      </motion.span>

      <AnimatePresence>
        {stats.ordersToday > 0 && (
          <motion.span
            key={stats.ordersToday}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium glass border border-border"
          >
            <Flame className="h-3.5 w-3.5 text-primary" />
            <span className="font-display font-bold">{stats.ordersToday}</span>{" "}
            {t.stats.ordersToday}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stats.inOven > 0 && (
          <motion.span
            key={stats.inOven}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium glass border border-border"
          >
            <ChefHat className="h-3.5 w-3.5 text-orange-500" />
            <span className="font-display font-bold">{stats.inOven}</span>{" "}
            {t.stats.inOven}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
