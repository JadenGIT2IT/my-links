"use client";

import { useEffect, useMemo, useState } from "react";
import type { LinkItem, Profile, PublishState, ThemeId } from "@/lib/types";
import { THEMES } from "@/lib/themes";
import { normalizeSlug, slugError } from "@/lib/slug";
import { ProfileAvatar } from "./ProfileAvatar";

type EditPanelProps = {
  profile: Profile;
  publishState: PublishState | null;
  onClose: () => void;
  onUpdateProfile: (updates: Partial<Profile>) => void;
  onSetAvatar: (avatar: string | null) => void;
  onSetTheme: (theme: ThemeId) => void;
  onAddLink: () => void;
  onUpdateLink: (id: string, updates: Partial<LinkItem>) => void;
  onRemoveLink: (id: string) => void;
  onMoveLink: (id: string, direction: "up" | "down") => void;
  onPublishStateChange: (state: PublishState) => void;
};

export function EditPanel({
  profile,
  publishState,
  onClose,
  onUpdateProfile,
  onSetAvatar,
  onSetTheme,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
  onMoveLink,
  onPublishStateChange,
}: EditPanelProps) {
  const [slugInput, setSlugInput] = useState(publishState?.slug ?? "");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [host, setHost] = useState("my-links.vercel.app");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setHost(window.location.host);
    if (publishState) {
      setShareUrl(`${window.location.origin}/${publishState.slug}`);
    }
  }, [publishState]);

  const normalizedSlug = useMemo(() => normalizeSlug(slugInput), [slugInput]);
  const validationError = slugInput ? slugError(normalizedSlug) : null;

  const handlePublish = async () => {
    const error = slugError(normalizedSlug);
    if (error) {
      setPublishError(error);
      return;
    }

    setPublishing(true);
    setPublishError(null);

    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: normalizedSlug,
          profile,
          editToken: publishState?.editToken,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        slug?: string;
        editToken?: string;
        url?: string;
      };

      if (!response.ok) {
        setPublishError(data.error ?? "Could not publish your page.");
        return;
      }

      const nextState: PublishState = {
        slug: data.slug!,
        editToken: data.editToken!,
      };

      onPublishStateChange(nextState);
      setShareUrl(data.url ?? `${window.location.origin}/${data.slug}`);
      setSlugInput(data.slug ?? normalizedSlug);
    } catch {
      setPublishError("Could not publish your page. Check your connection.");
    } finally {
      setPublishing(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <section className="space-y-4 rounded-2xl border border-green-100 bg-green-50/60 p-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-green-800">
                Share your page
              </h3>
              <p className="mt-1 text-sm text-green-900/70">
                Pick a username, publish, then share your link with anyone.
              </p>
            </div>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-gray-700">Username</span>
              <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                <span className="text-gray-400">{host}/</span>
                <input
                  type="text"
                  value={slugInput}
                  onChange={(e) => {
                    setSlugInput(e.target.value);
                    setPublishError(null);
                  }}
                  placeholder="your-name"
                  className="min-w-0 flex-1 bg-transparent text-gray-900 outline-none"
                />
              </div>
              {validationError && slugInput && (
                <p className="text-xs text-red-500">{validationError}</p>
              )}
            </label>

            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing || Boolean(validationError && slugInput)}
              className="w-full rounded-full bg-green-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {publishing
                ? "Publishing..."
                : publishState
                  ? "Update published page"
                  : "Publish page"}
            </button>

            {publishError && (
              <p className="text-sm text-red-600">{publishError}</p>
            )}

            {shareUrl && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Your shareable link
                </p>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2">
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 flex-1 truncate text-sm text-green-700 hover:underline"
                  >
                    {shareUrl}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="shrink-0 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </section>

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
