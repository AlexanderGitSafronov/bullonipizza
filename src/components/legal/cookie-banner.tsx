"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ShieldCheck, BarChart3, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConsent } from "@/store/consent";
import { useLocale } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export function CookieBanner() {
  const { t } = useLocale();
  const consent = useConsent();
  const [mounted, setMounted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(consent.analytics);
  const [marketing, setMarketing] = useState(consent.marketing);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setAnalytics(consent.analytics);
    setMarketing(consent.marketing);
  }, [consent.analytics, consent.marketing]);

  if (!mounted || consent.decided) return null;

  const onSave = () => consent.setPartial({ analytics, marketing });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        transition={{ type: "spring", damping: 30 }}
        className="fixed bottom-3 left-3 right-3 md:bottom-6 md:right-6 md:left-auto md:max-w-md z-[60]"
        role="dialog"
        aria-labelledby="cookie-title"
        aria-describedby="cookie-body"
      >
        <div className="glass rounded-3xl shadow-card border border-border overflow-hidden">
          <div className="p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="h-10 w-10 rounded-2xl bg-brand-gradient flex items-center justify-center shrink-0">
                <Cookie className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 id="cookie-title" className="font-semibold text-sm">
                  {t.legal.cookieBanner.title}
                </h3>
                <p
                  id="cookie-body"
                  className="text-xs text-muted-foreground mt-1 leading-relaxed"
                >
                  {t.legal.cookieBanner.body}{" "}
                  <Link
                    href="/legal/cookies"
                    className="underline hover:text-foreground"
                  >
                    {t.legal.cookieBanner.more}
                  </Link>
                </p>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 mb-3 pt-2">
                    <CategoryRow
                      icon={ShieldCheck}
                      title={t.legal.categories.necessary}
                      desc={t.legal.categories.necessaryDesc}
                      checked
                      disabled
                      alwaysLabel={t.legal.categories.always}
                    />
                    <CategoryRow
                      icon={BarChart3}
                      title={t.legal.categories.analytics}
                      desc={t.legal.categories.analyticsDesc}
                      checked={analytics}
                      onChange={setAnalytics}
                    />
                    <CategoryRow
                      icon={Megaphone}
                      title={t.legal.categories.marketing}
                      desc={t.legal.categories.marketingDesc}
                      checked={marketing}
                      onChange={setMarketing}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap gap-2">
              {!showDetails ? (
                <>
                  <Button
                    size="sm"
                    onClick={consent.acceptAll}
                    className="flex-1 min-w-[120px]"
                  >
                    {t.legal.cookieBanner.accept}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={consent.rejectAll}
                    className="flex-1 min-w-[120px]"
                  >
                    {t.legal.cookieBanner.reject}
                  </Button>
                  <button
                    onClick={() => setShowDetails(true)}
                    className="w-full text-xs text-muted-foreground hover:text-foreground mt-1 underline-offset-4 hover:underline"
                  >
                    {t.legal.cookieBanner.customize}
                  </button>
                </>
              ) : (
                <Button size="sm" onClick={onSave} className="w-full">
                  {t.legal.cookieBanner.save}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function CategoryRow({
  icon: Icon,
  title,
  desc,
  checked,
  disabled,
  alwaysLabel,
  onChange,
}: {
  icon: typeof ShieldCheck;
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  alwaysLabel?: string;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/50">
      <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold">{title}</p>
          {disabled ? (
            <span className="text-[10px] text-muted-foreground">
              {alwaysLabel}
            </span>
          ) : (
            <button
              type="button"
              role="switch"
              aria-checked={checked}
              onClick={() => onChange?.(!checked)}
              className={cn(
                "relative h-5 w-9 rounded-full transition-colors",
                checked ? "bg-primary" : "bg-border"
              )}
            >
              <motion.span
                animate={{ x: checked ? 16 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow"
              />
            </button>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
          {desc}
        </p>
      </div>
    </div>
  );
}
