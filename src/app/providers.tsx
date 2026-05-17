"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { LocaleProvider } from "@/i18n/provider";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            className:
              "!bg-card !text-foreground !border !border-border !rounded-2xl !shadow-card",
            duration: 2800,
          }}
        />
      </LocaleProvider>
    </ThemeProvider>
  );
}
