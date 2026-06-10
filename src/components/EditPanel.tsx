"use client";

import type { LinkItem, Profile, ThemeId } from "@/lib/types";
import { THEMES } from "@/lib/themes";
import { ProfileAvatar } from "./ProfileAvatar";

type EditPanelProps = {
  profile: Profile;
  onClose: () => void;
  onUpdateProfile: (updates: Partial<Profile>) => void;
  onSetAvatar: (avatar: string | null) => void;
  onSetTheme: (theme: ThemeId) => void;
  onAddLink: () => void;
  onUpdateLink: (id: string, updates: Partial<LinkItem>) => void;
  onRemoveLink: (id: string) => void;
  onMoveLink: (id: string, direction: "up" | "down") => void;
};

export function EditPanel({
  profile,
  onClose,
  onUpdateProfile,
  onSetAvatar,
  onSetTheme,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
  onMoveLink,
}: EditPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close editor"
      />

      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit your page</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Profile
            </h3>

            <div className="flex items-center gap-4">
              <ProfileAvatar
                src={profile.avatar}
                name={profile.name}
                size="sm"
                editable
                onImageChange={onSetAvatar}
              />
              {profile.avatar && (
                <button
                  type="button"
                  onClick={() => onSetAvatar(null)}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Remove photo
                </button>
              )}
            </div>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-gray-700">Name</span>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => onUpdateProfile({ name: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-gray-700">Bio</span>
              <textarea
                value={profile.bio}
                onChange={(e) => onUpdateProfile({ bio: e.target.value })}
                rows={2}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </label>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Theme
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(THEMES) as ThemeId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSetTheme(id)}
                  className={`rounded-xl p-1 transition-all ${
                    profile.theme === id
                      ? "ring-2 ring-green-500 ring-offset-2"
                      : "hover:scale-105"
                  }`}
                >
                  <div
                    className="h-12 w-full rounded-lg"
                    style={{ background: THEMES[id].gradient }}
                  />
                  <span className="mt-1 block text-xs text-gray-600">
                    {THEMES[id].label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Links
              </h3>
              <button
                type="button"
                onClick={onAddLink}
                className="rounded-full bg-green-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                + Add link
              </button>
            </div>

            {profile.links.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-4">
                No links yet. Add your first one!
              </p>
            )}

            <div className="space-y-3">
              {profile.links.map((link, index) => (
                <div
                  key={link.id}
                  className="rounded-xl border border-gray-200 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={link.active}
                        onChange={(e) =>
                          onUpdateLink(link.id, { active: e.target.checked })
                        }
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-600">Visible</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => onMoveLink(link.id, "up")}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                        aria-label="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={index === profile.links.length - 1}
                        onClick={() => onMoveLink(link.id, "down")}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveLink(link.id)}
                        className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete link"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) =>
                      onUpdateLink(link.id, { title: e.target.value })
                    }
                    placeholder="Link title"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) =>
                      onUpdateLink(link.id, { url: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-gray-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
          >
            Done
          </button>
        </footer>
      </aside>
    </div>
  );
}
