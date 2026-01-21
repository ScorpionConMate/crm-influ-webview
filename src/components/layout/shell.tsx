import { TopBar, BottomTabs } from "./MobileShell";
import { FAB } from "./FAB";

interface MobileShellProps {
  children: React.ReactNode;
  showFAB?: boolean;
  hideTabs?: boolean;
  showTopBar?: boolean;
}

export function MobileShell({ children, showFAB = true, hideTabs = false, showTopBar = true }: MobileShellProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="relative mx-auto flex h-full w-full max-w-107.5 min-w-90 flex-col bg-white dark:bg-slate-900">
        {showTopBar && <TopBar />}
        <main className="flex-1 overflow-y-auto pt-4">
          {children}
        </main>
        {!hideTabs && <BottomTabs />}
        {showFAB && !hideTabs && <FAB />}
      </div>
    </div>
  );
}
