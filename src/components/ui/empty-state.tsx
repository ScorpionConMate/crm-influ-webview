import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const emptyStateVariants = cva(
  "flex flex-col items-center text-center",
  {
    variants: {
      size: {
        sm: "p-6",
        default: "p-8",
        lg: "p-12",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: LucideIcon
  illustration?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "primary" | "secondary"
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

function EmptyState({
  className,
  size,
  icon: Icon,
  illustration,
  title,
  description,
  action,
  secondaryAction,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cn(emptyStateVariants({ size }), className)} {...props}>
      {/* Illustration or Icon */}
      {illustration ? (
        <div className="mb-8">{illustration}</div>
      ) : Icon ? (
        <div className="mb-8 relative">
          <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl" />
          <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-background to-slate-100 dark:from-background-dark dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <Icon className="w-16 h-16 text-primary" />
          </div>
        </div>
      ) : null}

      {/* Text Content */}
      <div className="space-y-3 mb-8 max-w-sm">
        <h1 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col w-full gap-3 max-w-sm">
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                "w-full h-12 flex items-center justify-center text-sm font-bold tracking-tight rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-primary/20",
                action.variant === "secondary"
                  ? "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  : "bg-primary hover:bg-primary/90 text-background-dark"
              )}
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="w-full h-12 flex items-center justify-center bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-sm font-semibold tracking-tight rounded-lg transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export { EmptyState, emptyStateVariants }
export type { EmptyStateProps }
