"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Star,
  User as UserIcon,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/i18n/provider";
import { useAuth } from "@/store/auth";
import { useAddresses, type SavedAddress } from "@/store/addresses";
import { AddressDialog } from "@/components/profile/address-dialog";

export default function ProfilePage() {
  const { t } = useLocale();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { addresses, remove, update, loading: addrLoading } = useAddresses();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<SavedAddress | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login?next=/profile");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="container py-20 text-center text-muted-foreground">
        {t.common.loading}
      </div>
    );
  }

  const handleDelete = async (a: SavedAddress) => {
    if (!confirm(t.addresses.confirmDelete)) return;
    const ok = await remove(a.id);
    if (ok) toast.success(t.addresses.deleted);
  };

  const handleSetDefault = async (a: SavedAddress) => {
    if (a.isDefault) return;
    await update(a.id, { isDefault: true });
  };

  const initial = (user.name || user.email).charAt(0).toUpperCase();

  return (
    <div className="container py-8 md:py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card mb-6 flex items-center gap-4"
      >
        <div className="h-16 w-16 rounded-2xl bg-brand-gradient text-white font-bold text-xl flex items-center justify-center shadow-glow shrink-0">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl md:text-3xl font-bold truncate flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-muted-foreground" />
            {user.name || t.auth.account}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1 truncate">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            {user.email}
          </p>
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card"
      >
        <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
          <div>
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {t.addresses.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t.addresses.subtitle}
            </p>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setEditorOpen(true);
            }}
            disabled={addresses.length >= 10}
          >
            <Plus className="h-4 w-4" />
            {t.addresses.add}
          </Button>
        </div>

        {addrLoading && addresses.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6">
            {t.common.loading}
          </p>
        ) : addresses.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-border rounded-3xl">
            <p className="text-4xl mb-2">📍</p>
            <p className="font-medium">{t.addresses.empty}</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              {t.addresses.emptyDesc}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence initial={false}>
              {addresses.map((a) => (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors"
                >
                  <button
                    onClick={() => handleSetDefault(a)}
                    title={t.addresses.setDefault}
                    className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      a.isDefault
                        ? "bg-amber-500/20 text-amber-500"
                        : "bg-background/60 text-muted-foreground hover:text-amber-500"
                    }`}
                  >
                    <Star
                      className={`h-4 w-4 ${a.isDefault ? "fill-current" : ""}`}
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {a.label && (
                        <span className="text-sm font-semibold">
                          {a.label}
                        </span>
                      )}
                      {a.isDefault && (
                        <Badge variant="success" className="text-[10px]">
                          {t.addresses.defaultBadge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground/90 truncate">
                      {a.address}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditing(a);
                        setEditorOpen(true);
                      }}
                      aria-label={t.addresses.edit}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(a)}
                      aria-label={t.addresses.delete}
                    >
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <p className="text-[11px] text-muted-foreground pt-2">
              {addresses.length} / 10
            </p>
          </div>
        )}
      </motion.section>

      <AddressDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        initial={editing}
      />
    </div>
  );
}
