"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export function StickyCartButton() {
  const itemCount = useCart((s) => s.itemCount());
  const total = useCart((s) => s.total());
  const open = useCart((s) => s.open);
  const isOpen = useCart((s) => s.isOpen);

  return (
    <AnimatePresence>
      {itemCount > 0 && !isOpen && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          onClick={open}
          className="hidden md:flex fixed bottom-6 right-6 z-30 items-center gap-3 bg-brand-gradient text-white px-5 py-3.5 rounded-full shadow-glow font-semibold"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full bg-white text-primary text-[10px] font-bold flex items-center justify-center">
              {itemCount}
            </span>
          </div>
          <span>{formatPrice(total)}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
