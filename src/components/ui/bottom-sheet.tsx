import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const bottomSheetVariants = cva(
  "relative z-50 w-full max-w-[430px] mx-auto rounded-t-3xl shadow-2xl bg-white dark:bg-[#1a2c30] overflow-hidden",
  {
    variants: {
      position: {
        bottom: "fixed bottom-0 left-0 right-0",
        center: "fixed inset-0 m-auto max-h-[90vh] rounded-2xl",
      },
    },
    defaultVariants: {
      position: "bottom",
    },
  }
)

interface BottomSheetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bottomSheetVariants> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  overlay?: boolean
  handle?: boolean
  children?: React.ReactNode
}

function BottomSheet({
  className,
  open,
  onOpenChange,
  overlay = true,
  handle = true,
  children,
  position,
  ...props
}: BottomSheetProps) {
  const sheetRef = React.useRef<HTMLDivElement>(null)

  // Handle escape key to close
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange?.(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onOpenChange])

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange?.(false)
    }
  }

  if (!open) return null

  return (
    <>
      {overlay && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-[2px] transition-opacity"
          onClick={handleBackdropClick}
        />
      )}
      <div
        ref={sheetRef}
        className={cn(
          bottomSheetVariants({ position }),
          "flex flex-col transition-transform duration-300 ease-out",
          position === "bottom" && "translate-y-0",
          className
        )}
        {...props}
      >
        {handle && (
          <div className="flex justify-center pt-3 pb-1 w-full">
            <div className="h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        )}
        {children}
      </div>
    </>
  )
}

const BottomSheetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between px-6 pt-8 pb-3 border-b border-slate-100 dark:border-slate-800",
      className
    )}
    {...props}
  />
))
BottomSheetHeader.displayName = "BottomSheetHeader"

const BottomSheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-xl font-bold text-slate-900 dark:text-white", className)}
    {...props}
  />
))
BottomSheetTitle.displayName = "BottomSheetTitle"

const BottomSheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500 dark:text-slate-400", className)}
    {...props}
  />
))
BottomSheetDescription.displayName = "BottomSheetDescription"

const BottomSheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex-1 overflow-y-auto overscroll-contain p-6",
      className
    )}
    {...props}
  />
))
BottomSheetContent.displayName = "BottomSheetContent"

const BottomSheetFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-4 px-6 border-t border-slate-100 dark:border-slate-800 pb-8",
      className
    )}
    {...props}
  />
))
BottomSheetFooter.displayName = "BottomSheetFooter"

export {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetContent,
  BottomSheetFooter,
  bottomSheetVariants,
}
export type { BottomSheetProps }
