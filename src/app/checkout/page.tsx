"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, MapPin, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/store/cart";
import { useLocale } from "@/i18n/provider";
import { useProductFields } from "@/hooks/use-product-fields";
import { useAuth } from "@/store/auth";
import { useAddresses } from "@/store/addresses";
import { formatPrice, generateOrderNumber, cn } from "@/lib/utils";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation";

export default function CheckoutPage() {
  const { t, locale } = useLocale();
  const { nameOf } = useProductFields();
  const router = useRouter();
  const cart = useCart();
  const items = cart.items;
  const { user } = useAuth();
  const { addresses, create: createAddress } = useAddresses();
  const [submitting, setSubmitting] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [saveAddress, setSaveAddress] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { consent: undefined as unknown as true, age: undefined as unknown as true },
  });

  const consentChecked = watch("consent");
  const ageChecked = watch("age");
  const currentAddress = watch("address");

  // Pre-fill name from the logged-in user once.
  useEffect(() => {
    if (user?.name) setValue("name", user.name);
  }, [user?.name, setValue]);

  // Auto-pick the default address on first load.
  useEffect(() => {
    if (selectedAddressId) return;
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    if (def) {
      setValue("address", def.address, { shouldValidate: true });
      setSelectedAddressId(def.id);
    }
  }, [addresses, selectedAddressId, setValue]);

  // If the user edits the address text by hand, drop the "selected"
  // highlight so they aren't visually locked to a saved one.
  useEffect(() => {
    if (!selectedAddressId) return;
    const sel = addresses.find((a) => a.id === selectedAddressId);
    if (sel && currentAddress !== sel.address) {
      setSelectedAddressId(null);
    }
  }, [currentAddress, selectedAddressId, addresses]);

  const onSubmit = async (data: CheckoutInput) => {
    if (items.length === 0) return;
    if (data.website) return; // honeypot tripped
    setSubmitting(true);
    try {
      const orderNumber = generateOrderNumber();
      const payload = {
        orderNumber,
        name: data.name,
        phone: data.phone,
        address: data.address,
        comment: data.comment ?? "",
        items: items.map((i) => ({
          productId: i.productId,
          slug: i.slug,
          nameUk: i.nameUk,
          nameEn: i.nameEn,
          nameRu: i.nameRu,
          image: i.image,
          quantity: i.quantity,
          size: i.size ?? null,
          crust: i.crust ?? null,
          extras: i.extras,
          price: i.unitPrice,
        })),
        subtotal: cart.subtotal(),
        deliveryFee: cart.deliveryFee(),
        total: cart.total(),
        createdAt: Date.now(),
      };

      try {
        const existing = JSON.parse(localStorage.getItem("bp_orders") ?? "{}");
        existing[orderNumber] = payload;
        localStorage.setItem("bp_orders", JSON.stringify(existing));
      } catch {
        /* storage quota or disabled — non-fatal */
      }

      // Don't await — fire-and-forget so the user gets fast feedback.
      // The local copy is the source of truth for /orders/[id].
      void fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});

      // Save the address to the profile if the user opted in.
      if (user && saveAddress && data.address) {
        void createAddress({ address: data.address }).catch(() => {});
      }

      cart.clear();
      toast.success(t.checkout.success);
      router.push(`/orders/${orderNumber}`);
    } catch {
      toast.error(t.checkout.error);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="font-display text-2xl font-bold mb-2">{t.cart.empty}</h1>
        <Link href="/menu">
          <Button>{t.cart.browse}</Button>
        </Link>
      </div>
    );
  }

  const errMsg = (code?: string) => {
    if (!code) return "";
    const map: Record<string, string> = {
      name: locale === "en" ? "Please enter a valid name" : locale === "ru" ? "Введите корректное имя" : "Введіть коректне ім'я",
      phone: locale === "en" ? "Please enter a valid phone" : locale === "ru" ? "Введите корректный телефон" : "Введіть коректний телефон",
      consent: t.checkout.consentRequired,
      age: t.checkout.consentRequired,
    };
    return map[code] ?? (locale === "en" ? "Required" : locale === "ru" ? "Обязательно" : "Обов'язково");
  };

  return (
    <div className="container py-8 md:py-12">
      <Link
        href="/menu"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> {t.common.back}
      </Link>

      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
        {t.checkout.title}
      </h1>

      <div className="grid lg:grid-cols-[1fr,400px] gap-8 lg:gap-12">
        <motion.form
          id="checkout-form"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Honeypot field (visually hidden, real users won't fill it) */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            {...register("website")}
          />

          <Section title={t.checkout.contact}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t.checkout.name}</Label>
                <Input
                  id="name"
                  placeholder={t.checkout.namePh}
                  className="mt-1.5"
                  autoComplete="name"
                  maxLength={60}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">
                    {errMsg(errors.name.message)}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">{t.checkout.phone}</Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder={t.checkout.phonePh}
                  className="mt-1.5"
                  autoComplete="tel"
                  maxLength={20}
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive mt-1">
                    {errMsg(errors.phone.message)}
                  </p>
                )}
              </div>
            </div>
          </Section>

          <Section title={t.checkout.address}>
            {user && addresses.length > 0 && (
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  {t.addresses.pickSaved}
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {addresses.map((a) => {
                    const active = selectedAddressId === a.id;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => {
                          setValue("address", a.address, {
                            shouldValidate: true,
                          });
                          setSelectedAddressId(a.id);
                          setSaveAddress(false);
                        }}
                        className={cn(
                          "relative flex items-start gap-2 p-3 rounded-2xl border text-left transition-all",
                          active
                            ? "border-primary bg-accent shadow-soft"
                            : "border-border bg-secondary/30 hover:bg-secondary/60"
                        )}
                      >
                        <MapPin
                          className={cn(
                            "h-4 w-4 mt-0.5 shrink-0",
                            active ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {a.label && (
                              <span className="text-xs font-semibold truncate">
                                {a.label}
                              </span>
                            )}
                            {a.isDefault && (
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            )}
                          </div>
                          <p className="text-xs text-foreground/80 line-clamp-2">
                            {a.address}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <Label htmlFor="address">{t.checkout.addressField}</Label>
            <Input
              id="address"
              placeholder={t.checkout.addressPh}
              className="mt-1.5"
              autoComplete="street-address"
              maxLength={200}
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-destructive mt-1">
                {errMsg(errors.address.message)}
              </p>
            )}

            {user && !selectedAddressId && currentAddress && (
              <label className="mt-3 flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                <span className="text-muted-foreground">
                  {t.addresses.saveForLater}
                </span>
              </label>
            )}

            {!user && (
              <p className="mt-3 text-xs text-muted-foreground">
                <Link
                  href={`/login?next=${encodeURIComponent("/checkout")}`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {t.auth.login}
                </Link>{" "}
                · {t.addresses.subtitle.toLowerCase()}
              </p>
            )}

            <div className="mt-4">
              <Label htmlFor="comment">{t.checkout.comment}</Label>
              <Textarea
                id="comment"
                placeholder={t.checkout.commentPh}
                className="mt-1.5"
                maxLength={500}
                {...register("comment")}
              />
            </div>
          </Section>

          <Section title={locale === "en" ? "Consent" : locale === "ru" ? "Согласие" : "Згода"}>
            <ConsentCheckbox
              id="consent"
              checked={!!consentChecked}
              onChange={(v) => setValue("consent", v as true, { shouldValidate: true })}
              error={!!errors.consent}
            >
              <span>
                {t.checkout.consent} —{" "}
                <Link
                  href="/legal/privacy"
                  target="_blank"
                  className="underline text-primary hover:text-foreground"
                >
                  {t.checkout.consentLink}
                </Link>
              </span>
            </ConsentCheckbox>
            <ConsentCheckbox
              id="age"
              checked={!!ageChecked}
              onChange={(v) => setValue("age", v as true, { shouldValidate: true })}
              error={!!errors.age}
            >
              <span>
                {t.checkout.terms}{" "}
                <Link
                  href="/legal/terms"
                  target="_blank"
                  className="underline text-primary hover:text-foreground"
                >
                  {t.checkout.termsLink}
                </Link>
                {" · "}
                {t.checkout.age}
              </span>
            </ConsentCheckbox>
          </Section>

          <Button
            type="submit"
            size="lg"
            className="w-full lg:hidden"
            disabled={submitting}
          >
            {submitting ? t.checkout.placing : t.checkout.submit}
          </Button>
        </motion.form>

        <motion.aside
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:sticky lg:top-24 self-start"
        >
          <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="font-display text-lg font-bold">
                {t.checkout.summary}
              </h3>
            </div>
            <div className="p-5 space-y-3 max-h-[300px] overflow-y-auto">
              {items.map((it) => (
                <div key={it.id} className="flex gap-3">
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-secondary shrink-0">
                    <Image
                      src={it.image}
                      alt={nameOf(it)}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                      {it.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{nameOf(it)}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {[
                        it.size && t.product.sizes[it.size],
                        it.crust && t.product.crusts[it.crust],
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </div>
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {formatPrice(it.unitPrice * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-border space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.cart.subtotal}</span>
                <span>{formatPrice(cart.subtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.cart.delivery}</span>
                <span>
                  {cart.deliveryFee() === 0 ? (
                    <span className="text-emerald-500 font-semibold">
                      {t.cart.free}
                    </span>
                  ) : (
                    formatPrice(cart.deliveryFee())
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                <span>{t.cart.total}</span>
                <span className="text-gradient font-display text-xl">
                  {formatPrice(cart.total())}
                </span>
              </div>
              <Button
                type="submit"
                size="lg"
                form="checkout-form"
                className="w-full mt-3 hidden lg:flex"
                disabled={submitting}
              >
                {submitting ? t.checkout.placing : t.checkout.submit}
              </Button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                {locale === "en"
                  ? "Secure ordering"
                  : locale === "ru"
                    ? "Безопасный заказ"
                    : "Безпечне замовлення"}
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <h2 className="font-display text-lg font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function ConsentCheckbox({
  id,
  checked,
  onChange,
  error,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-3 cursor-pointer py-2 select-none"
    >
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden
        className={`mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${
          checked
            ? "bg-primary border-primary"
            : error
              ? "border-destructive"
              : "border-border"
        }`}
      >
        {checked && (
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span className={`text-sm leading-snug ${error ? "text-destructive" : ""}`}>
        {children}
      </span>
    </label>
  );
}
