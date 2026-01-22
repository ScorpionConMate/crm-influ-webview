/**
 * Design Tokens - Comprehensive Design System Constants
 * 
 * This file contains all design token constants used throughout the application.
 * All values are derived from the artifact designs and maintain consistency.
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Primary - Cyan from artifacts
  primary: "#13c8ec",
  primaryOkLCH: "oklch(0.67 0.19 207)",
  primaryForeground: "#ffffff",
  
  // Backgrounds
  backgroundLight: "#f6f8f8",
  backgroundDark: "#101f22",
  backgroundDarkOkLCH: "oklch(0.25 0.02 200)",
  
  // Surfaces (Cards, Modals, etc.)
  surfaceLight: "#ffffff",
  surfaceDark: "#1a2c30",
  surfaceDark2: "#1e2e32",
  surfaceDarkOkLCH: "oklch(0.32 0.01 200)",
  
  // Borders
  borderLight: "#e2e8f0",
  borderDark: "#3b4f54",
  borderDarkOkLCH: "oklch(0.50 0.02 200)",
  
  // Text
  textLight: "#1e293b",
  textLightOkLCH: "oklch(0.145 0 0)",
  textDark: "#ffffff",
  textDarkOkLCH: "oklch(0.985 0 0)",
  
  // Secondary text
  textSecondaryLight: "#64748b",
  textSecondaryDark: "#9db4b9",
  
  // Semantic colors
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
} as const

// Badge/Chip colors
export const badgeColors = {
  primary: {
    bg: "oklch(0.67 0.19 207 / 0.1)",
    text: "#13c8ec",
  },
  success: {
    bg: "oklch(0.63 0.17 142 / 0.1)",
    text: "#10b981",
  },
  warning: {
    bg: "oklch(0.72 0.15 70 / 0.1)",
    text: "#f59e0b",
  },
  error: {
    bg: "oklch(0.60 0.20 25 / 0.1)",
    text: "#ef4444",
  },
  neutral: {
    bg: "oklch(0.50 0.02 200 / 0.1)",
    text: "#64748b",
  },
  orange: {
    bg: "oklch(0.72 0.15 50 / 0.1)",
    text: "#f97316",
  },
  purple: {
    bg: "oklch(0.65 0.20 300 / 0.1)",
    text: "#8b5cf6",
  },
  gray: {
    bg: "oklch(0.50 0.02 200 / 0.1)",
    text: "#9ca3af",
  },
} as const

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  // Font family
  fontFamily: {
    sans: "'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    display: "'Inter Variable', 'Inter', sans-serif",
  },
  
  // Font sizes (type scale)
  fontSize: {
    xs: "10px",     // Caption, badges
    sm: "12px",     // Caption, small text
    base: "14px",   // Small, labels
    md: "16px",     // Body text
    lg: "18px",     // Card titles
    xl: "20px",     // Subtitles
    "2xl": "24px",  // Section headers
    "3xl": "28px",  // Page titles
    "4xl": "32px",  // Large headlines
    "5xl": "40px",  // Hero text
  },
  
  // Font weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Line heights
  lineHeight: {
    tight: "1.1",
    normal: "1.5",
    relaxed: "1.75",
    loose: "2",
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: "-0.025em",
    tight: "-0.015em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
  },
} as const

// Text hierarchy presets
export const textHierarchy = {
  pageTitle: {
    size: "28px",
    weight: 700,
    lineHeight: "tight",
    letterSpacing: "tighter",
  },
  cardTitle: {
    size: "18px",
    weight: 600,
    lineHeight: "tight",
  },
  sectionTitle: {
    size: "20px",
    weight: 700,
    lineHeight: "tight",
  },
  body: {
    size: "16px",
    weight: 400,
    lineHeight: "normal",
  },
  small: {
    size: "14px",
    weight: 400,
    lineHeight: "normal",
  },
  caption: {
    size: "12px",
    weight: 500,
    lineHeight: "normal",
    letterSpacing: "wider",
  },
  badge: {
    size: "10px",
    weight: 700,
    lineHeight: "normal",
    letterSpacing: "wider",
    uppercase: true,
  },
} as const

// ============================================================================
// SPACING (8-point grid system)
// ============================================================================

export const spacing = {
  xs: "4px",    // 0.25rem
  sm: "8px",    // 0.5rem
  md: "16px",   // 1rem
  lg: "24px",   // 1.5rem
  xl: "32px",   // 2rem
  "2xl": "48px", // 3rem
  "3xl": "64px", // 4rem
  "4xl": "96px", // 6rem
  "5xl": "128px", // 8rem
} as const

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  xs: "4px",    // 0.25rem - default from artifacts
  sm: "6px",    // 0.375rem
  md: "8px",    // 0.5rem
  lg: "12px",   // 0.75rem
  xl: "16px",   // 1rem
  "2xl": "20px", // 1.25rem
  "3xl": "24px", // 1.5rem
  full: "9999px", // Circles
} as const

// Component-specific radius
export const componentRadius = {
  button: { default: "12px", sm: "8px", lg: "16px", icon: "9999px" },
  card: { default: "12px", sm: "8px", lg: "16px" },
  input: { default: "12px", sm: "8px" },
  badge: "9999px",
  avatar: "9999px",
  dialog: "24px",
  bottomSheet: "24px",
} as const

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  lg: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  xl: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  
  // Colored shadows
  primary: "0 10px 40px -10px rgba(19, 200, 236, 0.4)",
  primarySm: "0 4px 20px -4px rgba(19, 200, 236, 0.3)",
  primaryXs: "0 2px 10px -2px rgba(19, 200, 236, 0.2)",
  
  // Inner shadows
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
} as const

// ============================================================================
// ICON SIZES
// ============================================================================

export const iconSizes = {
  xs: "12px",
  sm: "14px",
  md: "16px",
  base: "20px",
  lg: "24px",
  xl: "28px",
  "2xl": "32px",
  "3xl": "40px",
  "4xl": "48px",
} as const

// Icon button sizes
export const iconButtonSizes = {
  sm: "32px",
  md: "40px",
  lg: "48px",
  xl: "56px",
} as const

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
  max: 9999,
} as const

// ============================================================================
// BREAKPOINTS (Mobile-first)
// ============================================================================

export const breakpoints = {
  sm: "360px",  // Small phones
  md: "430px",  // Large phones (our letterboxed max)
  lg: "768px",  // Tablets
  xl: "1024px", // Small desktops
  "2xl": "1280px", // Desktops
} as const

// ============================================================================
// ANIMATION TIMINGS
// ============================================================================

export const animation = {
  duration: {
    instant: "75ms",
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0, 0, 0.2, 1)",
    out: "cubic-bezier(0.4, 0, 1, 1)",
    bounce: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
} as const

// ============================================================================
// INTERACTION STATES
// ============================================================================

export const interaction = {
  scale: {
    hover: 1.02,
    press: 0.98,
    iconHover: 1.05,
    iconPress: 0.95,
  },
  opacity: {
    hover: 0.8,
    press: 0.7,
    disabled: 0.5,
  },
  transition: {
    default: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    fast: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const

// ============================================================================
// MOBILE SPECIFIC
// ============================================================================

export const mobile = {
  // Touch target minimums (Apple HIG & Material Design)
  touchTarget: {
    min: "44px",
    comfortable: "48px",
    large: "56px",
  },
  
  // Safe areas (iOS notch, home indicator)
  safeArea: {
    top: "env(safe-area-inset-top, 0px)",
    bottom: "env(safe-area-inset-bottom, 20px)",
    left: "env(safe-area-inset-left, 0px)",
    right: "env(safe-area-inset-right, 0px)",
  },
  
  // Letterboxed viewport (for React Native WebView embedding)
  letterbox: {
    minWidth: "360px",
    maxWidth: "430px",
    minHeight: "max(884px, 100dvh)",
  },
  
  // Bottom navigation bar
  bottomNav: {
    height: "84px", // With home indicator spacing
    contentHeight: "64px",
  },
} as const

// ============================================================================
// LETTERBOXED CONTAINER
// ============================================================================

export const letterboxedContainer = {
  className: "letterboxed",
  styles: {
    maxWidth: "430px",
    minWidth: "360px",
    marginLeft: "auto",
    marginRight: "auto",
    minHeight: mobile.letterbox.minHeight,
  },
} as const

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format currency in compact format (12.5k, 100k, 1.25M)
 */
export function formatCurrency(amount: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(amount)
}

/**
 * Format number with K suffix
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k"
  }
  return num.toString()
}

/**
 * Get relative time string (e.g., "2h ago", "1d ago")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Generate a consistent color from a string
 */
export function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash % 360)
  return `hsl(${hue}, 70%, 60%)`
}
