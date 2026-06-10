"use client";

import { useState } from "react";
import { processAvatarImage } from "@/lib/image";

type ProfileAvatarProps = {
  src: string | null;
  name: string;
  size?: "sm" | "lg";
  editable?: boolean;
  onImageChange?: (dataUrl: string) => void;
};

export function ProfileAvatar({
  src,
  name,
  size = "lg",
  editable = false,
  onImageChange,
}: ProfileAvatarProps) {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const sizeClass = size === "lg" ? "h-40 w-40" : "h-20 w-20";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageChange) return;

    setProcessing(true);
    setError(null);

    try {
      const dataUrl = await processAvatarImage(file);
      onImageChange(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not use this image.");
    } finally {
      setProcessing(false);
      e.target.value = "";
    }
  };

  return (
    <div className="relative group flex flex-col items-center gap-2">
      <div
        className={`${sizeClass} overflow-hidden rounded-full border-4 border-white/30 shadow-lg bg-white/20 flex items-center justify-center`}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span
            className={`font-semibold text-white/80 ${
              size === "lg" ? "text-3xl" : "text-xl"
            }`}
          >
            {initials}
          </span>
        )}

        {processing && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}
      </div>

      {editable && (
        <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="text-xs font-medium text-white">
            {processing ? "Processing..." : "Change photo"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={processing}
          />
        </label>
      )}

      {error && editable && (
        <p className="max-w-40 text-center text-xs text-red-200">{error}</p>
      )}
    </div>
  );
}
