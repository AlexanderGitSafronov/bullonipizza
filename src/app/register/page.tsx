"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Pizza,
  Mail,
  Lock,
  User as UserIcon,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/i18n/provider";
import { useAuth } from "@/store/auth";
import { registerSchema, type RegisterInput } from "@/lib/auth-validation";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-20 text-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <RegisterInner />
    </Suspense>
  );
}

function RegisterInner() {
  const { t } = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/orders";
  const { setUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { consent: undefined as unknown as true },
  });

  const consentChecked = watch("consent");

  const onSubmit = async (data: RegisterInput) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        const code = body.error;
        toast.error(
          code === "email_taken"
            ? t.auth.emailTaken
            : code === "rate_limited"
              ? t.checkout.rateLimit
              : code === "invalid_payload" && body.field === "password"
                ? t.auth.passwordTooShort
                : t.common.error
        );
        return;
      }
      setUser(body.user);
      toast.success(t.auth.accountCreated);
      router.push(next);
      router.refresh();
    } catch {
      toast.error(t.common.error);
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    t.auth.benefits.orders,
    t.auth.benefits.tracking,
    t.auth.benefits.faster,
  ];

  return (
    <div className="container max-w-5xl py-12 md:py-20">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> {t.common.back}
      </Link>

      <div className="grid md:grid-cols-[1fr,1.1fr] gap-8 md:gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:sticky md:top-24"
        >
          <div className="inline-flex h-14 w-14 rounded-2xl bg-brand-gradient items-center justify-center shadow-glow mb-5">
            <Pizza className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">
            {t.auth.createAccount}
          </h1>
          <p className="text-muted-foreground mt-3">{t.auth.benefits.title}</p>

          <ul className="mt-6 space-y-3">
            {benefits.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </span>
                <span className="text-sm">{b}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card"
          noValidate
        >
          <div>
            <Label htmlFor="name">{t.auth.name}</Label>
            <div className="relative mt-1.5">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                autoComplete="name"
                placeholder={t.auth.namePh}
                className="pl-11"
                maxLength={60}
                {...register("name")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">{t.auth.email}</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={t.auth.emailPh}
                className="pl-11"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{t.common.error}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">{t.auth.password}</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder={t.auth.passwordPh}
                className="pl-11"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-destructive mt-1">
                {t.auth.passwordTooShort}
              </p>
            )}
          </div>

          <label
            htmlFor="consent"
            className="flex items-start gap-3 cursor-pointer py-2 select-none"
          >
            <input
              id="consent"
              type="checkbox"
              className="sr-only"
              checked={!!consentChecked}
              onChange={(e) =>
                setValue("consent", e.target.checked as true, {
                  shouldValidate: true,
                })
              }
            />
            <span
              aria-hidden
              className={`mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${
                consentChecked
                  ? "bg-primary border-primary"
                  : errors.consent
                    ? "border-destructive"
                    : "border-border"
              }`}
            >
              {consentChecked && <Check className="h-3.5 w-3.5 text-white" />}
            </span>
            <span
              className={`text-xs leading-snug ${errors.consent ? "text-destructive" : "text-muted-foreground"}`}
            >
              {t.auth.consentRegister} —{" "}
              <Link
                href="/legal/privacy"
                target="_blank"
                className="underline text-primary hover:text-foreground"
              >
                {t.legal.privacy}
              </Link>
            </span>
          </label>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? t.auth.creating : t.auth.createAccount}
          </Button>

          <p className="text-center text-sm text-muted-foreground pt-2">
            {t.auth.haveAccount}{" "}
            <Link
              href={`/login${next !== "/orders" ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-primary font-semibold hover:underline"
            >
              {t.auth.signIn}
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
