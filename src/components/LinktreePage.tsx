"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { THEMES } from "@/lib/themes";
import { ProfileAvatar } from "./ProfileAvatar";
import { LinkButton } from "./LinkButton";
import { EditPanel } from "./EditPanel";

export function LinktreePage() {
  const [editing, setEditing] = useState(false);
  const {
    profile,
    loaded,
    updateProfile,
    setAvatar,
    setTheme,
    addLink,
    updateLink,
    removeLink,
    moveLink,
  } = useProfile();

  const theme = THEMES[profile.theme];
  const activeLinks = profile.links.filter((l) => l.active);
  const isDark = profile.theme === "midnight";

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-12"
      style={{ background: theme.gradient }}
    >
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="fixed right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-black/40"
        aria-label="Edit page"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>

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
          {activeLinks.length === 0 ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className={`flex w-full items-center justify-center rounded-full border-2 border-dashed px-6 py-4 text-sm font-medium transition-all ${
                isDark
                  ? "border-white/30 text-white/60 hover:border-white/50 hover:text-white/80"
                  : "border-white/40 text-white/70 hover:border-white/60 hover:text-white"
              }`}
            >
              + Add your first link
            </button>
          ) : (
            activeLinks.map((link) => (
              <LinkButton
                key={link.id}
                link={link}
                buttonClass={theme.button}
                buttonHover={theme.buttonHover}
              />
            ))
          )}
        </div>

        <footer className="mt-8">
          <p
            className={`text-xs ${
              isDark ? "text-white/30" : "text-white/50"
            }`}
          >
            my-links
          </p>
        </footer>
      </main>

      {editing && (
        <EditPanel
          profile={profile}
          onClose={() => setEditing(false)}
          onUpdateProfile={updateProfile}
          onSetAvatar={setAvatar}
          onSetTheme={setTheme}
          onAddLink={addLink}
          onUpdateLink={updateLink}
          onRemoveLink={removeLink}
          onMoveLink={moveLink}
        />
      )}
    </div>
  );
}
