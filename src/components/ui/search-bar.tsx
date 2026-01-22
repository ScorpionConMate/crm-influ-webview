import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const searchVariants = cva(
  "flex w-full items-center border transition-all focus-within:ring-2 focus-within:ring-primary/20",
  {
    variants: {
      variant: {
        default:
          "rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a2c30] shadow-sm",
        elevated:
          "rounded-xl border-slate-100 dark:border-slate-700 bg-white dark:bg-[#1a2c30] shadow-md",
        ghost:
          "rounded-lg border-transparent bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800",
      },
      size: {
        sm: "h-10 px-3",
        default: "h-12 px-4",
        lg: "h-14 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface SearchBarProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof searchVariants> {
  icon?: React.ReactNode
  iconClassName?: string
}

function SearchBar({
  className,
  variant,
  size,
  icon,
  iconClassName,
  ...props
}: SearchBarProps) {
  const [IconComponent] = React.Children.toArray(icon)

  return (
    <div className={cn(searchVariants({ variant, size }), className)}>
      {icon && (
        <div className={cn("flex items-center justify-center text-slate-400 dark:text-slate-500", iconClassName)}>
          {IconComponent}
        </div>
      )}
      <input
        type="search"
        className={cn(
          "flex min-w-0 flex-1 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-0 border-none",
          size === "sm" && "text-sm",
          size === "default" && "text-base",
          size === "lg" && "text-lg"
        )}
        {...props}
      />
    </div>
  )
}

export { SearchBar, searchVariants }
export type { SearchBarProps }
