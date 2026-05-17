"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, DollarSign, Download } from "lucide-react";
import { useLocale } from "@/i18n/provider";
import { useProductFields } from "@/hooks/use-product-fields";
import { formatPrice } from "@/lib/utils";

interface DayPoint {
  date: string;
  orders: number;
  revenue: number;
}
interface TopProduct {
  id: string;
  qty: number;
  nameUk: string;
  nameEn: string;
  nameRu: string;
  image: string;
}
interface Data {
  timeline: DayPoint[];
  topProducts: TopProduct[];
  totals: { revenue: number; orders: number; avgOrder: number };
}

export function AdminAnalytics() {
  const { t, locale } = useLocale();
  const { nameOf } = useProductFields();
  const [range, setRange] = useState<7 | 14 | 30>(14);
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/analytics?days=${range}`, {
          cache: "no-store",
        });
        const body = await res.json();
        if (!cancelled && body.ok) {
          setData({
            timeline: body.timeline,
            topProducts: body.topProducts,
            totals: body.totals,
          });
        }
      } catch {
        /* ignore */
      }
    };
    void load();
    const i = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(i);
    };
  }, [range]);

  const maxRevenue = Math.max(
    1,
    ...(data?.timeline ?? []).map((d) => d.revenue)
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1.5 p-1 rounded-full bg-secondary">
          {([7, 14, 30] as const).map((d) => (
            <button
              key={d}
              onClick={() => setRange(d)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                range === d
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
        <a
          href="/api/admin/orders/export"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-secondary hover:bg-accent transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          CSV
        </a>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {[
          {
            icon: DollarSign,
            label: t.admin.activeRevenue,
            value: data ? formatPrice(data.totals.revenue) : "—",
            color: "from-emerald-500 to-green-600",
          },
          {
            icon: ShoppingBag,
            label: t.admin.orders,
            value: data ? data.totals.orders : "—",
            color: "from-amber-500 to-orange-600",
          },
          {
            icon: TrendingUp,
            label: locale === "en" ? "Avg. order" : locale === "ru" ? "Средний чек" : "Середній чек",
            value: data ? formatPrice(data.totals.avgOrder) : "—",
            color: "from-rose-500 to-red-600",
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-3xl border border-border bg-card p-5"
          >
            <div
              className={`h-9 w-9 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-2`}
            >
              <s.icon className="h-4 w-4" />
            </div>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
            <p className="font-display text-2xl font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-card p-5">
        <h3 className="font-display text-lg font-bold mb-4">
          {locale === "en" ? "Revenue by day" : locale === "ru" ? "Выручка по дням" : "Виручка по днях"}
        </h3>
        <div className="flex items-end gap-1 md:gap-2 h-48">
          {data?.timeline.map((d) => {
            const heightPct = (d.revenue / maxRevenue) * 100;
            return (
              <div
                key={d.date}
                className="flex-1 flex flex-col items-center justify-end group"
              >
                <div className="opacity-0 group-hover:opacity-100 text-[10px] mb-1 font-mono transition-opacity whitespace-nowrap">
                  {formatPrice(d.revenue)}
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(2, heightPct)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full bg-brand-gradient rounded-t-md hover:opacity-90 cursor-pointer min-h-[3px]"
                  title={`${d.date} · ${formatPrice(d.revenue)} · ${d.orders} orders`}
                />
              </div>
            );
          })}
        </div>
        {data && data.timeline.length > 0 && (
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2 font-mono">
            <span>{data.timeline[0].date.slice(5)}</span>
            <span>
              {data.timeline[data.timeline.length - 1].date.slice(5)}
            </span>
          </div>
        )}
      </div>

      {data && data.topProducts.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-5">
          <h3 className="font-display text-lg font-bold mb-4">
            {locale === "en" ? "Top sellers" : locale === "ru" ? "Топ продаж" : "Топ продажів"}
          </h3>
          <div className="space-y-2">
            {data.topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-5 text-center font-bold text-muted-foreground">
                  {i + 1}
                </span>
                <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-secondary shrink-0">
                  <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                </div>
                <p className="flex-1 text-sm font-medium truncate">
                  {nameOf(p)}
                </p>
                <span className="font-display text-lg font-bold">{p.qty}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
