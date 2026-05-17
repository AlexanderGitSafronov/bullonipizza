"use client";

import { LegalDoc } from "@/components/legal/legal-doc";
import { cookieContent } from "@/lib/legal-content";
import { useLocale } from "@/i18n/provider";
import { Button } from "@/components/ui/button";
import { useConsent } from "@/store/consent";

export default function CookiePolicyPage() {
  const { t, locale } = useLocale();
  const consent = useConsent();
  return (
    <>
      <LegalDoc title={t.legal.cookies} doc={cookieContent} />
      <div className="container max-w-3xl pb-16">
        <div className="rounded-3xl border border-border bg-card p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <p className="font-semibold text-sm">
              {locale === "en"
                ? "Cookie settings"
                : locale === "ru"
                  ? "Настройки cookie"
                  : "Налаштування cookie"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === "en"
                ? "Change your previous choice."
                : locale === "ru"
                  ? "Измените свой выбор."
                  : "Змінити свій вибір."}
            </p>
          </div>
          <Button onClick={consent.reset}>
            {t.legal.cookieBanner.customize}
          </Button>
        </div>
      </div>
    </>
  );
}
