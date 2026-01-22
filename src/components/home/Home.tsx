import { formatToCurrency } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useDealsStore } from "@/stores/dealsStore";
import { useRemindersStore } from "@/stores/remindersStore";
import { format, isToday, addHours } from "date-fns";
import { CalendarIcon, CheckCircle2Icon, BriefcaseIcon, MapPinIcon, BellIcon, CheckCircle } from "lucide-react";
import { useMemo } from "react";

export function Home() {
  const { user } = useAuthStore();
  const { deals } = useDealsStore();
  const { reminders, markAsCompleted } = useRemindersStore();

  const currentDate = useMemo(() => new Date(), []);

  const confirmedDeals = useMemo(() => deals.filter((d) => d.status === "confirmed" || d.status === "paid"), [deals]);
  const prospectDeals = useMemo(() => deals.filter((d) => d.status === "lead" || d.status === "contacted"), [deals]);
  const negotiatingDeals = useMemo(() => deals.filter((d) => d.status === "negotiation"), [deals]);

  const totalConfirmedValue = formatToCurrency(confirmedDeals.reduce((sum, d) => sum + (d.actualValue || d.estimatedValue || 0), 0));
  const totalProspectValue = formatToCurrency(prospectDeals.reduce((sum, d) => sum + (d.estimatedValue || 0), 0));

  const upcomingReminders = useMemo(
    () =>
      reminders
        .filter((r) => !r.completed)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5),
    [reminders]
  );

  const greeting = currentDate.getHours() < 12 ? "Good morning" : currentDate.getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 px-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {greeting}, {user?.name || "User"}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {format(currentDate, "EEEE, MMM d")}
        </p>
      </div>

      <section>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
          <div className="min-w-[160px] flex-1 flex-col gap-3 rounded-xl bg-gradient-to-br from-primary to-[#0ea5c6] p-5 text-white shadow-lg shadow-primary/20">
            <div className="flex items-center justify-between text-white/90">
              <span className="text-sm font-medium">Confirmed</span>
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-white text-3xl font-bold leading-tight tracking-tight">
                ${totalConfirmedValue}
              </p>
              <p className="text-white/80 text-xs mt-1">+15% from last month</p>
            </div>
          </div>

          <div className="min-w-[160px] flex-1 flex-col gap-3 rounded-xl bg-card border border-slate-100 dark:border-slate-700/50 p-5 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium">Prospect</span>
              <BriefcaseIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-foreground text-3xl font-bold leading-tight tracking-tight">
                {prospectDeals.length} Deals
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                ~ ${totalProspectValue} potential
              </p>
            </div>
          </div>

          <div className="min-w-[160px] flex-1 flex-col gap-3 rounded-xl bg-card border border-slate-100 dark:border-slate-700/50 p-5 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium">Negotiating</span>
              <CheckCircle2Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-foreground text-3xl font-bold leading-tight tracking-tight">
                {negotiatingDeals.length} Deals
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Awaiting response
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-3 group cursor-pointer">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-card border border-slate-100 dark:border-slate-700/50 shadow-sm group-active:scale-95 transition-all group-hover:border-primary/50 group-hover:shadow-md group-hover:shadow-primary/10">
              <CalendarIcon className="h-8 w-8 text-primary" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Check-In
            </span>
          </button>

          <button className="flex flex-col items-center gap-3 group cursor-pointer">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-card border border-slate-100 dark:border-slate-700/50 shadow-sm group-active:scale-95 transition-all group-hover:border-primary/50 group-hover:shadow-md group-hover:shadow-primary/10">
              <BriefcaseIcon className="h-8 w-8 text-primary" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              New Deal
            </span>
          </button>

          <button className="flex flex-col items-center gap-3 group cursor-pointer">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-card border border-slate-100 dark:border-slate-700/50 shadow-sm group-active:scale-95 transition-all group-hover:border-primary/50 group-hover:shadow-md group-hover:shadow-primary/10">
              <MapPinIcon className="h-8 w-8 text-primary" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Add Place
            </span>
          </button>

          <button className="flex flex-col items-center gap-3 group cursor-pointer">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-card border border-slate-100 dark:border-slate-700/50 shadow-sm group-active:scale-95 transition-all group-hover:border-primary/50 group-hover:shadow-md group-hover:shadow-primary/10">
              <BellIcon className="h-8 w-8 text-primary" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Reminder
            </span>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold">
            Today's Priorities
          </h3>
          <button className="text-primary text-sm font-medium cursor-pointer">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {upcomingReminders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                No reminders for today
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            upcomingReminders.map((reminder) => {
              const isUrgent = reminder.dueDate <= addHours(currentDate, 2);
              const isSameDay = isToday(reminder.dueDate);

              return (
                <div
                  key={reminder.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card border border-slate-100 dark:border-slate-700/50 shadow-sm hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => {
                    markAsCompleted(reminder.id);
                  }}
                >
                  <div className="mt-1 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={reminder.completed}
                      onChange={() => markAsCompleted(reminder.id)}
                      className="h-5 w-5 rounded border-2 border-slate-300 dark:border-slate-600 bg-transparent text-primary focus:ring-offset-background focus:ring-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white hover:text-primary transition-colors">
                        {reminder.title}
                      </h4>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${isUrgent
                            ? "text-amber-500 bg-amber-500/10"
                            : "text-muted-foreground"
                          }`}
                      >
                        {isSameDay
                          ? format(reminder.dueDate, "h:mm a")
                          : format(reminder.dueDate, "MMM d")}
                      </span>
                    </div>
                    {reminder.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {reminder.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
