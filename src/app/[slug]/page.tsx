import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileView } from "@/components/ProfileView";
import { getProfileBySlug } from "@/lib/profiles";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { isValidSlug } from "@/lib/slug";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isSupabaseConfigured() || !isValidSlug(slug)) {
    return { title: "My Links" };
  }

  const profile = await getProfileBySlug(slug);
  if (!profile) return { title: "My Links" };

  return {
    title: `${profile.name} | My Links`,
    description: profile.bio || `Links from ${profile.name}`,
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { slug } = await params;

  if (!isSupabaseConfigured() || !isValidSlug(slug)) {
    notFound();
  }

  const profile = await getProfileBySlug(slug);
  if (!profile) notFound();

  return <ProfileView profile={profile} />;
}
