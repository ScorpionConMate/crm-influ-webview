import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [view, setView] = useState<"calendar" | "agenda">("calendar");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex gap-1">
            <button
              onClick={goToPreviousMonth}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={goToNextMonth}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <button
          onClick={goToToday}
          className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Today
        </button>
      </div>

      {view === "calendar" ? (
        <>
          <div className="px-4 py-3 grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-slate-400 dark:text-slate-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="px-4 grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
              const isDayToday = isToday(day);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  disabled={!isCurrentMonth}
                  className={cn(
                    "aspect-square flex items-center justify-center text-sm font-medium rounded-lg transition-all",
                    isCurrentMonth
                      ? "text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                      : "text-slate-300 dark:text-slate-700",
                    isSelected && "bg-cyan-500 text-white hover:bg-cyan-600",
                    isDayToday && !isSelected && "font-bold"
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="text-center py-20">
            <ClockIcon className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No events scheduled
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select a date to view your agenda
            </p>
          </div>
        </div>
      )}

      {selectedDate && (
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Selected Date
              </p>
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            <button
              onClick={() => setView(view === "calendar" ? "agenda" : "calendar")}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <CalendarIcon className="h-4 w-4" />
              {view === "calendar" ? "View Agenda" : "View Calendar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
