import * as React from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContactsStore } from "@/stores/contactsStore";
import { usePlacesStore } from "@/stores/placesStore";
import { cn } from "@/lib/utils";

// Role options matching the design
const CONTACT_ROLES = [
  { id: "manager", label: "Manager" },
  { id: "owner", label: "Owner" },
  { id: "pr", label: "PR" },
  { id: "other", label: "Other" },
] as const;

type ContactRole = (typeof CONTACT_ROLES)[number]["id"];

// Form schema for creating a new contact
const createContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  notes: z.string().optional(),
  placeId: z.string().uuid().optional(),
});

type CreateContactFormData = z.infer<typeof createContactSchema>;

interface AddContactProps {
  placeId?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function AddContact({ placeId, onCancel, onSuccess }: AddContactProps) {
  const createContact = useContactsStore((state) => state.createContact);
  const addPlaceLink = useContactsStore((state) => state.addPlaceLink);
  const places = usePlacesStore((state) => state.places);

  const [formData, setFormData] = React.useState<CreateContactFormData>({
    name: "",
    role: "",
    email: "",
    phone: "",
    notes: "",
    placeId: placeId || "",
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof CreateContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Real-time validation for individual field
  const validateField = (field: keyof CreateContactFormData, value: string) => {
    const result = createContactSchema.safeParse({ ...formData, [field]: value });
    if (!result.success) {
      const fieldError = result.error.issues.find((err: z.ZodIssue) => err.path[0] === field);
      return fieldError?.message || "";
    }
    return "";
  };

  const handleFieldChange = (field: keyof CreateContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleRoleChange = (role: ContactRole) => {
    setFormData((prev) => ({ ...prev, role }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.role;
      return newErrors;
    });
  };

  const handlePlaceChange = (placeIdValue: string) => {
    setFormData((prev) => ({ ...prev, placeId: placeIdValue || undefined }));
  };

  // Check if form is valid (React Compiler handles optimization)
  const isFormValid = createContactSchema.safeParse(formData).success;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate entire form
      const result = createContactSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: Partial<Record<keyof CreateContactFormData, string>> = {};
        result.error.issues.forEach((err: z.ZodIssue) => {
          const field = err.path[0] as keyof CreateContactFormData;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      const { placeId: linkedPlaceId, ...contactData } = formData;

      // Create the contact
      const createResult = createContact({
        name: contactData.name,
        role: contactData.role || undefined,
        email: contactData.email || undefined,
        phone: contactData.phone || undefined,
        notes: contactData.notes || undefined,
      });

      if (!createResult.success) {
        setErrors({ name: createResult.error });
        return;
      }

      // Link to place if placeId was provided
      if (linkedPlaceId) {
        addPlaceLink({
          placeId: linkedPlaceId,
          contactId: createResult.contact.id,
          role: formData.role || undefined,
          createdAt: new Date(),
        });
      }

      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background dark:bg-background">
      {/* Header */}
      <header className="flex-none border-b border-border bg-surface/95 backdrop-blur px-4 py-3 flex items-center justify-center relative">
        <h1 className="text-lg font-bold tracking-tight">Add Contact</h1>
        <div className="w-12" /> {/* Spacer for center alignment */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute right-4 text-muted-foreground hover:text-foreground font-medium"
          >
            Cancel
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-4 pt-4">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="relative group cursor-pointer">
              <div className="flex items-center justify-center aspect-square h-28 w-28 rounded-full bg-muted border-2 border-dashed border-border hover:border-primary transition-colors overflow-hidden">
                <span className="material-symbols-outlined text-4xl text-muted-foreground">add_a_photo</span>
              </div>
              {/* Small edit icon badge */}
              <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 border-2 border-background flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-background text-xs font-bold">edit</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-primary font-semibold text-sm">Upload Photo</p>
            </div>
          </div>

          {/* Association Section */}
          {!placeId && (
            <section className="flex flex-col gap-3">
              <h3 className="text-sm font-bold uppercase tracking-wider pl-1 text-foreground">Association</h3>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="place">Link to Place</Label>
                <Select value={formData.placeId || ""} onValueChange={handlePlaceChange}>
                  <SelectTrigger id="place" className="w-full">
                    <SelectValue placeholder="Select a Place (e.g. The Ivy)" />
                  </SelectTrigger>
                  <SelectContent>
                    {places.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No places available
                      </div>
                    ) : (
                      places.map((place) => (
                        <SelectItem key={place.id} value={place.id}>
                          {place.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </section>
          )}

          {/* Details Section */}
          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider pl-1 text-foreground">Contact Details</h3>

            {/* Name Input */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                aria-invalid={!!errors.name}
                className={cn(errors.name && "border-destructive")}
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
            </div>

            {/* Role Selector */}
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <div className="flex flex-wrap gap-2">
                {CONTACT_ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleChange(role.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                      "hover:brightness-105",
                      formData.role === role.id
                        ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20"
                        : "bg-muted text-muted-foreground border-transparent hover:border-primary/30"
                    )}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Input */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+44 7700 900000"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  className="pl-10"
                  aria-invalid={!!errors.phone}
                />
              </div>
              {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="sarah@example.com"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className="pl-10"
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
            </div>
          </section>

          {/* Notes Section */}
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-bold uppercase tracking-wider pl-1 text-foreground">Notes</h3>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Personal Notes</Label>
              <Textarea
                id="notes"
                placeholder="Met at launch party, loves spicy food..."
                value={formData.notes}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
                rows={4}
              />
            </div>
          </section>
        </form>

        <div className="h-6" />
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-surface/80 backdrop-blur border-t border-border z-10">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className="w-full h-14 rounded-xl font-bold text-lg shadow-lg"
          size="lg"
        >
          {isSubmitting ? "Saving..." : "Save Contact"}
        </Button>
      </footer>
    </div>
  );
}
