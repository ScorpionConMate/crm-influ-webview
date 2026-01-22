import { HomeIcon, KanbanIcon, MapPinIcon, CalendarIcon, User } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function TopBar() {
  const { pathname } = useLocation();

  const titles: Record<string, string> = {
    "/": "Dashboard",
    "/places": "Directory",
    "/contacts": "Contacts",
    "/pipeline": "Pipeline",
    "/calendar": "Calendar",
    "/profile": "Profile & Settings",
  };

  const title = titles[pathname] || "CRM";

  return (
    <header className="z-50 w-full border-b border-slate-200 dark:border-slate-700/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 pt-safe-top">
      <div className="flex h-16 items-center justify-between px-4">
        <h1 className="text-[28px] font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
      </div>
    </header>
  );
}

export function BottomTabs() {
  const { pathname } = useLocation();

  const tabs = [
    { id: "pipeline", label: "Pipeline", icon: KanbanIcon, path: "/pipeline" },
    { id: "places", label: "Directory", icon: MapPinIcon, path: "/places" },
    { id: "home", label: "Home", icon: HomeIcon, path: "/" },
    { id: "calendar", label: "Calendar", icon: CalendarIcon, path: "/calendar" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="z-50 border-t border-slate-200 dark:border-slate-800 bg-white/95 backdrop-blur-lg supports-backdrop-filter:bg-white/60 dark:bg-[#101f22]/95">
      <div className="flex h-20 items-center justify-around px-4 pb-safe-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isHome = tab.id === "home";

          if (isHome) {
            // FAB-style home button - centered above nav
            return (
              <div key={tab.id} className="relative -top-6">
                <button
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full border-4 bg-primary text-white shadow-lg ring-4 transition-transform active:scale-95",
                    isActive(tab.path)
                      ? "ring-background hover:scale-105"
                      : "hover:scale-105",
                    "border-background ring-background/50 dark:ring-background/20"
                  )}
                >
                  <Icon className="h-8 w-8" />
                </button>
              </div>
            );
          }

          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md px-3 py-2 transition-colors",
                isActive(tab.path)
                  ? "text-primary"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              )}
            >
              <Icon className="h-[26px] w-[26px]" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
