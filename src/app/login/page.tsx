"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pizza, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/i18n/provider";
import { useAuth } from "@/store/auth";
import { loginSchema, type LoginInput } from "@/lib/auth-validation";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-20 text-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const { t } = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/orders";
  const { setUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        toast.error(
          body.error === "invalid_credentials"
            ? t.auth.invalidCredentials
            : body.error === "rate_limited"
              ? t.checkout.rateLimit
              : t.common.error
        );
        return;
      }
      setUser(body.user);
      toast.success(t.auth.welcomeBack);
      router.push(next);
      router.refresh();
    } catch {
      toast.error(t.common.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-md py-12 md:py-20">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> {t.common.back}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex h-14 w-14 rounded-2xl bg-brand-gradient items-center justify-center shadow-glow mb-4">
          <Pizza className="h-7 w-7 text-white" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold">
          {t.auth.login}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {t.auth.welcomeBack}
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card"
        noValidate
      >
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
              autoComplete="current-password"
              placeholder={t.auth.passwordPh}
              className="pl-11"
              {...register("password")}
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? t.auth.signingIn : t.auth.signIn}
        </Button>

        <p className="text-center text-sm text-muted-foreground pt-2">
          {t.auth.noAccount}{" "}
          <Link
            href={`/register${next !== "/orders" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="text-primary font-semibold hover:underline"
          >
            {t.auth.createAccount}
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
