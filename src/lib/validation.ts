import type { Profile } from "./types";

const MAX_NAME_LENGTH = 80;
const MAX_BIO_LENGTH = 200;
const MAX_LINKS = 20;
const MAX_LINK_TITLE_LENGTH = 80;
const MAX_LINK_URL_LENGTH = 500;
const MAX_AVATAR_LENGTH = 2_000_000;

export function validateProfileForPublish(profile: Profile): string | null {
  const name = profile.name.trim();
  if (!name) return "Add a name before publishing.";
  if (name.length > MAX_NAME_LENGTH) {
    return `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  }

  if (profile.bio.length > MAX_BIO_LENGTH) {
    return `Bio must be ${MAX_BIO_LENGTH} characters or fewer.`;
  }

  if (profile.links.length > MAX_LINKS) {
    return `You can publish up to ${MAX_LINKS} links.`;
  }

  for (const link of profile.links) {
    if (link.title.length > MAX_LINK_TITLE_LENGTH) {
      return `Link titles must be ${MAX_LINK_TITLE_LENGTH} characters or fewer.`;
    }
    if (link.url.length > MAX_LINK_URL_LENGTH) {
      return `Link URLs must be ${MAX_LINK_URL_LENGTH} characters or fewer.`;
    }
  }

  if (profile.avatar && profile.avatar.length > MAX_AVATAR_LENGTH) {
    return "Profile image is too large. Try a smaller photo or re-upload to compress it.";
  }

  return null;
}
