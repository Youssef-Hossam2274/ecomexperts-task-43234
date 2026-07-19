"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/src/lib/cn";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Container sizing classes — MUST set an explicit size (the image fills it). */
  wrapperClassName?: string;
  /**
   * Passed straight to next/image. These are small thumbnails, so a modest
   * fixed default keeps the generated srcset tight; callers can override.
   */
  sizes?: string;
  /** Custom node shown when the image is missing (defaults to an "IMG" tile). */
  fallback?: React.ReactNode;
}

/**
 * Renders a product/brand image through next/image, falling back to a neutral
 * placeholder tile when the file is missing. This keeps the UI coherent before
 * the real assets are dropped into `/public/assets` — swap nothing, just add
 * files.
 *
 * The image uses the `fill` layout (see node_modules/next/dist/docs — App
 * Router Image), so the wrapper provides both `position: relative` and an
 * explicit size; every call site already sizes it. A missing local asset makes
 * the optimizer respond with an error, which fires `onError` and swaps in the
 * fallback instead of throwing. `.svg` sources are served unoptimized by
 * next/image automatically, so the brand badge needs no extra config.
 */
export function SafeImage({
  src,
  alt,
  className,
  wrapperClassName,
  sizes = "200px",
  fallback,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  // `cn` is a plain join (no tailwind-merge), so both `object-*` utilities would
  // survive and stylesheet order — not source order — would decide the winner.
  // Drop our default when the caller sets a base `object-fit` so theirs wins.
  const overridesObjectFit =
    !!className &&
    /(^|\s)object-(contain|cover|fill|none|scale-down)(\s|$)/.test(className);

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden",
        wrapperClassName,
      )}
    >
      {failed ? (
        (fallback ?? (
          <span
            aria-hidden
            className="flex h-full w-full items-center justify-center bg-gray-200 text-[8px] font-medium tracking-wide text-gray-500"
          >
            IMG
          </span>
        ))
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={cn(!overridesObjectFit && "object-cover", className)}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
