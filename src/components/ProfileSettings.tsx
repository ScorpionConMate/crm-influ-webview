import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  User,
  Link2,
  Settings2,
  Bell,
  MessageCircle,
  Mail,
  Lock,
  LogOut,
  CheckCircle2,
  Edit,
} from "lucide-react";

interface ProfileSettingsProps {
  onBack?: () => void;
}

// Mock user data - in real app, this would come from a store or API
const mockUserData = {
  name: "Alex Rivera",
  plan: "Creator+",
  planType: "creator_plus" as const,
  placesUsed: 15,
  placesLimit: 20,
  avatar: null, // null would use fallback
};

// Mock notification settings
const useNotificationSettings = () => {
  return React.useState({
    push: true,
    whatsapp: true,
    email: true,
  });
};

export function ProfileSettings({ onBack }: ProfileSettingsProps) {
  const [notifications, setNotifications] = useNotificationSettings();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleNotificationChange = (key: keyof typeof notifications) => (checked: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: checked }));
  };

  const handleLogOut = () => {
    setIsLoggingOut(true);
    // In real app, this would handle logout logic
    setTimeout(() => {
      setIsLoggingOut(false);
      onBack?.();
    }, 1000);
  };

  const usagePercentage = (mockUserData.placesUsed / mockUserData.placesLimit) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-background dark:bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 flex-none border-b border-border bg-background/95 backdrop-blur px-4 py-3 flex items-center justify-center">
        <button
          onClick={onBack}
          className="absolute left-4 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight pr-10">
          Profile & Settings
        </h2>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-6 p-4">
          {/* Profile Section */}
          <section className="flex flex-col items-center gap-4 mt-2">
            <div className="relative group cursor-pointer">
              <Avatar className="size-28 border-4 border-border shadow-xl">
                {mockUserData.avatar ? (
                  <img src={mockUserData.avatar} alt={mockUserData.name} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                    {mockUserData.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <button className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground border-4 border-background shadow-lg hover:bg-primary/90 transition-colors">
                <Edit className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-2xl font-bold leading-tight">{mockUserData.name}</h1>
              <Badge className="bg-primary/20 border-primary/30 text-primary">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Creator+
              </Badge>
            </div>
          </section>

          {/* Plan/Usage Card */}
          <section>
            <Card className="relative overflow-hidden bg-card border-border shadow-lg">
              <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
              <div className="relative p-5 flex flex-col gap-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Current Plan
                    </p>
                    <h3 className="text-xl font-bold text-foreground">Creator+</h3>
                  </div>
                  <Button variant="default" size="sm">
                    Manage Plan
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-end justify-between text-sm">
                    <span className="font-medium text-muted-foreground">Places Used</span>
                    <span className="font-bold text-primary">
                      {mockUserData.placesUsed}
                      <span className="text-muted-foreground font-normal">
                        {" "}
                        / {mockUserData.placesLimit}
                      </span>
                    </span>
                  </div>
                  <Progress value={mockUserData.placesUsed} max={mockUserData.placesLimit} />
                  <p className="text-right text-xs text-muted-foreground mt-1">
                    {usagePercentage.toFixed(0)}% of limit used
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Settings Menu */}
          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-1">
              Settings
            </h3>
            <div className="flex flex-col gap-px overflow-hidden rounded-xl border border-border">
              <button className="flex items-center gap-4 bg-card p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-center size-10 rounded-lg bg-muted text-muted-foreground">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1 flex flex-col text-left">
                  <span className="text-base font-medium text-foreground">
                    Account Information
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Email, Password, Phone
                  </span>
                </div>
              </button>

              <button className="flex items-center gap-4 bg-card p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-center size-10 rounded-lg bg-muted text-muted-foreground">
                  <Link2 className="h-5 w-5" />
                </div>
                <div className="flex-1 flex flex-col text-left">
                  <span className="text-base font-medium text-foreground">
                    Integrations
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="size-4 rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <span className="text-[10px] font-bold text-slate-800">G</span>
                    </div>
                    <div className="size-4 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center">
                      <span className="text-[10px] text-white">📷</span>
                    </div>
                    <span className="text-xs font-semibold text-primary">Connected</span>
                  </div>
                </div>
              </button>

              <button className="flex items-center gap-4 bg-card p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-center size-10 rounded-lg bg-muted text-muted-foreground">
                  <Settings2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="text-base font-medium text-foreground">
                    Custom Fields
                  </span>
                </div>
              </button>

              <button className="flex items-center gap-4 bg-card p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-center size-10 rounded-lg bg-muted text-muted-foreground">
                  <Settings2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="text-base font-medium text-foreground">
                    App Preferences
                  </span>
                </div>
              </button>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-1">
              Notifications
            </h3>
            <div className="flex flex-col gap-px overflow-hidden rounded-xl border border-border">
              <div className="flex items-center gap-4 bg-card p-4">
                <div className="flex items-center justify-center size-10 rounded-lg bg-muted text-muted-foreground">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-medium text-foreground">
                      Push Notifications
                    </span>
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    Always active for critical updates
                  </span>
                </div>
                <Switch
                  checked={notifications.push}
                  disabled
                  className="opacity-50"
                />
              </div>

              <div className="flex items-center gap-4 bg-card p-4">
                <div className="flex items-center justify-center size-10 rounded-lg bg-muted text-muted-foreground">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="text-base font-medium text-foreground">
                    WhatsApp Notifications
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    Deal reminders and status updates
                  </span>
                </div>
                <Switch
                  checked={notifications.whatsapp}
                  onCheckedChange={handleNotificationChange("whatsapp")}
                />
              </div>

              <div className="flex items-center gap-4 bg-card p-4">
                <div className="flex items-center justify-center size-10 rounded-lg bg-muted text-muted-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="text-base font-medium text-foreground">
                    Email Notifications
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    Weekly reports and activity summaries
                  </span>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={handleNotificationChange("email")}
                />
              </div>
            </div>
          </section>

          {/* Log Out Section */}
          <div className="flex flex-col items-center gap-4 mt-4">
            <Button
              variant="outline"
              onClick={handleLogOut}
              disabled={isLoggingOut}
              className="w-full h-12 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/20 hover:border-red-500/50"
            >
              <LogOut className="h-5 w-5 mr-2" />
              {isLoggingOut ? "Logging Out..." : "Log Out"}
            </Button>
            <p className="text-xs font-medium text-muted-foreground">
              App Version 2.1.0
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
