"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Upload, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const { t } = useLocale();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(t.admin.onlyImages);
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error(t.admin.maxSize);
      return;
    }
    setUploading(true);
    try {
      const sigRes = await fetch("/api/admin/upload-signature", {
        method: "POST",
      });
      const sig = await sigRes.json();
      if (!sig.ok) {
        toast.error(sig.error || t.admin.uploadFailed);
        return;
      }
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", String(sig.timestamp));
      form.append("signature", sig.signature);
      form.append("folder", sig.folder);
      const upRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: "POST", body: form }
      );
      const up = await upRes.json();
      if (!up.secure_url) {
        toast.error(up.error?.message || t.admin.uploadFailed);
        return;
      }
      onChange(up.secure_url);
      toast.success(t.admin.uploaded);
    } catch (err) {
      toast.error((err as Error).message || t.admin.uploadFailed);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative h-48 rounded-2xl overflow-hidden border-2 border-dashed border-border bg-secondary/50 flex items-center justify-center">
        {value ? (
          <>
            <Image
              src={value}
              alt=""
              fill
              sizes="400px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            <Upload className="h-8 w-8 mx-auto mb-2" />
            <p className="text-xs">{t.admin.imageHint}</p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={cn("w-full", uploading && "opacity-50")}
      >
        <Upload className="h-4 w-4" />
        {uploading ? t.admin.uploading : t.admin.uploadImage}
      </Button>
    </div>
  );
}
