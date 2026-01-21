import * as React from "react";
import { type TimelineEvent } from "@/lib/zod/schemas";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CalendarIcon, ClockIcon, CheckCircle2Icon, AlertCircleIcon, UserIcon, Building2Icon, FileTextIcon } from "lucide-react";

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

function formatDate(date: Date): string {
  const now = new Date();
  const eventDate = new Date(date);
  const diffMs = now.getTime() - eventDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else {
    return eventDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: eventDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getEventIcon(type: TimelineEvent["type"]) {
  switch (type) {
    case "deal_created":
    case "deal_status_changed":
      return FileTextIcon;
    case "reminder_created":
      return ClockIcon;
    case "reminder_completed":
      return CheckCircle2Icon;
    case "visit_started":
      return UserIcon;
    case "visit_ended":
      return CheckCircle2Icon;
    case "deliverable_added":
      return FileTextIcon;
    case "deliverable_completed":
      return CheckCircle2Icon;
    case "payment_added":
      return FileTextIcon;
    case "payment_completed":
      return CheckCircle2Icon;
    case "note_added":
      return FileTextIcon;
    default:
      return AlertCircleIcon;
  }
}

function getEventColor(type: TimelineEvent["type"]): string {
  switch (type) {
    case "deal_created":
      return "bg-blue-500";
    case "deal_status_changed":
      return "bg-purple-500";
    case "reminder_created":
      return "bg-amber-500";
    case "reminder_completed":
      return "bg-green-500";
    case "visit_started":
      return "bg-cyan-500";
    case "visit_ended":
      return "bg-green-500";
    case "deliverable_added":
      return "bg-blue-500";
    case "deliverable_completed":
      return "bg-green-500";
    case "payment_added":
      return "bg-purple-500";
    case "payment_completed":
      return "bg-green-500";
    case "note_added":
      return "bg-slate-500";
    default:
      return "bg-slate-400";
  }
}

function getEventEntityLabel(entityType: TimelineEvent["entityType"]): string {
  switch (entityType) {
    case "deal":
      return "Deal";
    case "place":
      return "Place";
    case "contact":
      return "Contact";
    case "reminder":
      return "Reminder";
    case "visit":
      return "Visit";
    default:
      return "Item";
  }
}

export function Timeline({ events, className }: TimelineProps) {
  const sortedEvents = React.useMemo(() => {
    return [...events].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [events]);

  if (sortedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ClockIcon className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No history yet
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {sortedEvents.map((event, index) => {
        const Icon = getEventIcon(event.type);
        const colorClass = getEventColor(event.type);

        return (
          <div key={event.id} className="relative pl-8">
            {index !== sortedEvents.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />
            )}
            <div
              className={cn(
                "absolute left-0 top-0 h-8 w-8 rounded-full flex items-center justify-center",
                colorClass
              )}
            >
              <Icon className="h-4 w-4 text-white" />
            </div>
            <Card className="p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {event.title}
                  </p>
                  {event.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{formatDate(event.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                      <ClockIcon className="h-3 w-3" />
                      <span>{formatTime(event.timestamp)}</span>
                    </div>
                  </div>
                </div>
                {event.entityType && (
                  <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                    {event.entityType === "place" && <Building2Icon className="h-3 w-3" />}
                    {event.entityType === "contact" && <UserIcon className="h-3 w-3" />}
                    <span>{getEventEntityLabel(event.entityType)}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
