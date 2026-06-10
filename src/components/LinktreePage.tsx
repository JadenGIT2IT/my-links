"use client";

import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import type { PublishState } from "@/lib/types";
import { loadPublishState, savePublishState } from "@/lib/storage";
import { ProfileView } from "./ProfileView";
import { EditPanel } from "./EditPanel";

export function LinktreePage() {
  const [editing, setEditing] = useState(false);
  const [publishState, setPublishState] = useState<PublishState | null>(null);
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

  useEffect(() => {
    setPublishState(loadPublishState());
  }, []);

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    );
  }

  return (
    <div className="relative">
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

      <ProfileView profile={profile} />

      {editing && (
        <EditPanel
          profile={profile}
          publishState={publishState}
          onClose={() => setEditing(false)}
          onUpdateProfile={updateProfile}
          onSetAvatar={setAvatar}
          onSetTheme={setTheme}
          onAddLink={addLink}
          onUpdateLink={updateLink}
          onRemoveLink={removeLink}
          onMoveLink={moveLink}
          onPublishStateChange={(state) => {
            setPublishState(state);
            savePublishState(state);
          }}
        />
      )}
    </div>
  );
}
