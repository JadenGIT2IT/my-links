"use client";

import { useCallback, useEffect, useState } from "react";
import type { LinkItem, Profile, ThemeId } from "@/lib/types";
import { createId, DEFAULT_PROFILE, loadProfile, saveProfile } from "@/lib/storage";

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveProfile(profile);
  }, [profile, loaded]);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const setAvatar = useCallback((avatar: string | null) => {
    setProfile((prev) => ({ ...prev, avatar }));
  }, []);

  const setTheme = useCallback((theme: ThemeId) => {
    setProfile((prev) => ({ ...prev, theme }));
  }, []);

  const addLink = useCallback(() => {
    const newLink: LinkItem = {
      id: createId(),
      title: "New Link",
      url: "https://",
      active: true,
    };
    setProfile((prev) => ({ ...prev, links: [...prev.links, newLink] }));
  }, []);

  const updateLink = useCallback((id: string, updates: Partial<LinkItem>) => {
    setProfile((prev) => ({
      ...prev,
      links: prev.links.map((link) =>
        link.id === id ? { ...link, ...updates } : link
      ),
    }));
  }, []);

  const removeLink = useCallback((id: string) => {
    setProfile((prev) => ({
      ...prev,
      links: prev.links.filter((link) => link.id !== id),
    }));
  }, []);

  const moveLink = useCallback((id: string, direction: "up" | "down") => {
    setProfile((prev) => {
      const index = prev.links.findIndex((l) => l.id === id);
      if (index === -1) return prev;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.links.length) return prev;

      const links = [...prev.links];
      [links[index], links[newIndex]] = [links[newIndex], links[index]];
      return { ...prev, links };
    });
  }, []);

  return {
    profile,
    loaded,
    updateProfile,
    setAvatar,
    setTheme,
    addLink,
    updateLink,
    removeLink,
    moveLink,
  };
}
