"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ProductImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallbackLabel?: string;
};

export function ProductImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  fallbackLabel = "Imagem indisponivel",
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const showFallback = !src || hasError;

  if (showFallback) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-100 via-white to-slate-200 text-center",
          className,
        )}
      >
        <div className="flex size-14 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-slate-500 shadow-sm">
          <ImageOff className="size-6" />
        </div>
        <div className="space-y-1 px-6">
          <p className="text-sm font-medium text-slate-700">{fallbackLabel}</p>
          <p className="text-xs text-slate-500">Visual elegante mantido mesmo quando a imagem externa falha.</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
      onError={() => setHasError(true)}
    />
  );
}
