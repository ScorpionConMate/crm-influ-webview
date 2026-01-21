import * as React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { usePlacesStore } from "@/stores/placesStore";

// Form schema for Step 2 - includes additional fields not in base placeSchema
const placeStep2Schema = z.object({
  description: z.string().optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
  hours: z.string().optional(),
});

type PlaceStep2FormData = z.infer<typeof placeStep2Schema>;

interface AddPlaceStep2Props {
  placeId: string;
  onComplete?: () => void;
}

export function AddPlaceStep2({ placeId, onComplete }: AddPlaceStep2Props) {
  const updatePlace = usePlacesStore((state) => state.updatePlace);
  
  const [formData, setFormData] = React.useState<PlaceStep2FormData>({
    description: "",
    tags: "",
    notes: "",
    hours: "",
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof PlaceStep2FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Real-time validation
  const validateField = (field: keyof PlaceStep2FormData, value: string) => {
    const result = placeStep2Schema.safeParse({ ...formData, [field]: value });
    if (!result.success) {
      const fieldError = result.error.issues.find((err: z.ZodIssue) => err.path[0] === field);
      return fieldError?.message || "";
    }
    return "";
  };

  const handleFieldChange = (field: keyof PlaceStep2FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Check if form is valid (React Compiler handles optimization)
  const isFormValid = placeStep2Schema.safeParse(formData).success;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate entire form
      const result = placeStep2Schema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: Partial<Record<keyof PlaceStep2FormData, string>> = {};
        result.error.issues.forEach((err: z.ZodIssue) => {
          const field = err.path[0] as keyof PlaceStep2FormData;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      // Combine tags, hours, description, and notes into a structured notes field
      const notesParts: string[] = [];
      if (formData.description) notesParts.push(`Description: ${formData.description}`);
      if (formData.tags) notesParts.push(`Tags: ${formData.tags}`);
      if (formData.hours) notesParts.push(`Hours: ${formData.hours}`);
      if (formData.notes) notesParts.push(`Notes: ${formData.notes}`);

      const combinedNotes = notesParts.length > 0 ? notesParts.join("\n\n") : undefined;

      // Update place with additional details
      const updateResult = updatePlace(placeId, {
        notes: combinedNotes,
      });

      if (updateResult.success) {
        onComplete?.();
      } else {
        setErrors({ notes: updateResult.error });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Add Place Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the place (e.g., 'Cozy café with outdoor seating')"
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className={cn(errors.description && "border-destructive")}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Tags Field */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              type="text"
              placeholder="e.g., wifi, outdoor, pet-friendly"
              value={formData.tags}
              onChange={(e) => handleFieldChange("tags", e.target.value)}
              className={cn(errors.tags && "border-destructive")}
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple tags with commas
            </p>
            {errors.tags && (
              <p className="text-sm text-destructive">{errors.tags}</p>
            )}
          </div>

          {/* Hours of Operation Field */}
          <div className="space-y-2">
            <Label htmlFor="hours">Hours of Operation</Label>
            <Textarea
              id="hours"
              placeholder="e.g., Mon-Fri: 9am-6pm, Sat-Sun: 10am-4pm"
              value={formData.hours}
              onChange={(e) => handleFieldChange("hours", e.target.value)}
              className={cn(errors.hours && "border-destructive")}
              rows={2}
            />
            {errors.hours && (
              <p className="text-sm text-destructive">{errors.hours}</p>
            )}
          </div>

          {/* Notes Field */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information about this place..."
              value={formData.notes}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              className={cn(errors.notes && "border-destructive")}
              rows={4}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid || isSubmitting}
            variant="default"
            size="lg"
          >
            {isSubmitting ? "Saving..." : "Save Details"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
