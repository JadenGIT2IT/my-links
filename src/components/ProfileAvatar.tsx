"use client";

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
  const sizeClass = size === "lg" ? "h-28 w-28" : "h-16 w-16";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageChange) return;

    const reader = new FileReader();
    reader.onload = () => onImageChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative group">
      <div
        className={`${sizeClass} overflow-hidden rounded-full border-4 border-white/30 shadow-lg bg-white/20 flex items-center justify-center`}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-2xl font-semibold text-white/80">{initials}</span>
        )}
      </div>

      {editable && (
        <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="text-xs font-medium text-white">Change photo</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </label>
      )}
    </div>
  );
}
