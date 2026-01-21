import * as React from "react"
import { usePlacesStore } from "@/stores/placesStore"
import { placeSchema, type Place } from "@/lib/zod/schemas"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const PLACE_CATEGORIES = [
  { id: "restaurant", label: "Restaurant", icon: "restaurant" },
  { id: "cafe", label: "Cafe", icon: "local_cafe" },
  { id: "bar", label: "Bar", icon: "local_bar" },
  { id: "retail", label: "Retail", icon: "store" },
  { id: "hotel", label: "Hotel", icon: "hotel" },
  { id: "venue", label: "Venue", icon: "event" },
] as const

type PlaceCategory = (typeof PLACE_CATEGORIES)[number]["id"]

export function AddPlaceStep1({ onCancel, onSuccess }: { onCancel?: () => void; onSuccess?: (place: Place) => void }) {
  const createPlace = usePlacesStore((state) => state.createPlace)

  const [formData, setFormData] = React.useState({
    name: "",
    category: "restaurant" as PlaceCategory,
    address: "",
    city: "",
    phone: "",
    website: "",
  })

  const [errors, setErrors] = React.useState<Partial<Record<keyof typeof formData, string>>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Validate a single field
  const validateField = (field: keyof typeof formData, value: string) => {
    try {
      if (field === "name") {
        placeSchema.pick({ name: true }).parse({ [field]: value })
      } else if (field === "address") {
        placeSchema.pick({ address: true }).parse({ [field]: value })
      } else if (field === "city") {
        placeSchema.pick({ city: true }).parse({ [field]: value })
      } else if (field === "category") {
        placeSchema.pick({ category: true }).parse({ [field]: value })
      } else if (field === "phone") {
        placeSchema.pick({ phone: true }).parse({ [field]: value })
      } else if (field === "website") {
        placeSchema.pick({ website: true }).parse({ [field]: value })
      }
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
      return true
    } catch {
      // For now, just clear error on change, full validation happens on submit
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
      return true
    }
  }

  // Validate entire form
  const validateForm = () => {
    try {
      const dataToValidate = {
        ...formData,
        category: formData.category || "",
        phone: formData.phone || "",
        website: formData.website || "",
      }
      placeSchema.parse(dataToValidate)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof Error && "issues" in error) {
        const fieldErrors: Partial<Record<keyof typeof formData, string>> = {}
        const issues = (error as { issues: Array<{ path: string[]; message: string }> }).issues
        issues.forEach((issue) => {
          const field = issue.path[0] as keyof typeof formData
          fieldErrors[field] = issue.message
        })
        setErrors(fieldErrors)
      }
      return false
    }
  }

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const handleCategoryChange = (category: PlaceCategory) => {
    setFormData((prev) => ({ ...prev, category }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const result = createPlace({
        name: formData.name,
        address: formData.address,
        city: formData.city,
        category: formData.category,
        phone: formData.phone || undefined,
        website: formData.website || undefined,
      })

      if (result.success) {
        onSuccess?.(result.place)
      } else {
        setErrors({ name: result.error })
      }
    } catch {
      setErrors({ name: "Failed to create place" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.name && formData.address && formData.city && Object.keys(errors).length === 0

  return (
    <div className="flex h-screen flex-col bg-background dark:bg-background">
      {/* Header */}
      <header className="flex-none border-b border-border bg-surface px-4 py-3 flex items-center justify-center relative">
        <h1 className="text-lg font-bold tracking-tight">Add New Place</h1>
        {onCancel && (
          <button onClick={onCancel} className="absolute right-4 text-muted-foreground hover:text-foreground p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-4 pt-4">
          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Place Name</Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center">
                <span className="material-symbols-outlined text-[20px]">store</span>
              </div>
              <Input
                id="name"
                type="text"
                placeholder="e.g. The Blue Note Cafe"
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                aria-invalid={!!errors.name}
                className="h-12 rounded-xl pl-11"
              />
            </div>
            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
          </div>

          {/* Category Selection */}
          <div className="flex flex-col gap-3">
            <Label>Category</Label>
            <div className="flex flex-wrap gap-3">
              {PLACE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category.id)}
                  className={cn(
                    "flex items-center gap-2 h-10 px-4 rounded-full border transition-all",
                    "hover:bg-muted dark:hover:bg-muted/50",
                    formData.category === category.id
                      ? "bg-primary/10 border-primary/20 text-primary font-bold"
                      : "bg-surface border-border text-muted-foreground"
                  )}
                >
                  <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Address Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center">
                <span className="material-symbols-outlined text-[20px]">location_on</span>
              </div>
              <Input
                id="address"
                type="text"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={(e) => handleFieldChange("address", e.target.value)}
                aria-invalid={!!errors.address}
                className="h-12 rounded-xl pl-11"
              />
            </div>
            {errors.address && <p className="text-destructive text-sm">{errors.address}</p>}
          </div>

          {/* City Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="city">City</Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center">
                <span className="material-symbols-outlined text-[20px]">apartment</span>
              </div>
              <Input
                id="city"
                type="text"
                placeholder="New York"
                value={formData.city}
                onChange={(e) => handleFieldChange("city", e.target.value)}
                aria-invalid={!!errors.city}
                className="h-12 rounded-xl pl-11"
              />
            </div>
            {errors.city && <p className="text-destructive text-sm">{errors.city}</p>}
          </div>

          {/* Phone Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                aria-invalid={!!errors.phone}
                className="h-12 rounded-xl"
              />
            </div>
            {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
          </div>

          {/* Website Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => handleFieldChange("website", e.target.value)}
                aria-invalid={!!errors.website}
                className="h-12 rounded-xl"
              />
            </div>
            {errors.website && <p className="text-destructive text-sm">{errors.website}</p>}
          </div>
        </form>

        <div className="h-6" />
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-surface/80 backdrop-blur-md border-t border-border z-10">
        <div className="flex gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-14 rounded-xl"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={cn("h-14 rounded-xl", onCancel ? "flex-[2]" : "flex-1")}
          >
            {isSubmitting ? "Creating..." : "Continue"}
          </Button>
        </div>
      </footer>
    </div>
  )
}
