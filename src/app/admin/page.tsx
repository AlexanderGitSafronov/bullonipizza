"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Pizza, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { useLocale } from "@/i18n/provider";
import { useProductFields } from "@/hooks/use-product-fields";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { sampleProducts } from "@/lib/sample-data";

interface StoredOrder {
  orderNumber: string;
  name: string;
  phone: string;
  total: number;
  createdAt: number;
}

export default function AdminPage() {
  const { t, locale } = useLocale();
  const { nameOf } = useProductFields();
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("bp_orders") ?? "{}") as Record<
        string,
        StoredOrder
      >;
      setOrders(
        Object.values(stored).sort((a, b) => b.createdAt - a.createdAt)
      );
    } catch {
      setOrders([]);
    }
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  const stats = [
    {
      icon: ShoppingBag,
      label: t.admin.orders,
      value: orders.length,
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: TrendingUp,
      label: locale === "en" ? "Revenue" : locale === "ru" ? "Выручка" : "Виручка",
      value: formatPrice(totalRevenue),
      color: "from-emerald-500 to-green-600",
    },
    {
      icon: Pizza,
      label: t.admin.products,
      value: sampleProducts.length,
      color: "from-rose-500 to-red-600",
    },
    {
      icon: Users,
      label: locale === "en" ? "Customers" : locale === "ru" ? "Клиенты" : "Клієнти",
      value: new Set(orders.map((o) => o.phone)).size,
      color: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <div className="container py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold">
          {t.admin.title}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          BulloniPizza · {locale === "en" ? "Dashboard" : locale === "ru" ? "Панель" : "Панель"}
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-3xl border border-border bg-card p-5 shadow-card"
          >
            <div
              className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3`}
            >
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="font-display text-2xl font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("products")}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
            tab === "products"
              ? "bg-foreground text-background"
              : "bg-secondary text-foreground"
          }`}
        >
          {t.admin.products}
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
            tab === "orders"
              ? "bg-foreground text-background"
              : "bg-secondary text-foreground"
          }`}
        >
          {t.admin.orders}
        </button>
      </div>

      {tab === "products" ? (
        <div className="rounded-3xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr className="text-left text-xs text-muted-foreground uppercase">
                  <th className="p-4">{locale === "en" ? "Product" : "Продукт"}</th>
                  <th className="p-4">{t.menu.popular}</th>
                  <th className="p-4 text-right">
                    {locale === "en" ? "Price" : locale === "ru" ? "Цена" : "Ціна"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sampleProducts.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-secondary shrink-0">
                          <Image
                            src={p.image}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{nameOf(p)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {p.isPopular ? (
                        <Badge variant="hot">🔥</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right font-semibold">
                      {formatPrice(p.basePrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              <p className="text-4xl mb-3">📋</p>
              <p>{locale === "en" ? "No orders yet" : locale === "ru" ? "Заказов пока нет" : "Замовлень ще немає"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr className="text-left text-xs text-muted-foreground uppercase">
                    <th className="p-4">{t.order.number}</th>
                    <th className="p-4">{t.checkout.name}</th>
                    <th className="p-4">{t.checkout.phone}</th>
                    <th className="p-4 text-right">{t.cart.total}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.orderNumber} className="border-t border-border">
                      <td className="p-4 font-mono text-xs">{o.orderNumber}</td>
                      <td className="p-4">{o.name}</td>
                      <td className="p-4 text-muted-foreground">{o.phone}</td>
                      <td className="p-4 text-right font-semibold">
                        {formatPrice(o.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
