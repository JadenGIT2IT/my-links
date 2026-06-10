import type { LinkItem, Profile, ThemeId } from "./types";
import { getSupabaseAdmin } from "./supabase/server";

export type PublishedProfile = Profile & {
  slug: string;
};

type ProfileRow = {
  slug: string;
  name: string;
  bio: string;
  avatar: string | null;
  theme: ThemeId;
  links: LinkItem[];
  edit_token: string;
};

function rowToProfile(row: ProfileRow): PublishedProfile {
  return {
    slug: row.slug,
    name: row.name,
    bio: row.bio,
    avatar: row.avatar,
    theme: row.theme,
    links: row.links,
  };
}

export async function getProfileBySlug(
  slug: string
): Promise<PublishedProfile | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("slug, name, bio, avatar, theme, links")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return rowToProfile(data as ProfileRow);
}

export async function publishProfile(
  slug: string,
  profile: Profile,
  editToken?: string
): Promise<{ editToken: string }> {
  const supabase = getSupabaseAdmin();
  const token = editToken ?? crypto.randomUUID();

  const { data: existing } = await supabase
    .from("profiles")
    .select("edit_token")
    .eq("slug", slug)
    .maybeSingle();

  if (existing && existing.edit_token !== editToken) {
    throw new Error("USERNAME_TAKEN");
  }

  const payload = {
    slug,
    name: profile.name,
    bio: profile.bio,
    avatar: profile.avatar,
    theme: profile.theme,
    links: profile.links,
    edit_token: token,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("profiles").upsert(payload, {
    onConflict: "slug",
  });

  if (error) {
    if (error.code === "23505") throw new Error("USERNAME_TAKEN");
    throw error;
  }

  return { editToken: token };
}
