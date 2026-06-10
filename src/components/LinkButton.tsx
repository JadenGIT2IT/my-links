"use client";

import type { LinkItem } from "@/lib/types";

type LinkButtonProps = {
  link: LinkItem;
  buttonClass: string;
  buttonHover: string;
};

export function LinkButton({ link, buttonClass, buttonHover }: LinkButtonProps) {
  const href = link.url.startsWith("http") ? link.url : `https://${link.url}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex w-full items-center justify-center rounded-full px-6 py-4 text-sm font-semibold transition-all duration-200 shadow-sm ${buttonClass} ${buttonHover}`}
    >
      {link.title}
    </a>
  );
}
