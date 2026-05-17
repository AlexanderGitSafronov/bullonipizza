"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="container py-20 text-center max-w-md">
      <motion.div
        animate={{ rotate: [0, -8, 8, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="inline-flex h-24 w-24 rounded-full bg-secondary items-center justify-center mb-6"
      >
        <WifiOff className="h-10 w-10 text-muted-foreground" />
      </motion.div>
      <h1 className="font-display text-3xl font-bold mb-2">Offline</h1>
      <p className="text-muted-foreground mb-8">
        No internet right now — but cached pages still work.
      </p>
      <div className="flex justify-center gap-3">
        <Button onClick={() => location.reload()}>
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
        <Link href="/">
          <Button variant="glass">Home</Button>
        </Link>
      </div>
    </div>
  );
}
