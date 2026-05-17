"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side digest is safe; raw message could be sensitive.
    console.error("[app] error:", error.digest ?? "unknown");
  }, [error]);

  return (
    <div className="container py-20 text-center max-w-md">
      <div className="inline-flex h-20 w-20 rounded-full bg-destructive/10 items-center justify-center mb-6">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="font-display text-3xl font-bold mb-2">Oops!</h1>
      <p className="text-muted-foreground mb-8">
        Something went wrong. Please try again.
      </p>
      <div className="flex justify-center gap-3 flex-wrap">
        <Button onClick={reset}>
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
        <Link href="/">
          <Button variant="glass">
            <Home className="h-4 w-4" /> Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
