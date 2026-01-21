import { useRef } from "react";
import { format } from "date-fns";
import { XIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/stores/calendarStore";
import { useCalendarEventsForDate } from "@/hooks/useCalendarEvents";
import type { CalendarEvent } from "@/lib/calendar/eventTypes";
import {
  EventType,
  EventStatus,
  EVENT_TYPE_COLORS,
  formatEventTime,
} from "@/lib/calendar/eventTypes";
import { CalendarEmptyState } from "@/components/calendar/CalendarEmptyState";

/**
 * Color class mapping for event dots
 */
const DOT_COLORS: Record<string, string> = {
  primary: "bg-primary",
  orange: "bg-orange-400",
  purple: "bg-purple-400",
  gray: "bg-slate-400",
};

/**
 * Get event dot color from EventType
 */
function getEventDotColor(type: EventType): string {
  const colorKey = EVENT_TYPE_COLORS[type];
  return DOT_COLORS[colorKey] || DOT_COLORS.primary;
}

/**
 * Compact Event Card - shows in collapsed view
 */
interface CompactEventCardProps {
  event: CalendarEvent;
  onClick: () => void;
}

function CompactEventCard({ event, onClick }: CompactEventCardProps) {
  const timeString = formatEventTime(event.time);
  const dotColor = getEventDotColor(event.type);
  const isPast = event.status === EventStatus.PAST;
  const isCompleted = event.status === EventStatus.COMPLETED;

  // Extract subtitle from metadata if available
  const subtitle = event.metadata?.placeId
    ? `Place: ${event.metadata.placeId}`
    : event.metadata?.contactId
      ? `Contact: ${event.metadata.contactId}`
      : event.metadata?.status
        ? `Status: ${event.metadata.status as string}`
        : event.type === EventType.REMINDER
          ? "Reminder"
          : event.type === EventType.VISIT
            ? "Visit"
            : event.type === EventType.DEAL
              ? "Deal"
              : event.type === EventType.DELIVERABLE
                ? "Deliverable"
                : "Event";

  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 active:scale-[0.98] transition-all w-full text-left",
        isPast && "opacity-60",
        isCompleted && "opacity-80"
      )}
    >
      <div className="flex flex-col items-center gap-1 w-10">
        <span className="text-[10px] font-bold text-slate-400">
          {timeString?.split(" ")[0] || "--:--"}
        </span>
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            dotColor,
            isCompleted && "bg-green-500"
          )}
        />
      </div>
      <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
          {event.title}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
          {subtitle}
        </p>
      </div>
    </button>
  );
}

/**
 * DayDetail Props
 */
interface DayDetailProps {
  isVisible: boolean;
  onDismiss: () => void;
}

/**
 * DayDetail Component - bottom sheet showing events for selected day
 */
export function DayDetail({ isVisible, onDismiss }: DayDetailProps) {
  const { selectedDate } = useCalendarStore();
  const navigate = useNavigate();
  const touchStartRef = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Always call hooks (React Hooks rules) - use fallback date when selectedDate is null
  const events = useCalendarEventsForDate(selectedDate || new Date());
  const dateLabel = selectedDate ? format(selectedDate, "EEEE, MMM d") : "";

  // Hide when no date selected or not visible
  if (!selectedDate || !isVisible) {
    return null;
  }

  // Handle event click - navigate to entity detail
  const handleEventClick = (event: CalendarEvent) => {
    onDismiss();
    if (event.entityType === "deal" && event.metadata?.status) {
      navigate({ to: `/deals/${event.entityId}` });
    } else if (event.entityType === "visit" && event.entityId) {
      navigate({ to: `/visit/${event.entityId}/notes` });
    }
    // Contacts and places will be added when routes are available
  };

  // Handle swipe to dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchY = e.touches[0].clientY;
    const diff = touchY - touchStartRef.current;
    if (diff > 100 && sheetRef.current) {
      // Swipe down threshold reached
      onDismiss();
    }
  };

  return (
    <div
      ref={sheetRef}
      className="fixed inset-x-0 bottom-0 z-30 rounded-t-[2rem] bg-white dark:bg-[#1a2e33] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] border-t border-slate-100 dark:border-slate-700 flex flex-col transform transition-transform duration-300 pb-safe-bottom"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Handle indicator */}
      <div className="w-full flex justify-center pt-3 pb-2 cursor-pointer" onClick={onDismiss}>
        <div className="w-10 h-1 bg-slate-200 dark:bg-slate-600 rounded-full" />
      </div>

      {/* Header */}
      <div className="px-6 py-2 flex justify-between items-center border-b border-slate-50 dark:border-slate-800/50">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {dateLabel}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {events.length === 0
              ? "No events"
              : `${events.length} ${events.length === 1 ? "item" : "items"} on agenda`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full transition-colors"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto px-4 py-4 max-h-[45vh]">
        {events.length === 0 ? (
          // Empty state - use CalendarEmptyState with compact variant
          <div className="flex flex-col items-center justify-center py-4">
            <CalendarEmptyState
              compact
              onScheduleEvent={() => {
                console.log("Create reminder for:", selectedDate);
                // Will connect to QuickReminder when ready
              }}
            />
          </div>
        ) : (
          // Collapsed view - compact cards
          <div className="space-y-3 pb-4">
            {events.map((event: CalendarEvent) => (
              <CompactEventCard
                key={event.id}
                event={event}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
