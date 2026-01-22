import { PlusIcon, MapPinIcon, UserIcon, BriefcaseIcon, BellIcon, CheckCircle2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { QuickReminder } from "@/components/reminders/QuickReminder";
import { seedAllStores } from "@/lib/mock";

export function FAB({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [quickReminderOpen, setQuickReminderOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { id: "place", label: "Add Place", icon: MapPinIcon, action: () => navigate({ to: "/places/new" }) },
    { id: "contact", label: "Add Contact", icon: UserIcon, action: () => navigate({ to: "/contacts/new" }) },
    { id: "deal", label: "New Deal", icon: BriefcaseIcon, action: () => navigate({ to: "/deals/new" }) },
    { id: "reminder", label: "Reminder", icon: BellIcon, action: () => { setIsOpen(false); setQuickReminderOpen(true); } },
    { id: "visit", label: "Check-in", icon: CheckCircle2Icon, action: () => navigate({ to: "/checkin/start" }) },
    { id: 'mock', label: 'Add Mock Data', icon: UserIcon, action: () => {seedAllStores(); alert('✅ Mock data added!'); } },
  ];

  return (
    <>
      <QuickReminder open={quickReminderOpen} onOpenChange={setQuickReminderOpen} />
      <div className={cn("fixed bottom-24 right-4 z-50", className)}>
        {isOpen && (
          <div className="mb-3 flex flex-col gap-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="flex items-center gap-2 rounded-xl bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-lg border border-border hover:bg-accent active:scale-95 transition-all dark:bg-card dark:border-border"
                >
                  <Icon className="h-5 w-5" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-transform"
          aria-label={isOpen ? "Close actions" : "Open actions"}
        >
          <PlusIcon className={cn("h-8 w-8 font-bold transition-transform", isOpen && "rotate-45")} />
        </button>
      </div>
    </>
  );
}
