import { NextResponse } from "next/server";
import type { Profile } from "@/lib/types";
import { publishProfile } from "@/lib/profiles";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { normalizeSlug, slugError } from "@/lib/slug";

type PublishBody = {
  slug: string;
  profile: Profile;
  editToken?: string;
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Publishing is not configured yet." },
      { status: 503 }
    );
  }

  let body: PublishBody;
  try {
    body = (await request.json()) as PublishBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const slug = normalizeSlug(body.slug);
  const validationError = slugError(slug);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  if (!body.profile?.name?.trim()) {
    return NextResponse.json({ error: "Add a name before publishing." }, { status: 400 });
  }

  try {
    const { editToken } = await publishProfile(
      slug,
      body.profile,
      body.editToken
    );

    const origin = new URL(request.url).origin;

    return NextResponse.json({
      slug,
      editToken,
      url: `${origin}/${slug}`,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USERNAME_TAKEN") {
      return NextResponse.json(
        { error: "That username is already taken." },
        { status: 409 }
      );
    }

    console.error("Publish failed:", error);
    return NextResponse.json(
      { error: "Could not publish your page. Try again." },
      { status: 500 }
    );
  }
}
