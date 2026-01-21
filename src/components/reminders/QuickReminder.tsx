"use client"

import * as React from "react"
import { useRemindersStore } from "@/stores/remindersStore"
import { usePlacesStore } from "@/stores/placesStore"
import { useContactsStore } from "@/stores/contactsStore"
import { useDealsStore } from "@/stores/dealsStore"
import { reminderSchema, type Reminder } from "@/lib/zod/schemas"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { EntitySelector } from "./EntitySelector"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface QuickReminderProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prefillDate?: Date
  prefillPlaceId?: string
  prefillContactId?: string
  prefillDealId?: string
}

export function QuickReminder({
  open,
  onOpenChange,
  prefillDate,
  prefillPlaceId,
  prefillContactId,
  prefillDealId,
}: QuickReminderProps) {
  const addReminder = useRemindersStore((state) => state.addReminder)
  const places = usePlacesStore((state) => state.places)
  const contacts = useContactsStore((state) => state.contacts)
  const deals = useDealsStore((state) => state.deals)

  const [title, setTitle] = React.useState("")
  const [dueDate, setDueDate] = React.useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return (prefillDate || tomorrow).toISOString().slice(0, 16)
  })
  const [priority, setPriority] = React.useState<"low" | "medium" | "high">("medium")
  const [notes, setNotes] = React.useState("")
  const [selectedPlaceId, setSelectedPlaceId] = React.useState(prefillPlaceId)
  const [selectedContactId, setSelectedContactId] = React.useState(prefillContactId)
  const [selectedDealId, setSelectedDealId] = React.useState(prefillDealId)

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setTitle("")
      setPriority("medium")
      setNotes("")
      setSelectedPlaceId(undefined)
      setSelectedContactId(undefined)
      setSelectedDealId(undefined)
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    const reminder: Reminder = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: notes.trim() || undefined,
      dueDate: new Date(dueDate),
      completed: false,
      priority,
      placeId: selectedPlaceId,
      contactId: selectedContactId,
      dealId: selectedDealId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    try {
      reminderSchema.parse(reminder)
      addReminder(reminder)
      onOpenChange(false)
    } catch (error) {
      console.error("Invalid reminder data:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Reminder</DialogTitle>
          <DialogDescription>
            Create a quick reminder to stay organized.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <Field>
            <FieldLabel htmlFor="reminder-title">Title *</FieldLabel>
            <Input
              id="reminder-title"
              type="text"
              placeholder="Reminder title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Field>

          {/* Due Date */}
          <Field>
            <FieldLabel htmlFor="reminder-date">Due Date</FieldLabel>
            <Input
              id="reminder-date"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Field>

          {/* Priority */}
          <Field>
            <FieldLabel htmlFor="reminder-priority">Priority</FieldLabel>
            <Select value={priority} onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}>
              <SelectTrigger id="reminder-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {/* Entity Selector */}
          <EntitySelector
            places={places}
            contacts={contacts}
            deals={deals}
            selectedPlaceId={selectedPlaceId}
            selectedContactId={selectedContactId}
            selectedDealId={selectedDealId}
            onSelectPlace={setSelectedPlaceId}
            onSelectContact={setSelectedContactId}
            onSelectDeal={setSelectedDealId}
          />

          {/* Notes */}
          <Field>
            <FieldLabel htmlFor="reminder-notes">Notes</FieldLabel>
            <Textarea
              id="reminder-notes"
              placeholder="Additional notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Create Reminder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
