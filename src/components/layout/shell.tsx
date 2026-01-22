import { TopBar, BottomTabs } from "./MobileShell";
import { FAB } from "./FAB";

interface MobileShellProps {
  children: React.ReactNode;
  showFAB?: boolean;
  showTopBar?: boolean;
}

export function MobileShell({ children, showFAB = true, showTopBar = true }: MobileShellProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <div className="relative flex h-full w-full flex-col bg-background">
        {showTopBar && <TopBar />}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <BottomTabs />
        {showFAB &&  <FAB />}
      </div>
    </div>
  );
}
