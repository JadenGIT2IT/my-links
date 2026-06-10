import type { ThemeId } from "./types";

export const THEMES: Record<
  ThemeId,
  { label: string; gradient: string; button: string; buttonHover: string }
> = {
  forest: {
    label: "Forest",
    gradient: "linear-gradient(160deg, #1a472a 0%, #2d6a4f 50%, #40916c 100%)",
    button: "bg-white/95 text-gray-900",
    buttonHover: "hover:bg-white hover:scale-[1.02]",
  },
  sunset: {
    label: "Sunset",
    gradient: "linear-gradient(160deg, #7c2d12 0%, #c2410c 40%, #f97316 100%)",
    button: "bg-white/95 text-gray-900",
    buttonHover: "hover:bg-white hover:scale-[1.02]",
  },
  ocean: {
    label: "Ocean",
    gradient: "linear-gradient(160deg, #0c4a6e 0%, #0369a1 50%, #38bdf8 100%)",
    button: "bg-white/95 text-gray-900",
    buttonHover: "hover:bg-white hover:scale-[1.02]",
  },
  lavender: {
    label: "Lavender",
    gradient: "linear-gradient(160deg, #4c1d95 0%, #7c3aed 50%, #c4b5fd 100%)",
    button: "bg-white/95 text-gray-900",
    buttonHover: "hover:bg-white hover:scale-[1.02]",
  },
  midnight: {
    label: "Midnight",
    gradient: "linear-gradient(160deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
    button: "bg-white/10 text-white border border-white/20 backdrop-blur-sm",
    buttonHover: "hover:bg-white/20 hover:scale-[1.02]",
  },
  cream: {
    label: "Cream",
    gradient: "linear-gradient(160deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)",
    button: "bg-white/90 text-gray-900 shadow-sm",
    buttonHover: "hover:bg-white hover:scale-[1.02]",
  },
};
