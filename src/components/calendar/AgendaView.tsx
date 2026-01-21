import { format, isSameDay, isToday, startOfWeek } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/stores/calendarStore";
import { useCalendarEventsForWeek } from "@/hooks/useCalendarEvents";
import type { CalendarEvent, EventType } from "@/lib/calendar/eventTypes";
import {
  EventStatus,
  EVENT_TYPE_COLORS,
  formatEventTime,
} from "@/lib/calendar/eventTypes";
import { Button } from "@/components/ui/button";
import { CalendarEmptyState } from "@/components/calendar/CalendarEmptyState";

/**
 * Event type badge colors
 */
const BADGE_COLORS: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  orange: "bg-orange-400/10 text-orange-500",
  purple: "bg-purple-400/10 text-purple-500",
  gray: "bg-gray-100 dark:bg-gray-800 text-gray-500",
};

/**
 * Timeline dot color from EventType
 */
function getTimelineDotColor(type: EventType): string {
  const colorKey = EVENT_TYPE_COLORS[type];
  return BADGE_COLORS[colorKey] || BADGE_COLORS.primary;
}

/**
 * Event card border color from EventType
 */
function getEventBorderColor(type: EventType): string {
  const colorKey = EVENT_TYPE_COLORS[type];
  const borderColors: Record<string, string> = {
    primary: "border-primary",
    orange: "border-orange-400",
    purple: "border-purple-400",
    gray: "border-gray-400",
  };
  return borderColors[colorKey] || borderColors.primary;
}

/**
 * Week Day Button Component
 */
interface WeekDayButtonProps {
  date: Date;
  isSelected: boolean;
  onClick: () => void;
  ariaLabel?: string;
}

function WeekDayButton({ date, isSelected, onClick, ariaLabel }: WeekDayButtonProps) {
  const dayName = format(date, "EEE");
  const dayNumber = format(date, "d");
  const label = ariaLabel || format(date, "EEEE, MMMM d");

  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-selected={isSelected}
      role="tab"
      className={cn(
        "flex flex-col items-center justify-center w-[3.5rem] h-[4rem] rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
        isSelected
          ? "bg-white dark:bg-[#1e2e32] shadow-sm border border-slate-100 dark:border-slate-700/50 relative overflow-hidden ring-1 ring-primary/20"
          : "hover:bg-white dark:hover:bg-slate-800"
      )}
    >
      {isSelected && (
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
      )}
      <p
        className={cn(
          "text-[10px] font-bold uppercase mb-1",
          isSelected ? "text-primary" : "text-slate-400 dark:text-slate-500"
        )}
      >
        {dayName}
      </p>
      <div
        className={cn(
          "size-7 flex items-center justify-center rounded-full text-sm font-bold",
          isSelected
            ? "bg-primary text-white shadow-md shadow-primary/30"
            : "text-slate-900 dark:text-white group-hover:bg-slate-100 dark:group-hover:bg-slate-700"
        )}
      >
        {dayNumber}
      </div>
    </button>
  );
}

/**
 * Event Card Component
 */
interface EventCardProps {
  event: CalendarEvent;
  isLast: boolean;
}

function EventCard({ event, isLast }: EventCardProps) {
  const timeString = formatEventTime(event.time);
  const badgeColor = getTimelineDotColor(event.type);
  const borderColor = getEventBorderColor(event.type);
  const isPast = event.status === EventStatus.PAST;
  const isCompleted = event.status === EventStatus.COMPLETED;

  // Extract subtitle from metadata if available
  const subtitle = event.metadata?.placeId
    ? `Place: ${event.metadata.placeId}`
    : event.metadata?.contactId
      ? `Contact: ${event.metadata.contactId}`
      : event.metadata?.status
        ? `Status: ${event.metadata.status as string}`
        : undefined;

  // Check if event has entity icon/avatar
  const hasEntityIcon = event.entityType === "reminder" || event.entityType === "visit";

  return (
    <div
      className={cn(
        "flex gap-4",
        isPast && "opacity-60",
        isCompleted && "opacity-80"
      )}
    >
      {/* Time column */}
      <div className="flex flex-col items-end w-12 shrink-0 pt-1">
        <span className="text-slate-900 dark:text-white text-xs font-bold">
          {timeString?.split(" ")[0]}
        </span>
        <span className="text-slate-400 text-[10px]">
          {timeString?.split(" ")[1]}
        </span>
      </div>

      {/* Event card with timeline */}
      <div className="flex-1 relative">
        {/* Timeline vertical line */}
        <div
          className={cn(
            "absolute left-[-17px] top-2 w-[2px] rounded-full",
            isLast
              ? "bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-700/50"
              : "bg-slate-200 dark:bg-slate-700/50",
            isCompleted && "opacity-50"
          )}
          style={{ bottom: isLast ? 0 : "-24px" }}
        />
        {/* Timeline dot */}
        <div
          className={cn(
            "absolute left-[-21px] top-[6px] size-[10px] rounded-full border-2 border-background-light dark:border-background-dark box-content z-10",
            badgeColor,
            isPast && "bg-transparent border-2 border-slate-300 dark:border-slate-600"
          )}
        />

        {/* Event card */}
        <div
          className={cn(
            "bg-white dark:bg-[#15262a] p-3 rounded-lg shadow-sm border-l-[3px]",
            borderColor,
            isPast && "bg-transparent border border-slate-200 dark:border-slate-800 border-dashed"
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 flex flex-col gap-1">
              {/* Event type badge */}
              <div className="flex items-center gap-2">
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide", badgeColor)}>
                  {event.type}
                </span>
                {isCompleted && (
                  <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Done
                  </span>
                )}
              </div>
              {/* Event title */}
              <p className="text-slate-900 dark:text-white text-sm font-bold leading-snug">
                {event.title}
              </p>
              {/* Optional subtitle */}
              {subtitle && !isPast && (
                <p className="text-slate-500 dark:text-slate-400 text-[10px]">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Optional entity icon/avatar */}
            {hasEntityIcon && !isPast && (
              <div className="size-12 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg bg-cover bg-center flex items-center justify-center">
                <span className="text-slate-400 text-xs">
                  {event.entityType === "reminder" ? "🔔" : "📍"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Day Group Component
 */
interface DayGroupProps {
  date: Date;
  events: CalendarEvent[];
}

function DayGroup({ date, events }: DayGroupProps) {
  const dateLabel = format(date, "EEEE, MMM d");
  const isDayToday = isToday(date);

  if (events.length === 0) {
    return (
      <div>
        <div className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-y border-slate-200 dark:border-slate-800/50 px-4 py-2 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {dateLabel}
          </h3>
        </div>
        <div className="p-4 space-y-6">
          <div className="flex gap-4 opacity-60">
            <div className="w-12 text-right" />
            <div className="flex-1 relative">
              <div className="absolute left-[-17px] top-2 w-[2px] bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-700/50 rounded-full" />
              <div className="absolute left-[-21px] top-[6px] size-[10px] rounded-full border-2 border-slate-300 dark:border-slate-600 bg-background-light dark:bg-background-dark box-content z-10" />
              <div className="bg-transparent border border-slate-200 dark:border-slate-800 border-dashed p-3 rounded-lg">
                <p className="text-slate-400 text-sm italic">No events scheduled</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-y border-slate-200 dark:border-slate-800/50 px-4 py-2 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <h3 className={cn("text-sm font-bold", isDayToday ? "text-primary" : "text-slate-700 dark:text-slate-200")}>
            {dateLabel}
          </h3>
          {isDayToday && (
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">Today</span>
          )}
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {events.length} {events.length === 1 ? "event" : "events"}
        </span>
      </div>
      <div className="p-4 space-y-6">
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} isLast={index === events.length - 1} />
        ))}
      </div>
    </div>
  );
}

/**
 * AgendaView Component - displays agenda list view with week navigation
 */
export function AgendaView() {
  const { currentDate, selectedDate, setSelectedDate, goToToday, getWeekDays } = useCalendarStore();

  // Get week days starting from the selected date or current date
  const weekStart = startOfWeek(selectedDate || currentDate, { weekStartsOn: 1 });
  const weekDays = getWeekDays(weekStart);

  // Get events for the week using reactive hook
  const weekDayEvents = useCalendarEventsForWeek(weekDays);

  // Combine dates with their events
  const weekEvents = weekDays.map((date, index) => ({
    date,
    events: weekDayEvents[index],
  }));

  // Check if there are any events in the week
  const hasEvents = weekEvents.some(({ events }) => events.length > 0);

  // Navigate to previous/next week
  const handleWeekNavigate = (direction: number) => {
    const offset = direction * 7;
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    setSelectedDate(newDate);
    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }
  };

  // Handle day selection
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with navigation */}
      <header
        className="flex-none bg-background-light dark:bg-background-dark pt-safe-top z-20 border-b border-slate-200 dark:border-slate-800/50 shadow-sm"
        role="region"
        aria-label={`${format(currentDate, "MMMM yyyy")} agenda`}
      >
        <div className="flex items-center p-4 pb-2 justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleWeekNavigate(-1)}
            className="rounded-full"
            aria-label="Previous week"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </Button>
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <Button
              variant="ghost"
              size="xs"
              onClick={goToToday}
              className="h-5 px-2 text-xs font-medium text-primary hover:text-primary"
            >
              Today
            </Button>
          </div>
          <div className="flex w-10 items-center justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleWeekNavigate(1)}
              className="rounded-full"
              aria-label="Next week"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Week day selector */}
        <div className="pb-3 overflow-x-auto no-scrollbar" role="tablist" aria-label="Week days">
          <div className="flex px-4 items-center gap-2 min-w-max">
            {weekDays.map((date) => {
              const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
              const dateLabel = format(date, "EEEE, MMMM d");
              return (
                <WeekDayButton
                  key={date.toISOString()}
                  date={date}
                  isSelected={isSelected}
                  onClick={() => handleDayClick(date)}
                  ariaLabel={dateLabel}
                />
              );
            })}
          </div>
        </div>
      </header>

      {/* Event list or empty state */}
      <main className="flex-1 overflow-y-auto relative z-0" role="region" aria-live="polite">
        {hasEvents ? (
          <div className="pb-32">
            {weekEvents.map(({ date, events }) => (
              <DayGroup key={date.toISOString()} date={date} events={events} />
            ))}
          </div>
        ) : (
          <div className="pb-32 flex items-center justify-center min-h-[300px]">
            <CalendarEmptyState onExploreDays={() => handleWeekNavigate(1)} />
          </div>
        )}
      </main>
    </div>
  );
}
