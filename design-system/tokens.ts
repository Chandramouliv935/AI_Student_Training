// ============================================================
// CareerFlow AI – Design Tokens v2
// Palette: Deep Violet / Electric Cyan / Obsidian Dark
// ============================================================

export const tokens = {
  colors: {
    // ── Primary – Electric Violet ──────────────────────────
    primary: {
      DEFAULT: '#7c3aed', // Violet-600
      light:   '#a78bfa', // Violet-400
      dark:    '#5b21b6', // Violet-800
      50:  '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
      950: '#2e1065',
    },

    // ── Secondary – Electric Cyan ─────────────────────────
    secondary: {
      DEFAULT: '#06b6d4', // Cyan-500
      light:   '#67e8f9', // Cyan-300
      dark:    '#0891b2', // Cyan-600
      50:  '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
      950: '#083344',
    },

    // ── Accent – Neon Rose ────────────────────────────────
    accent: {
      DEFAULT: '#f43f5e', // Rose-500
      light:   '#fb7185', // Rose-400
      dark:    '#e11d48', // Rose-600
      50:  '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#f43f5e',
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
      950: '#4c0519',
    },

    // ── Success – Emerald ─────────────────────────────────
    success: {
      DEFAULT: '#10b981',
      light:   '#34d399',
      dark:    '#059669',
      50:  '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22',
    },

    // ── Warning – Amber ───────────────────────────────────
    warning: {
      DEFAULT: '#f59e0b',
      light:   '#fbbf24',
      dark:    '#d97706',
      50:  '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },

    // ── Error – Red ───────────────────────────────────────
    error: {
      DEFAULT: '#ef4444',
      light:   '#f87171',
      dark:    '#dc2626',
      50:  '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },

    // ── Neutral – Obsidian ────────────────────────────────
    neutral: {
      50:  '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },

    // ── Surface tones (glass/dark) ────────────────────────
    surface: {
      glass:       'rgba(255,255,255,0.06)',
      glassBorder: 'rgba(255,255,255,0.12)',
      dark:        '#0f172a',
      darker:      '#080f1f',
      card:        '#131c30',
    },
  },

  // ── Spacing ───────────────────────────────────────────────
  spacing: {
    xs:   '4px',
    sm:   '8px',
    md:   '16px',
    lg:   '24px',
    xl:   '32px',
    '2xl':'48px',
    '3xl':'64px',
    '4xl':'96px',
  },

  // ── Border Radius ─────────────────────────────────────────
  borderRadius: {
    xs:   '4px',
    sm:   '8px',
    md:   '12px',
    lg:   '16px',
    xl:   '20px',
    '2xl':'24px',
    full: '9999px',
  },

  // ── Typography ────────────────────────────────────────────
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    fontSize: {
      xs:   '11px',
      sm:   '13px',
      base: '15px',
      lg:   '17px',
      xl:   '20px',
      '2xl':'24px',
      '3xl':'30px',
      '4xl':'36px',
      '5xl':'48px',
    },
    fontWeight: {
      normal:   '400',
      medium:   '500',
      semibold: '600',
      bold:     '700',
      extrabold:'800',
    },
    lineHeight: {
      tight:  '1.25',
      snug:   '1.375',
      normal: '1.5',
      relaxed:'1.625',
    },
  },

  // ── Shadows ───────────────────────────────────────────────
  shadows: {
    sm:     '0 1px 3px 0 rgba(0,0,0,0.3)',
    md:     '0 4px 16px -2px rgba(0,0,0,0.4)',
    lg:     '0 12px 32px -4px rgba(0,0,0,0.5)',
    xl:     '0 24px 64px -8px rgba(0,0,0,0.6)',
    glow:   {
      primary:  '0 0 24px rgba(124,58,237,0.5), 0 0 48px rgba(124,58,237,0.2)',
      cyan:     '0 0 24px rgba(6,182,212,0.5), 0 0 48px rgba(6,182,212,0.15)',
      rose:     '0 0 20px rgba(244,63,94,0.4)',
    },
    inner:  'inset 0 1px 0 rgba(255,255,255,0.08)',
  },

  // ── Animations ────────────────────────────────────────────
  animations: {
    duration: {
      instant: '80ms',
      fast:    '150ms',
      normal:  '250ms',
      slow:    '400ms',
      slower:  '600ms',
    },
    timing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
      smooth:  'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  },

  // ── Gradients ─────────────────────────────────────────────
  gradients: {
    primary:   'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
    hero:      'linear-gradient(135deg, #0f172a 0%, #1a0938 50%, #0c1f3f 100%)',
    card:      'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
    shine:     'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
    accent:    'linear-gradient(135deg, #f43f5e 0%, #7c3aed 100%)',
    success:   'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
  },

  // ── Blur ──────────────────────────────────────────────────
  blur: {
    sm:  '8px',
    md:  '16px',
    lg:  '32px',
    xl:  '64px',
  },
};
