import * as React from "react";
import { dealSchema, type Deal, type DealStatus } from "@/lib/zod/schemas";
import { useDealsStore } from "@/stores/dealsStore";
import { usePlacesStore } from "@/stores/placesStore";
import { useContactsStore } from "@/stores/contactsStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SaveIcon, XIcon } from "lucide-react";

interface DealEditProps {
  deal: Deal;
  onCancel: () => void;
  onSave: () => void;
}

const STATUS_OPTIONS: Array<{ value: DealStatus; label: string }> = [
  { value: "lead", label: "Lead" },
  { value: "contacted", label: "Contacted" },
  { value: "negotiation", label: "Negotiation" },
  { value: "confirmed", label: "Confirmed" },
  { value: "delivered", label: "Delivered" },
  { value: "paid", label: "Paid" },
  { value: "lost", label: "Lost" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY"] as const;

export function DealEdit({ deal, onCancel, onSave }: DealEditProps) {
  const updateDeal = useDealsStore((state) => state.updateDeal);
  const places = usePlacesStore((state) => state.places);
  const contacts = useContactsStore((state) => state.contacts);

  const [formData, setFormData] = React.useState({
    title: deal.title,
    status: deal.status,
    estimatedValue: deal.estimatedValue?.toString() || "",
    actualValue: deal.actualValue?.toString() || "",
    currency: deal.currency,
    startDate: deal.startDate ? new Date(deal.startDate).toISOString().split("T")[0] : "",
    endDate: deal.endDate ? new Date(deal.endDate).toISOString().split("T")[0] : "",
    notes: deal.notes || "",
    placeId: deal.placeId || "",
    contactId: deal.contactId || "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleStatusChange = (value: string) => {
    handleInputChange("status", value as DealStatus);
  };

  const validateForm = () => {
    try {
      const validationData = {
        ...deal,
        title: formData.title,
        status: formData.status,
        estimatedValue: formData.estimatedValue ? Number(formData.estimatedValue) : undefined,
        actualValue: formData.actualValue ? Number(formData.actualValue) : undefined,
        currency: formData.currency,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        notes: formData.notes || undefined,
        placeId: formData.placeId || undefined,
        contactId: formData.contactId || undefined,
      };
      dealSchema.parse(validationData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error && "issues" in error) {
        const zodError = error as { issues: Array<{ path: readonly (string | number)[]; message: string }> };
        const newErrors: Record<string, string> = {};
        zodError.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          newErrors[field] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    updateDeal(deal.id, {
      title: formData.title,
      status: formData.status,
      estimatedValue: formData.estimatedValue ? Number(formData.estimatedValue) : undefined,
      actualValue: formData.actualValue ? Number(formData.actualValue) : undefined,
      currency: formData.currency,
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      notes: formData.notes || undefined,
      placeId: formData.placeId || undefined,
      contactId: formData.contactId || undefined,
    });

    onSave();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Edit Deal</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <XIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Deal title"
          className={cn(errors.title && "border-destructive")}
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={formData.status} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Currency */}
      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
          <SelectTrigger id="currency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((currency) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Values */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estimatedValue">Estimated Value</Label>
          <Input
            id="estimatedValue"
            type="number"
            min="0"
            step="0.01"
            value={formData.estimatedValue}
            onChange={(e) => handleInputChange("estimatedValue", e.target.value)}
            placeholder="0.00"
            className={cn(errors.estimatedValue && "border-destructive")}
          />
          {errors.estimatedValue && <p className="text-xs text-destructive">{errors.estimatedValue}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="actualValue">Actual Value</Label>
          <Input
            id="actualValue"
            type="number"
            min="0"
            step="0.01"
            value={formData.actualValue}
            onChange={(e) => handleInputChange("actualValue", e.target.value)}
            placeholder="0.00"
            className={cn(errors.actualValue && "border-destructive")}
          />
          {errors.actualValue && <p className="text-xs text-destructive">{errors.actualValue}</p>}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            className={cn(errors.startDate && "border-destructive")}
          />
          {errors.startDate && <p className="text-xs text-destructive">{errors.startDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            className={cn(errors.endDate && "border-destructive")}
          />
          {errors.endDate && <p className="text-xs text-destructive">{errors.endDate}</p>}
        </div>
      </div>

      {/* Place */}
      <div className="space-y-2">
        <Label htmlFor="place">Place (Optional)</Label>
        <Select value={formData.placeId} onValueChange={(value) => handleInputChange("placeId", value)}>
          <SelectTrigger id="place">
            <SelectValue placeholder="Select a place" />
          </SelectTrigger>
          <SelectContent>
            {places.map((place) => (
              <SelectItem key={place.id} value={place.id}>
                {place.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contact */}
      <div className="space-y-2">
        <Label htmlFor="contact">Contact (Optional)</Label>
        <Select value={formData.contactId} onValueChange={(value) => handleInputChange("contactId", value)}>
          <SelectTrigger id="contact">
            <SelectValue placeholder="Select a contact" />
          </SelectTrigger>
          <SelectContent>
            {contacts.map((contact) => (
              <SelectItem key={contact.id} value={contact.id}>
                {contact.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          placeholder="Additional notes..."
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1">
          <SaveIcon className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
