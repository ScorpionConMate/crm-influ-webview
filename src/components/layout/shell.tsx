import { TopBar, BottomTabs } from "./MobileShell";
import { FAB } from "./FAB";

interface MobileShellProps {
  children: React.ReactNode;
  showFAB?: boolean;
}

export function MobileShell({ children, showFAB = true }: MobileShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-[430px] min-w-[360px] flex-1 bg-white dark:bg-slate-900">
        <TopBar />
        <main className="pb-20 pt-4">
          {children}
        </main>
        <BottomTabs />
        {showFAB && <FAB />}
      </div>
    </div>
  );
}
