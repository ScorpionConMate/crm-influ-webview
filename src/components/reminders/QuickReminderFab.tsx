"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

interface QuickReminderFabProps {
  onClick: () => void
}

export function QuickReminderFab({ onClick }: QuickReminderFabProps) {
  return (
    <Button
      onClick={onClick}
      variant="default"
      size="icon-lg"
      className="fixed bottom-4 right-4 z-40 shadow-lg"
    >
      <PlusIcon className="h-6 w-6" />
    </Button>
  )
}
