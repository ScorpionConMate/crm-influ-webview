import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Animation duration variants
export const animationDuration = {
  instant: "75ms",
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
  slower: "500ms",
} as const

// Animation easing variants
export const animationEasing = {
  default: "cubic-bezier(0.4, 0, 0.2, 1)",
  in: "cubic-bezier(0, 0, 0.2, 1)",
  out: "cubic-bezier(0.4, 0, 1, 1)",
  "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
} as const

// Animation variants for Framer Motion or CSS
export const motionVariants = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },

  // Slide animations
  slideInBottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
  },
  slideInTop: {
    initial: { y: "-100%" },
    animate: { y: 0 },
    exit: { y: "-100%" },
  },
  slideInLeft: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
  },
  slideInRight: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
  },

  // Staggered list items
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },

  // Press/scale feedback
  press: {
    whileTap: { scale: 0.98 },
    whileHover: { scale: 1.02 },
  },
  pressSoft: {
    whileTap: { scale: 0.99 },
  },

  // Button press feedback
  buttonPress: {
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.05 },
  },

  // Tab animations
  tabActive: {
    scale: 1,
    opacity: 1,
  },
  tabInactive: {
    scale: 0.95,
    opacity: 0.6,
  },

  // Card hover
  cardHover: {
    whileHover: {
      y: -2,
      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    },
  },

  // Pulse animation
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  // Shimmer/skeleton loading
  shimmer: {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    },
  },

  // Bounce for notifications
  bounce: {
    animate: {
      y: [0, -10, 0],
    },
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: "easeOut",
      repeatDelay: 2,
    },
  },

  // Rotate for loading spinners
  rotate: {
    animate: {
      rotate: 360,
    },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
} as const

// CSS animation keyframes
export const cssAnimations = {
  fade: {
    keyframes: `@keyframes fade {
      from { opacity: 0; }
      to { opacity: 1; }
    }`,
    className: "animate-fade",
  },
  slideUp: {
    keyframes: `@keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }`,
    className: "animate-slide-up",
  },
  slideDown: {
    keyframes: `@keyframes slideDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }`,
    className: "animate-slide-down",
  },
  slideLeft: {
    keyframes: `@keyframes slideLeft {
      from { transform: translateX(20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }`,
    className: "animate-slide-left",
  },
  slideRight: {
    keyframes: `@keyframes slideRight {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }`,
    className: "animate-slide-right",
  },
  scale: {
    keyframes: `@keyframes scale {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }`,
    className: "animate-scale",
  },
  pulse: {
    keyframes: `@keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }`,
    className: "animate-pulse",
  },
  bounce: {
    keyframes: `@keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }`,
    className: "animate-bounce",
  },
  spin: {
    keyframes: `@keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }`,
    className: "animate-spin",
  },
  shimmer: {
    keyframes: `@keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }`,
    className: "animate-shimmer",
  },
} as const

// Stagger delay utility
export function getStaggerDelay(index: number, baseDelay = 50): number {
  return index * baseDelay
}

// Spring physics for Framer Motion
export const springPhysics = {
  type: "spring",
  stiffness: 300,
  damping: 20,
  mass: 0.8,
} as const
