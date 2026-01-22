import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const skeletonVariants = cva(
  "animate-pulse rounded-md",
  {
    variants: {
      variant: {
        default: "bg-slate-200 dark:bg-slate-800",
        card: "bg-white dark:bg-[#1a2c30]",
        text: "bg-slate-200 dark:bg-slate-800",
        image: "bg-slate-200 dark:bg-slate-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  )
}

// Card skeleton with multiple elements
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl bg-white dark:bg-[#1a2c30] p-4 shadow-sm border border-slate-100 dark:border-slate-800", className)}>
      <div className="flex gap-4">
        <Skeleton variant="image" className="w-20 h-20 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  )
}

// List skeleton with multiple items
function ListSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 p-3 rounded-xl">
          <Skeleton variant="image" className="w-12 h-12 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Avatar skeleton
function AvatarSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Skeleton variant="image" className="w-10 h-10 shrink-0 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

// KPI card skeleton
function KpiCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("min-w-[160px] flex-1 flex-col gap-3 rounded-xl p-5 bg-white dark:bg-[#1e2e32] border border-slate-200 dark:border-slate-800 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="w-5 h-5 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

export {
  Skeleton,
  CardSkeleton,
  ListSkeleton,
  AvatarSkeleton,
  KpiCardSkeleton,
  skeletonVariants,
}
export type { SkeletonProps }
