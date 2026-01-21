import { PlusIcon, MapPinIcon, UserIcon, BriefcaseIcon, BellIcon, CheckCircle2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { QuickReminder } from "@/components/reminders/QuickReminder";

export function FAB({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [quickReminderOpen, setQuickReminderOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { id: "place", label: "Add Place", icon: MapPinIcon, action: () => navigate({ to: "/places/new" }) },
    { id: "contact", label: "Add Contact", icon: UserIcon, action: () => navigate({ to: "/contacts/new" }) },
    { id: "deal", label: "New Deal", icon: BriefcaseIcon, action: () => navigate({ to: "/pipeline" }) },
    { id: "reminder", label: "Reminder", icon: BellIcon, action: () => { setIsOpen(false); setQuickReminderOpen(true); } },
    { id: "visit", label: "Check-in", icon: CheckCircle2Icon, action: () => navigate({ to: "/checkin/start" }) },
  ];

  return (
    <>
      <QuickReminder open={quickReminderOpen} onOpenChange={setQuickReminderOpen} />
      <div className={cn("fixed bottom-20 right-4 z-50", className)}>
        {isOpen && (
          <div className="mb-3 flex flex-col gap-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white shadow-lg hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
                >
                  <Icon className="h-4 w-4" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
          aria-label={isOpen ? "Close actions" : "Open actions"}
        >
          <PlusIcon className={cn("h-6 w-6 transition-transform", isOpen && "rotate-45")} />
        </button>
      </div>
    </>
  );
}
