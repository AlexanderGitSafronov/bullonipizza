"use client";

import { LegalDoc } from "@/components/legal/legal-doc";
import { termsContent } from "@/lib/legal-content";
import { useLocale } from "@/i18n/provider";

export default function TermsPage() {
  const { t } = useLocale();
  return <LegalDoc title={t.legal.terms} doc={termsContent} />;
}
