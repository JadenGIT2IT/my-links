import type { Profile } from "@/lib/types";
import { THEMES } from "@/lib/themes";
import { ProfileAvatar } from "./ProfileAvatar";
import { LinkButton } from "./LinkButton";

type ProfileViewProps = {
  profile: Profile;
  showBranding?: boolean;
};

export function ProfileView({ profile, showBranding = true }: ProfileViewProps) {
  const theme = THEMES[profile.theme];
  const activeLinks = profile.links.filter((link) => link.active);
  const isDark = profile.theme === "midnight";

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-12"
      style={{ background: theme.gradient }}
    >
      <main className="w-full max-w-md flex flex-col items-center gap-6">
        <ProfileAvatar src={profile.avatar} name={profile.name} />

        <div className="text-center space-y-1">
          <h1
            className={`text-2xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-white drop-shadow-sm"
            }`}
          >
            {profile.name}
          </h1>
          {profile.bio && (
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-white/70" : "text-white/90"
              }`}
            >
              {profile.bio}
            </p>
          )}
        </div>

        <div className="w-full space-y-3 pt-2">
          {activeLinks.map((link) => (
            <LinkButton
              key={link.id}
              link={link}
              buttonClass={theme.button}
              buttonHover={theme.buttonHover}
            />
          ))}
        </div>

        {showBranding && (
          <footer className="mt-8">
            <p
              className={`text-xs ${
                isDark ? "text-white/30" : "text-white/50"
              }`}
            >
              my-links
            </p>
          </footer>
        )}
      </main>
    </div>
  );
}
