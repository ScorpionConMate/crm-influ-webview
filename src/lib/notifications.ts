import { useState, useEffect } from "react";
import { Bell, Mail } from "lucide-react";

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    return Promise.resolve("default");
  }

  const currentPermission = Notification.permission;

  if (currentPermission === "granted") {
    return Promise.resolve("granted");
  }

  return Notification.requestPermission();
}

export function showLocalNotification(title: string, body: string): void {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const notification = new Notification(title, {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
  });

  setTimeout(() => {
    notification.close();
  }, 5000);
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
      setIsEnabled(Notification.permission === "granted");
    }
  }, []);

  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    setIsEnabled(result === "granted");
  };

  return {
    permission,
    isEnabled,
    requestPermission: handleRequestPermission,
    showNotification: (title: string, body: string) => showLocalNotification(title, body),
  };
}
