import type { Profile, PublishState } from "./types";

const STORAGE_KEY = "my-links-profile";
const PUBLISH_KEY = "my-links-publish";

export const DEFAULT_PROFILE: Profile = {
  name: "Your Name",
  bio: "Add a short bio here",
  avatar: null,
  theme: "forest",
  links: [
    {
      id: "1",
      title: "My Website",
      url: "https://example.com",
      active: true,
    },
    {
      id: "2",
      title: "Instagram",
      url: "https://instagram.com",
      active: true,
    },
  ],
};

export function loadProfile(): Profile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) } as Profile;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: Profile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function createId(): string {
  return crypto.randomUUID();
}

export function loadPublishState(): PublishState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(PUBLISH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PublishState;
  } catch {
    return null;
  }
}

export function savePublishState(state: PublishState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PUBLISH_KEY, JSON.stringify(state));
}

export function clearPublishState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PUBLISH_KEY);
}
