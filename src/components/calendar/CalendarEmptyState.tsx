import { CalendarIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

/**
 * CalendarEmptyState Props
 */
interface CalendarEmptyStateProps {
  /**
   * Optional className for additional styling
   */
  className?: string;
  /**
   * Whether to show compact version (for DayDetail)
   * @default false
   */
  compact?: boolean;
  /**
   * Callback when "Schedule first event" is clicked
   * If not provided, defaults to console.log
   */
  onScheduleEvent?: () => void;
  /**
   * Callback when "Explore upcoming days" is clicked
   * If not provided, defaults to navigation logic
   */
  onExploreDays?: () => void;
}

/**
 * CalendarEmptyState Component - displays empty state illustration and CTAs
 */
export function CalendarEmptyState({
  className,
  compact = false,
  onScheduleEvent,
  onExploreDays,
}: CalendarEmptyStateProps) {
  const navigate = useNavigate();

  // Handle "Schedule first event" click
  const handleScheduleClick = () => {
    if (onScheduleEvent) {
      onScheduleEvent();
    } else {
      // Default behavior - will connect to QuickReminder when ready
      console.log("Schedule first event clicked");
    }
  };

  // Handle "Explore upcoming days" click
  const handleExploreClick = () => {
    if (onExploreDays) {
      onExploreDays();
    } else {
      // Default navigation to today's date in calendar
      navigate({ to: "/calendar" });
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-6 px-4" : "py-12 px-6",
        className
      )}
    >
      {/* Illustration */}
      <div className="relative mb-6">
        {/* Outer circle with gradient border */}
        <div className="size-24 md:size-32 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center relative">
          {/* Decorative ring */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          {/* Inner circle with subtle shadow */}
          <div className="size-16 md:size-20 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
            {/* Clock/Calendar icon */}
            <CalendarIcon className="h-8 w-8 md:h-10 md:w-10 text-primary/70" />
          </div>
          {/* Decorative dots */}
          <div className="absolute top-1 right-4 size-2 rounded-full bg-primary/40" />
          <div className="absolute bottom-2 left-3 size-1.5 rounded-full bg-primary/30" />
        </div>
      </div>

      {/* Copy - English */}
      <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">
        Your agenda is empty
      </h3>
      <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
        Schedule events, visits, or reminders to get started.
      </p>

      {/* Action buttons */}
      <div className={cn("flex flex-col gap-3", compact ? "w-full max-w-[200px]" : "w-full max-w-[240px]")}>
        <Button
          onClick={handleScheduleClick}
          className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          size={compact ? "sm" : "default"}
        >
          <span className="flex-1">Schedule First Event</span>
          <ChevronRightIcon className="h-4 w-4 shrink-0" />
        </Button>
        <Button
          onClick={handleExploreClick}
          variant="outline"
          className="w-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          size={compact ? "sm" : "default"}
        >
          Explore Upcoming Days
        </Button>
      </div>
    </div>
  );
}
