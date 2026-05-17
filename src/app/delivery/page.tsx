"use client";

import dynamic from "next/dynamic";
import { DeliveryInfo } from "@/components/sections/delivery-info";
import { Features } from "@/components/sections/features";
import { useLocale } from "@/i18n/provider";

const ZoneMap = dynamic(
  () => import("@/components/delivery/zone-map").then((m) => m.ZoneMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] md:h-[480px] w-full rounded-3xl bg-secondary/40 animate-pulse border border-border" />
    ),
  }
);

export default function DeliveryPage() {
  const { t } = useLocale();
  return (
    <div className="py-8 md:py-12">
      <div className="container text-center mb-4">
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
          {t.delivery.title}
        </h1>
        <p className="mt-2 text-muted-foreground">{t.delivery.subtitle}</p>
      </div>
      <DeliveryInfo />
      <div className="container py-10">
        <ZoneMap />
      </div>
      <Features />
    </div>
  );
}
