"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/provider";

export function InstallPwaPrompt() {
  const { t } = useLocale();
  const [deferred, setDeferred] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferred(e);
      const dismissed = sessionStorage.getItem("bp_install_dismissed");
      if (!dismissed) {
        setTimeout(() => setVisible(true), 4000);
      }
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  };

  const dismiss = () => {
    sessionStorage.setItem("bp_install_dismissed", "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && deferred && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
        >
          <div className="glass rounded-2xl shadow-card border border-border p-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-brand-gradient flex items-center justify-center shrink-0">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">BulloniPizza</p>
              <p className="text-xs text-muted-foreground truncate">
                {t.common.install}
              </p>
            </div>
            <Button size="sm" onClick={install}>
              {t.common.install}
            </Button>
            <button onClick={dismiss} className="p-1 text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
