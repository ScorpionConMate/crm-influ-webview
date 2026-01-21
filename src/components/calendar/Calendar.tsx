import { useState, useEffect, useCallback } from "react";
import { useCalendarStore } from "@/stores/calendarStore";
import { useCalendarStoreSubscription } from "@/hooks/useCalendarEvents";
import { CalendarView } from "./CalendarView";
import { AgendaView } from "./AgendaView";
import { DayDetail } from "./DayDetail";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

/**
 * Keyboard shortcuts hook
 */
function useKeyboardShortcuts(
  selectedDate: Date | null,
  setSelectedDate: (date: Date) => void,
  viewMode: "month" | "agenda",
  onDismissDetail: () => void,
  onToggleView: () => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      // Escape: close DayDetail
      if (e.key === "Escape") {
        onDismissDetail();
        return;
      }

      // T: go to today
      if (e.key === "t" || e.key === "T") {
        const today = new Date();
        setSelectedDate(today);
        return;
      }

      // Tab: toggle between month and agenda views
      if (e.key === "Tab" && !e.shiftKey) {
        onToggleView();
        e.preventDefault();
        return;
      }

      // Navigation shortcuts - only if a date is selected
      if (!selectedDate) {
        return;
      }

      const newDate = new Date(selectedDate);

      switch (e.key) {
        case "ArrowLeft":
          newDate.setDate(newDate.getDate() - 1);
          setSelectedDate(newDate);
          e.preventDefault();
          break;
        case "ArrowRight":
          newDate.setDate(newDate.getDate() + 1);
          setSelectedDate(newDate);
          e.preventDefault();
          break;
        case "ArrowUp":
          newDate.setDate(newDate.getDate() - 7);
          setSelectedDate(newDate);
          e.preventDefault();
          break;
        case "ArrowDown":
          newDate.setDate(newDate.getDate() + 7);
          setSelectedDate(newDate);
          e.preventDefault();
          break;
        case "Enter":
        case " ":
          // Day is already selected, this is a no-op
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDate, setSelectedDate, onDismissDetail, onToggleView]);
}

export function Calendar() {
  const { viewMode, setViewMode, selectedDate, setSelectedDate } = useCalendarStore();
  const [isDayDetailVisible, setIsDayDetailVisible] = useState(false);

  // Subscribe to store changes to trigger re-renders when events update
  useCalendarStoreSubscription();

  // Show DayDetail when a date is selected
  if (selectedDate) {
    setIsDayDetailVisible(true);
  }

  // Handle view mode change
  const handleViewModeChange = useCallback((newMode: string) => {
    setViewMode(newMode as "month" | "agenda");
  }, [setViewMode]);

  // Handle view toggle for keyboard shortcut
  const handleToggleView = useCallback(() => {
    const newViewMode: "month" | "agenda" = viewMode === "month" ? "agenda" : "month";
    setViewMode(newViewMode as "month" | "agenda");
  }, [viewMode, setViewMode]);

  // Handle DayDetail dismiss
  const handleDayDetailDismiss = useCallback(() => {
    setIsDayDetailVisible(false);
    setSelectedDate(null);
  }, [setSelectedDate]);

  // Setup keyboard shortcuts - cast viewMode to correct type
  useKeyboardShortcuts(
    selectedDate,
    setSelectedDate,
    viewMode === "day-detail" ? "month" : viewMode,
    handleDayDetailDismiss,
    handleToggleView
  );

  return (
    <div className="flex flex-col h-full relative">
      {/* View mode toggle */}
      <div className="flex-none px-4 pt-3 pb-2 bg-background border-b border-slate-200 dark:border-slate-800/50">
        <Tabs value={viewMode} onValueChange={handleViewModeChange}>
          <TabsList className="grid grid-cols-2 w-full max-w-xs mx-auto">
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Tabs value={viewMode} onValueChange={handleViewModeChange}>
        {/* Main content - render appropriate view based on viewMode */}
        <TabsContent value="month" className="flex-1 m-0 outline-none overflow-hidden">
          <CalendarView />
        </TabsContent>

        <TabsContent value="agenda" className="flex-1 m-0 outline-none overflow-hidden">
          <AgendaView />
        </TabsContent>
      </Tabs>

      {/* DayDetail overlay - appears when day is selected */}
      <DayDetail isVisible={isDayDetailVisible && selectedDate !== null} onDismiss={handleDayDetailDismiss} />
    </div>
  );
}
