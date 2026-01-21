"use client"

import { type Place, type Contact, type Deal } from "@/lib/zod/schemas"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"

interface EntitySelectorProps {
  places: Place[]
  contacts: Contact[]
  deals: Deal[]
  selectedPlaceId?: string
  selectedContactId?: string
  selectedDealId?: string
  onSelectPlace: (id: string | undefined) => void
  onSelectContact: (id: string | undefined) => void
  onSelectDeal: (id: string | undefined) => void
}

export function EntitySelector({
  places,
  contacts,
  deals,
  selectedPlaceId,
  selectedContactId,
  selectedDealId,
  onSelectPlace,
  onSelectContact,
  onSelectDeal,
}: EntitySelectorProps) {
  return (
    <div className="space-y-3">
      {/* Place Selector */}
      <Field>
        <FieldLabel htmlFor="place-select">Place (Optional)</FieldLabel>
        <Select
          value={selectedPlaceId || "none"}
          onValueChange={(value) => onSelectPlace(value === "none" ? undefined : value)}
        >
          <SelectTrigger id="place-select">
            <SelectValue placeholder="Select a place" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No place selected</SelectItem>
            {places.map((place) => (
              <SelectItem key={place.id} value={place.id}>
                {place.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {/* Contact Selector */}
      <Field>
        <FieldLabel htmlFor="contact-select">Contact (Optional)</FieldLabel>
        <Select
          value={selectedContactId || "none"}
          onValueChange={(value) => onSelectContact(value === "none" ? undefined : value)}
        >
          <SelectTrigger id="contact-select">
            <SelectValue placeholder="Select a contact" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No contact selected</SelectItem>
            {contacts.map((contact) => (
              <SelectItem key={contact.id} value={contact.id}>
                {contact.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {/* Deal Selector */}
      <Field>
        <FieldLabel htmlFor="deal-select">Deal (Optional)</FieldLabel>
        <Select
          value={selectedDealId || "none"}
          onValueChange={(value) => onSelectDeal(value === "none" ? undefined : value)}
        >
          <SelectTrigger id="deal-select">
            <SelectValue placeholder="Select a deal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No deal selected</SelectItem>
            {deals.map((deal) => (
              <SelectItem key={deal.id} value={deal.id}>
                {deal.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  )
}
