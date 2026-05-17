"use client";

import { LegalDoc } from "@/components/legal/legal-doc";
import { privacyContent } from "@/lib/legal-content";
import { useLocale } from "@/i18n/provider";

export default function PrivacyPage() {
  const { t } = useLocale();
  return <LegalDoc title={t.legal.privacy} doc={privacyContent} />;
}
