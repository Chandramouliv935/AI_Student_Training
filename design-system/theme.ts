import { tokens } from './tokens';

export const theme = {
  ...tokens,

  // ── Spacing helper ────────────────────────────────────────
  getSpacing: (multiplier: number) => `${multiplier * 4}px`,

  // ── Color alpha helper ────────────────────────────────────
  alpha: (hex: string, opacity: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  // ── Glow helper ───────────────────────────────────────────
  glow: (color: string, intensity: number = 1) =>
    `0 0 ${24 * intensity}px ${color}66, 0 0 ${48 * intensity}px ${color}22`,
};

export type Theme = typeof theme;
