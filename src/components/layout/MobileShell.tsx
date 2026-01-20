import { HomeIcon, KanbanIcon, MapPinIcon, CalendarIcon, MoreVerticalIcon } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function TopBar() {
  const { pathname } = useLocation();

  const titles: Record<string, string> = {
    "/": "Dashboard",
    "/places": "Places",
    "/contacts": "Contacts",
    "/pipeline": "Pipeline",
    "/calendar": "Calendar",
    "/more": "More",
  };

  const title = titles[pathname] || "CRM";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex h-16 items-center justify-between px-4">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          {title}
        </h1>
      </div>
    </header>
  );
}

export function BottomTabs() {
  const { pathname } = useLocation();

  const tabs = [
    { id: "home", label: "Home", icon: HomeIcon, path: "/" },
    { id: "pipeline", label: "Pipeline", icon: KanbanIcon, path: "/pipeline" },
    { id: "places", label: "Places", icon: MapPinIcon, path: "/places" },
    { id: "calendar", label: "Calendar", icon: CalendarIcon, path: "/calendar" },
    { id: "more", label: "More", icon: MoreVerticalIcon, path: "/more" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-[430px] items-center justify-around px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <a
              key={tab.id}
              href={tab.path}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors",
                isActive(tab.path)
                  ? "text-slate-900 dark:text-slate-50"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{tab.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
