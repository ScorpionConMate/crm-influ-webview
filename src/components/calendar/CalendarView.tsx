import { useState, useRef } from "react";
import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ZapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/stores/calendarStore";
import { useCalendarEventsForMonth } from "@/hooks/useCalendarEvents";
import type { CalendarEvent } from "@/lib/calendar/eventTypes";
import { EventType, EVENT_TYPE_COLORS } from "@/lib/calendar/eventTypes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Color class mapping for event indicators
 */
const DOT_COLORS: Record<string, string> = {
  primary: "bg-primary",
  orange: "bg-orange-400",
  purple: "bg-purple-400",
  gray: "bg-slate-400",
};

/**
 * Event color class from EventType
 */
function getEventDotColor(type: EventType): string {
  const colorKey = EVENT_TYPE_COLORS[type];
  return DOT_COLORS[colorKey] || DOT_COLORS.primary;
}

/**
 * Long press hook for context menu
 */
function useLongPress(callback: () => void, ms = 500) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isLongPressRef = useRef(false);

  const start = () => {
    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      callback();
      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, ms);
  };

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
  };
}

/**
 * Calendar Day Component - renders individual day cell
 */
interface DayCellProps {
  date: Date;
  isPaddingDay: boolean;
  isSelected: boolean;
  isToday: boolean;
  onClick: () => void;
  onLongPress: () => void;
  events: CalendarEvent[];
}

function DayCell({ date, isPaddingDay, isSelected, isToday, onClick, onLongPress, events }: DayCellProps) {
  const displayDots = events.slice(0, 3);
  const overflowCount = events.length - 3;
  const longPress = useLongPress(onLongPress, 500);

  const ariaLabel = `${format(date, "EEEE, MMMM d")}${isToday ? ", Today" : ""}${events.length > 0 ? `, ${events.length} event${events.length > 1 ? "s" : ""}` : ""}`;

  if (isPaddingDay) {
    return (
      <div
        role="gridcell"
        aria-label={format(date, "MMMM d")}
        className="min-h-[14vh] border-b border-r border-slate-50 dark:border-slate-800 p-1 flex flex-col items-center"
      >
        <span className="text-slate-300 dark:text-slate-600 text-sm font-medium mt-1">
          {format(date, "d")}
        </span>
      </div>
    );
  }

  return (
    <button
      role="gridcell"
      aria-label={ariaLabel}
      aria-selected={isSelected}
      aria-current={isToday ? "date" : undefined}
      onClick={onClick}
      {...longPress}
      className={cn(
        "min-h-[14vh] border-b border-r border-slate-50 dark:border-slate-800 p-1 flex flex-col items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary focus:z-10",
        isSelected && "bg-primary/5 dark:bg-primary/20 ring-2 ring-inset ring-primary/30"
      )}
    >
      {isToday && isSelected ? (
        <span className="absolute top-1 size-7 flex items-center justify-center rounded-full bg-primary text-white text-sm font-bold shadow-md shadow-primary/30">
          {format(date, "d")}
        </span>
      ) : (
        <span
          className={cn(
            "text-sm font-medium mt-1",
            isSelected ? "text-primary dark:text-primary" : "text-slate-700 dark:text-slate-300",
            isToday && !isSelected && "font-bold"
          )}
        >
          {format(date, "d")}
        </span>
      )}

      {displayDots.length > 0 && (
        <div className={cn("mt-2 flex gap-1", isSelected && "mt-8")}>
          {displayDots.map((event) => (
            <div
              key={event.id}
              className={cn("size-1.5 rounded-full", getEventDotColor(event.type))}
            />
          ))}
        </div>
      )}

      {overflowCount > 0 && (
        <span className={cn("text-[10px] text-slate-400 font-medium", displayDots.length > 0 && "mt-0.5")}>
          +{overflowCount}
        </span>
      )}
    </button>
  );
}

/**
 * CalendarView Component - displays month view with day grid
 */
export function CalendarView() {
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    navigateMonth,
    goToToday,
    getMonthDays,
  } = useCalendarStore();

  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<"left" | "right" | null>(null);
  const [contextMenuDate, setContextMenuDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const monthDays = getMonthDays();
  const monthEvents = useCalendarEventsForMonth(currentDate);

  // Create a map of date keys to events for quick lookup
  const eventsByDate = new Map<string, CalendarEvent[]>(
    monthDays.map((date) => [
      date.toDateString(),
      monthEvents.filter((e) => e.date.toDateString() === date.toDateString()),
    ])
  );

  // Find next event in month
  const nextEventDate = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureEvents = monthEvents.filter((e) => e.date >= today);
    return futureEvents.length > 0 ? futureEvents[0].date : null;
  })();

  // Handle month navigation with animation
  const handleMonthNavigate = (direction: -1 | 1) => {
    setAnimationDirection(direction === 1 ? "right" : "left");
    setIsAnimating(true);
    navigateMonth(direction);

    setTimeout(() => {
      setIsAnimating(false);
      setAnimationDirection(null);
    }, 200);
  };

  // Handle swipe gestures for month navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartXRef.current - touchEndX;
    const diffY = touchStartYRef.current - touchEndY;

    // Only trigger swipe if horizontal movement is significantly greater than vertical
    if (Math.abs(diffX) > 50 && Math.abs(diffY) < 50) {
      if (diffX > 0) {
        // Swipe left - next month
        handleMonthNavigate(1);
      } else {
        // Swipe right - previous month
        handleMonthNavigate(-1);
      }
      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(25);
      }
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    // Focus on the clicked day after selection
    setTimeout(() => {
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>(`button[aria-label*="${format(date, "MMMM d")}"]`);
      buttons?.[buttons.length - 1]?.focus();
    }, 100);
  };

  // Handle context menu actions
  const handleContextMenuCreateEvent = (date: Date) => {
    setSelectedDate(date);
    // Will connect to QuickReminder when ready
    console.log("Create event on:", date);
    setContextMenuDate(null);
  };

  const handleContextMenuGoToDate = (date: Date) => {
    // Placeholder for date picker - for now just select the date
    setSelectedDate(date);
    setContextMenuDate(null);
  };

  const handleContextMenuAddReminder = (date: Date) => {
    setSelectedDate(date);
    // Will connect to QuickReminder when ready
    console.log("Add reminder on:", date);
    setContextMenuDate(null);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="grid"
      aria-label={`${format(currentDate, "MMMM yyyy")} calendar`}
    >
      {/* Header with navigation */}
      <header
        className={cn(
          "flex-none bg-background-light dark:bg-background-dark pt-safe-top z-20 transition-transform duration-200 ease-in-out",
          isAnimating && animationDirection === "left" && "translate-x-4 opacity-50",
          isAnimating && animationDirection === "right" && "-translate-x-4 opacity-50"
        )}
      >
        <div className="flex items-center p-4 pb-2 justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleMonthNavigate(-1)}
            className="rounded-full"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </Button>
          <div className="flex-1 flex flex-col items-center gap-1">
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToToday}
                className="h-5 px-2 text-xs font-medium text-primary hover:text-primary"
              >
                Today
              </Button>
              {nextEventDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDate(nextEventDate)}
                  className="h-5 px-2 text-xs font-medium text-primary hover:text-primary gap-1"
                >
                  <ZapIcon className="h-3 w-3" />
                  Next Event
                </Button>
              )}
            </div>
          </div>
          <div className="flex w-10 items-center justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleMonthNavigate(1)}
              className="rounded-full"
              aria-label="Next month"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 pb-2 px-1 border-b border-slate-200 dark:border-slate-800/50" role="rowgroup">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              role="columnheader"
              aria-label={day}
              className="text-center text-slate-400 dark:text-slate-500 text-[11px] font-semibold uppercase tracking-wider py-2"
            >
              {day}
            </div>
          ))}
        </div>
      </header>

      {/* Month grid */}
      <main
        className={cn(
          "flex-1 overflow-y-auto bg-white dark:bg-[#15262a] relative z-0 transition-transform duration-200 ease-in-out",
          isAnimating && animationDirection === "left" && "translate-x-4 opacity-50",
          isAnimating && animationDirection === "right" && "-translate-x-4 opacity-50"
        )}
      >
        <div className="grid grid-cols-7 auto-rows-fr" role="rowgroup">
          {monthDays.map((date, index) => {
            const isPaddingDay = !isSameMonth(date, currentDate);
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
            const isDayToday = isToday(date);
            const dayEvents = eventsByDate.get(date.toDateString()) || [];

            return (
              <DayCell
                key={index}
                date={date}
                isPaddingDay={isPaddingDay}
                isSelected={isSelected}
                isToday={isDayToday}
                onClick={() => handleDayClick(date)}
                onLongPress={() => setContextMenuDate(date)}
                events={dayEvents}
              />
            );
          })}
        </div>
        {/* Spacer for scroll */}
        <div className="h-32 col-span-7" />
      </main>

      {/* Context menu - using dropdown-menu */}
      {contextMenuDate && (
        <DropdownMenu open={Boolean(contextMenuDate)} onOpenChange={(open) => !open && setContextMenuDate(null)}>
          <DropdownMenuTrigger asChild>
            <div style={{ display: "none" }} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => handleContextMenuCreateEvent(contextMenuDate)}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Create event
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleContextMenuGoToDate(contextMenuDate)}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Go to date
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleContextMenuAddReminder(contextMenuDate)}>
              <ZapIcon className="h-4 w-4 mr-2" />
              Add reminder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
