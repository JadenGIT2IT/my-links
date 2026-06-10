export type LinkItem = {
  id: string;
  title: string;
  url: string;
  active: boolean;
};

export type ThemeId =
  | "forest"
  | "sunset"
  | "ocean"
  | "lavender"
  | "midnight"
  | "cream";

export type Profile = {
  name: string;
  bio: string;
  avatar: string | null;
  theme: ThemeId;
  links: LinkItem[];
};

export type PublishState = {
  slug: string;
  editToken: string;
};
