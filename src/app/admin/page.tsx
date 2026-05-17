"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Pizza,
  ShoppingBag,
  TrendingUp,
  Users,
  Plus,
  Edit3,
  Trash2,
  Lock,
} from "lucide-react";
import { useLocale } from "@/i18n/provider";
import { useAuth } from "@/store/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrdersBoard } from "@/components/admin/orders-board";
import {
  ProductEditor,
  type ProductRow,
  type CategoryRow,
} from "@/components/admin/product-editor";
import { formatPrice, cn } from "@/lib/utils";

type Tab = "orders" | "products";

export default function AdminPage() {
  const { t, locale } = useLocale();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("orders");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [stats, setStats] = useState({ orders: 0, revenue: 0, customers: 0 });

  const refresh = useCallback(async () => {
    try {
      const [p, o] = await Promise.all([
        fetch("/api/admin/products", { cache: "no-store" }),
        fetch("/api/admin/orders", { cache: "no-store" }),
      ]);
      const pj = await p.json();
      const oj = await o.json();
      if (pj.ok) {
        setProducts(pj.products);
        setCategories(pj.categories);
      }
      if (oj.ok) {
        const orders = oj.orders as Array<{
          total: string;
          phone: string;
        }>;
        setStats({
          orders: orders.length,
          revenue: orders.reduce((a, o) => a + Number(o.total), 0),
          customers: new Set(orders.map((o) => o.phone)).size,
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login?next=/admin");
      return;
    }
    if (user.role !== "ADMIN") return;
    void refresh();
  }, [user, loading, router, refresh]);

  if (loading) {
    return (
      <div className="container py-20 text-center text-muted-foreground">
        {t.common.loading}
      </div>
    );
  }

  if (!user) return null;

  if (user.role !== "ADMIN") {
    return (
      <div className="container py-20 text-center max-w-md">
        <div className="inline-flex h-20 w-20 rounded-full bg-destructive/10 items-center justify-center mb-6">
          <Lock className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">
          Access denied
        </h1>
        <p className="text-muted-foreground">
          {locale === "en"
            ? "Admin access only."
            : locale === "ru"
              ? "Только для администраторов."
              : "Лише для адміністраторів."}
        </p>
      </div>
    );
  }

  const statCards = [
    {
      icon: ShoppingBag,
      label: locale === "en" ? "Active orders" : locale === "ru" ? "Активных заказов" : "Активних замовлень",
      value: stats.orders,
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: TrendingUp,
      label: locale === "en" ? "Active revenue" : locale === "ru" ? "Активная выручка" : "Активна виручка",
      value: formatPrice(stats.revenue),
      color: "from-emerald-500 to-green-600",
    },
    {
      icon: Pizza,
      label: t.admin.products,
      value: products.filter((p) => p.isAvailable).length,
      color: "from-rose-500 to-red-600",
    },
    {
      icon: Users,
      label: locale === "en" ? "Customers" : locale === "ru" ? "Клиенты" : "Клієнти",
      value: stats.customers,
      color: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <div className="container py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            {t.admin.title}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {user.email}
          </p>
        </div>
        {tab === "products" && (
          <Button
            onClick={() => {
              setEditing(null);
              setEditorOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            {t.admin.new}
          </Button>
        )}
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
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
        {(["orders", "products"] as Tab[]).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium transition-colors",
              tab === k
                ? "bg-foreground text-background"
                : "bg-secondary text-foreground"
            )}
          >
            {k === "orders" ? t.admin.orders : t.admin.products}
          </button>
        ))}
      </div>

      {tab === "orders" && <OrdersBoard />}

      {tab === "products" && (
        <div className="rounded-3xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr className="text-left text-xs text-muted-foreground uppercase">
                  <th className="p-4">Product</th>
                  <th className="p-4">Flags</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 w-1"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className={cn(
                      "border-t border-border",
                      !p.isAvailable && "opacity-50"
                    )}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-secondary shrink-0">
                          {p.image && (
                            <Image
                              src={p.image}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{p.nameUk}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">
                            {p.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {p.isPopular && <Badge variant="hot">🔥</Badge>}
                        {!p.isAvailable && (
                          <Badge variant="outline">hidden</Badge>
                        )}
                        {p.discount > 0 && (
                          <Badge variant="warning">−{p.discount}%</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right font-semibold">
                      {formatPrice(Number(p.basePrice))}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditing(p);
                            setEditorOpen(true);
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={async () => {
                            if (
                              !confirm(`Hide product "${p.nameUk}"?`)
                            )
                              return;
                            await fetch(`/api/admin/products/${p.id}`, {
                              method: "DELETE",
                            });
                            void refresh();
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-rose-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No products yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ProductEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        product={editing}
        categories={categories}
        onSaved={() => void refresh()}
      />
    </div>
  );
}
