const RESERVED_SLUGS = new Set([
  "api",
  "edit",
  "admin",
  "login",
  "signup",
  "settings",
  "profile",
  "profiles",
  "publish",
  "share",
  "new",
  "create",
  "help",
  "about",
  "terms",
  "privacy",
  "favicon.ico",
  "_next",
]);

export function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidSlug(slug: string): boolean {
  if (slug.length < 3 || slug.length > 30) return false;
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug) && !/^[a-z0-9]{3}$/.test(slug)) {
    return false;
  }
  return !RESERVED_SLUGS.has(slug);
}

export function slugError(slug: string): string | null {
  const normalized = normalizeSlug(slug);
  if (!normalized) return "Choose a username for your link.";
  if (normalized.length < 3) return "Username must be at least 3 characters.";
  if (normalized.length > 30) return "Username must be 30 characters or fewer.";
  if (!isValidSlug(normalized)) {
    if (RESERVED_SLUGS.has(normalized)) return "That username is reserved.";
    return "Use only letters, numbers, and hyphens.";
  }
  return null;
}
