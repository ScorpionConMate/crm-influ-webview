import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { X, ChevronRight, ArrowRight, Building2, Calendar, FileText, Package, Plus, Edit2, Video, Trash2, ChevronDown, Upload, Info, CheckCircle } from "lucide-react";
import { useDealsStore } from "@/stores/dealsStore";
import { usePlacesStore } from "@/stores/placesStore";
import { useContactsStore } from "@/stores/contactsStore";
import { type Deal, type Deliverable } from "@/lib/zod/schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4;

const DELIVERABLE_TYPES = [
  { value: "post", label: "Instagram Post" },
  { value: "story", label: "Instagram Story" },
  { value: "reel", label: "Instagram Reel" },
  { value: "video", label: "TikTok Video" },
  { value: "other", label: "YouTube Integration" },
] as const;

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD"] as const;
const PAYMENT_SCHEDULES = ["upfront", "net30", "net60", "custom"] as const;

export function DealCreate() {
  const navigate = useNavigate();
  const addDeal = useDealsStore((state) => state.addDeal);
  const places = usePlacesStore((state) => state.places);
  const contacts = useContactsStore((state) => state.contacts);

  const [currentStep, setCurrentStep] = React.useState<Step>(1);

  // Step 1: General Info
  const [title, setTitle] = React.useState("");
  const [placeId, setPlaceId] = React.useState("");
  const [contactId, setContactId] = React.useState("");
  const [objective, setObjective] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  // Step 2: Deliverables
  const [deliverables, setDeliverables] = React.useState<Omit<Deliverable, "id" | "createdAt" | "dealId">[]>([
    {
      type: "post",
      quantity: 1,
      description: "",
      dueDate: undefined,
      completedDate: undefined,
    },
  ]);

  // Step 3: Payments & Legal
  const [currency, setCurrency] = React.useState<Deal["currency"]>("USD");
  const [amount, setAmount] = React.useState("");
  const [paymentSchedule, setPaymentSchedule] = React.useState<string>("upfront");
  const [attachments, setAttachments] = React.useState<File[]>([]);

  // Validation state
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleNextStep = () => {
    if (!validateCurrentStep()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 4) as Step);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const handleCreateDeal = () => {
    if (!validateCurrentStep()) return;

    const newDeal: Deal = {
      id: crypto.randomUUID(),
      title,
      status: "lead",
      placeId: placeId || undefined,
      contactId: contactId || undefined,
      estimatedValue: amount ? parseFloat(amount) : undefined,
      actualValue: undefined,
      currency,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      notes: objective || undefined,
      deliverables: deliverables.map((d) => ({
        id: crypto.randomUUID(),
        dealId: crypto.randomUUID(),
        ...d,
        createdAt: new Date(),
      })),
      payments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addDeal(newDeal);
    navigate({ to: "/pipeline" });
  };

  const handleCancel = () => {
    navigate({ to: "/pipeline" });
  };

  // Deliverable management
  const handleAddDeliverable = () => {
    setDeliverables((prev) => [
      ...prev,
      {
        type: "post",
        quantity: 1,
        description: "",
        dueDate: undefined,
        completedDate: undefined,
      },
    ]);
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeliverableChange = (index: number, field: keyof Omit<Deliverable, "id" | "createdAt" | "dealId">, value: any) => {
    setDeliverables((prev) =>
      prev.map((d, i) =>
        i === index ? { ...d, [field]: value } : d
      )
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!title.trim()) newErrors.title = "Deal title is required";
        break;
      case 2:
        deliverables.forEach((d, i) => {
          if (!d.description.trim()) {
            newErrors[`deliverable_${i}`] = "Description is required";
          }
        });
        break;
      case 3:
        if (!amount.trim()) newErrors.amount = "Amount is required";
        break;
      case 4:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-background font-display">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-6 pb-2 bg-background sticky top-0 z-20">
        <button onClick={handleCancel} className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <X className="h-6 w-6 text-slate-900 dark:text-white" />
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">New Deal</h2>
        <div className="flex w-10 items-center justify-end" />
      </header>

      {/* Progress Stepper */}
      <div className="px-6 py-4 bg-background sticky top-[60px] z-10 border-b border-gray-200 dark:border-white/5 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <div className={cn("h-1.5 flex-1 rounded-full transition-all", currentStep >= 1 ? "bg-primary shadow-[0_0_8px_rgba(19,200,236,0.6)]" : "bg-gray-300 dark:bg-[#3b4f54]")} />
            <div className={cn("h-1.5 flex-1 rounded-full transition-all", currentStep >= 2 ? "bg-primary" : "bg-gray-300 dark:bg-[#3b4f54]")} />
            <div className={cn("h-1.5 flex-1 rounded-full transition-all", currentStep >= 3 ? "bg-primary" : "bg-gray-300 dark:bg-[#3b4f54]")} />
            <div className={cn("h-1.5 flex-1 rounded-full transition-all", currentStep >= 4 ? "bg-primary" : "bg-gray-300 dark:bg-[#3b4f54]")} />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Step {currentStep} of 4</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {currentStep === 1 && "General Info"}
              {currentStep === 2 && "Deliverables"}
              {currentStep === 3 && "Payments & Legal"}
              {currentStep === 4 && "Review"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 flex flex-col gap-6 max-w-lg mx-auto w-full pb-32 overflow-y-auto">
        {currentStep === 1 && <Step1GeneralInfo formData={{ title, placeId, contactId, objective, startDate, endDate }} errors={errors} onChange={setTitle} onPlaceChange={setPlaceId} onContactChange={setContactId} onObjectiveChange={setObjective} onStartDateChange={setStartDate} onEndDateChange={setEndDate} />}
        {currentStep === 2 && <Step2Deliverables deliverables={deliverables} errors={errors} onChange={handleDeliverableChange} onAdd={handleAddDeliverable} onRemove={handleRemoveDeliverable} />}
        {currentStep === 3 && <Step3Payments formData={{ currency, amount, paymentSchedule, files: attachments }} errors={errors} onCurrencyChange={setCurrency} onAmountChange={setAmount} onPaymentScheduleChange={setPaymentSchedule} onFileUpload={handleFileUpload} />}
        {currentStep === 4 && <Step4Review formData={{ title, placeId, contactId, objective, startDate, endDate, currency, amount, paymentSchedule, deliverables }} places={places} contacts={contacts} onBackToStep={(step) => setCurrentStep(step as Step)} />}
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-background border-t border-gray-200 dark:border-white/5 p-4 z-50">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button onClick={handlePrevStep} className="flex items-center gap-2 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">
              <span className="text-sm">Back</span>
            </button>
          ) : (
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 dark:text-slate-600 uppercase font-bold tracking-wider">Next Step</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentStep === 1 && "Deliverables"}
                {currentStep === 2 && "Payments"}
                {currentStep === 3 && "Review"}
                {currentStep === 4 && ""}
              </span>
            </div>
          )}

          {currentStep < 4 ? (
            <button onClick={handleNextStep} className="flex-[1.5] items-center justify-center gap-2 h-14 rounded-xl bg-primary hover:bg-cyan-400 text-background-dark font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
              <span className="text-base">Next Step</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button onClick={handleCreateDeal} className="flex-[1.5] items-center justify-center gap-2 h-14 rounded-xl bg-primary hover:bg-cyan-400 text-background-dark font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
              <span className="text-base">Confirm & Create Deal</span>
              <CheckCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 1: General Info
function Step1GeneralInfo({
  formData,
  errors,
  onChange,
  onPlaceChange,
  onContactChange,
  onObjectiveChange,
  onStartDateChange,
  onEndDateChange,
}: {
  formData: {
    title: string;
    placeId: string;
    contactId: string;
    objective: string;
    startDate: string;
    endDate: string;
  };
  errors: Record<string, string>;
  onChange: (value: string) => void;
  onPlaceChange: (value: string) => void;
  onContactChange: (value: string) => void;
  onObjectiveChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}) {
  const places = usePlacesStore((state) => state.places);
  const contacts = useContactsStore((state) => state.contacts);

  return (
    <>
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Let's start with basics</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Fill in core details to set up your campaign structure.</p>
      </div>

      {/* Deal Title */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-white">Deal Title</label>
        <Input
          value={formData.title}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., Summer Brand Launch 2024"
          className={cn("rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 p-4 text-base focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all shadow-sm", errors.title && "border-destructive")}
        />
        {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
      </div>

      {/* Place/Brand */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-white">Place or Brand</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Building2 className={cn("h-5 w-5", formData.placeId ? "text-primary" : "text-slate-400")} />
          </div>
          <Select value={formData.placeId} onValueChange={onPlaceChange}>
            <SelectTrigger className="rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 py-4 pl-12 pr-10 text-base focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all shadow-sm appearance-none cursor-pointer">
              <SelectValue placeholder="Search for a brand..." />
            </SelectTrigger>
            <SelectContent>
              {places.length === 0 && (
                <SelectItem value="none" disabled>No places available</SelectItem>
              )}
              {places.map((place) => (
                <SelectItem key={place.id} value={place.id}>
                  {place.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-white">Contact (Optional)</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Building2 className="h-5 w-5 text-slate-400" />
          </div>
          <Select value={formData.contactId} onValueChange={onContactChange}>
            <SelectTrigger className="rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 py-4 pl-12 pr-10 text-base focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all shadow-sm appearance-none cursor-pointer">
              <SelectValue placeholder="Select a contact..." />
            </SelectTrigger>
            <SelectContent>
              {contacts.length === 0 && (
                <SelectItem value="none" disabled>No contacts available</SelectItem>
              )}
              {contacts.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Campaign Objective */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-white">Campaign Objective</label>
        <Textarea
          value={formData.objective}
          onChange={(e) => onObjectiveChange(e.target.value)}
          placeholder="Describe main goals, target audience, and key deliverables expected from this partnership..."
          rows={4}
          className="resize-none rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 p-4 text-base focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all shadow-sm"
        />
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-slate-700 dark:text-white">Timeline</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 py-3.5 pl-10 pr-3 text-sm focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all shadow-sm"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 py-3.5 pl-10 pr-3 text-sm focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all shadow-sm"
            />
          </div>
        </div>
        {/* Quick select pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["1 Week", "2 Weeks", "1 Month", "Quarter"].map((pill) => (
            <button
              key={pill}
              className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap hover:border-primary hover:text-primary transition-colors"
            >
              {pill}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// Step 2: Deliverables
function Step2Deliverables({
  deliverables,
  errors,
  onChange,
  onAdd,
  onRemove,
}: {
  deliverables: Array<Omit<Deliverable, "id" | "createdAt" | "dealId">>;
  errors: Record<string, string>;
  onChange: (index: number, field: keyof Omit<Deliverable, "id" | "createdAt" | "dealId">, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">Deliverables</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Define scope of work and deadlines for this campaign.</p>
      </div>

      <div className="space-y-4">
        {deliverables.map((deliverable, index) => (
          <DeliverableCard
            key={index}
            index={index}
            deliverable={deliverable}
            error={errors[`deliverable_${index}`]}
            onChange={(field, value) => onChange(index, field as keyof Omit<Deliverable, "id" | "createdAt" | "dealId">, value)}
            onRemove={() => onRemove(index)}
          />
        ))}
      </div>

      {/* Add Button */}
      <button
        onClick={onAdd}
        className="group w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary/50 hover:bg-primary/5 transition-all"
      >
        <span className="bg-primary/20 text-primary rounded-full p-1 transition-transform group-hover:scale-110">
          <Plus className="h-5 w-5" />
        </span>
        <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-primary">Add another deliverable</span>
      </button>
    </>
  );
}

// Deliverable Card Component
function DeliverableCard({
  index,
  deliverable,
  error,
  onChange,
  onRemove,
}: {
  index: number;
  deliverable: Omit<Deliverable, "id" | "createdAt" | "dealId">;
  error?: string;
  onChange: (field: keyof Omit<Deliverable, "id" | "createdAt" | "dealId">, value: any) => void;
  onRemove: () => void;
}) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, deliverable.quantity + delta);
    onChange("quantity", newQuantity);
  };

  return (
    <div className={cn("bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative group", index > 0 && "opacity-60 hover:opacity-100 transition-opacity")}>
      {/* Card Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <span className="bg-primary/10 text-primary p-1.5 rounded-lg">
            <Package className="h-5 w-5" />
          </span>
          <h3 className="font-semibold text-slate-900 dark:text-white">Deliverable #{index + 1}</h3>
        </div>
        {index === 0 ? (
          <button onClick={onRemove} className="text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 className="h-5 w-5" />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-primary">
              {DELIVERABLE_TYPES.find((t) => t.value === deliverable.type)?.label || "Content"}
            </span>
            <button onClick={onRemove} className="text-slate-400 hover:text-red-500 transition-colors">
              <Trash2 className="h-5 w-5" />
            </button>
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-400 hover:text-white transition-colors">
              <ChevronDown className={cn("h-5 w-5 transition-transform", isExpanded && "rotate-180")} />
            </button>
          </div>
        )}
      </div>

      {/* Form Fields (shown when expanded or first item) */}
      {isExpanded || index === 0 ? (
        <div className="space-y-4">
          {/* Content Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Content Type</label>
            <Select value={deliverable.type} onValueChange={(value) => onChange("type", value)}>
              <SelectTrigger className="w-full appearance-none rounded-lg bg-slate-50 dark:bg-gray-800 border-none py-3 pl-4 pr-10 text-sm font-medium focus:ring-2 focus:ring-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DELIVERABLE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          {/* Row: Quantity & Deadline */}
          <div className="grid grid-cols-2 gap-4">
            {/* Quantity Stepper */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quantity</label>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-gray-800 p-1 h-[46px]">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="flex items-center justify-center size-9 rounded-md bg-white dark:bg-gray-700 text-slate-500 dark:text-slate-300 shadow-sm hover:text-primary transition-colors"
                >
                  <span className="text-sm">−</span>
                </button>
                <span className="font-semibold text-slate-900 dark:text-white">{deliverable.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="flex items-center justify-center size-9 rounded-md bg-white dark:bg-gray-700 text-slate-500 dark:text-slate-300 shadow-sm hover:text-primary transition-colors"
                >
                  <span className="text-sm">+</span>
                </button>
              </div>
            </div>

            {/* Date Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Deadline</label>
              <Input
                type="date"
                value={deliverable.dueDate ? deliverable.dueDate.toISOString().split("T")[0] : ""}
                onChange={(e) => onChange("dueDate", e.target.value ? new Date(e.target.value) : null)}
                className="w-full rounded-lg bg-slate-50 dark:bg-gray-800 border-none py-3 pl-10 pr-4 text-sm font-medium h-[46px] focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Business Requirements */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Business Requirements</label>
            <Textarea
              value={deliverable.description}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="e.g. Must mention promo code 'SUMMER24' in first 15 seconds..."
              rows={3}
              className="w-full rounded-lg bg-slate-50 dark:bg-gray-800 border-none p-3 text-sm font-normal resize-none focus:ring-2 focus:ring-primary placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
          </div>
        </div>
      ) : (
        /* Collapsed content hint */
        <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            {deliverable.quantity}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {deliverable.dueDate ? new Date(deliverable.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "--"}
          </span>
        </div>
      )}
    </div>
  );
}

// Step 3: Payments & Legal
function Step3Payments({
  formData,
  errors,
  onCurrencyChange,
  onAmountChange,
  onPaymentScheduleChange,
  onFileUpload,
}: {
  formData: {
    currency: string;
    amount: string;
    paymentSchedule: string;
    files: File[];
  };
  errors: Record<string, string>;
  onCurrencyChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onPaymentScheduleChange: (value: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <h1 className="text-slate-900 dark:text-white tracking-tight text-[28px] font-bold leading-tight text-left pt-4 pb-6">
        Payments & Legal
      </h1>

      <div className="space-y-5">
        {/* Deal Value */}
        <div className="flex flex-col gap-4">
          <label className="flex flex-col w-full">
            <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Deal Value</p>
            <div className="flex gap-3">
              {/* Currency Dropdown */}
              <div className="relative w-1/3">
                <Select value={formData.currency} onValueChange={onCurrencyChange}>
                  <SelectTrigger className="appearance-none w-full rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-14 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>

              {/* Amount Input */}
              <div className="relative w-2/3">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 dark:text-slate-400 font-semibold">$</span>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => onAmountChange(e.target.value)}
                  placeholder="0.00"
                  className={cn("w-full rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-14 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium placeholder:text-slate-400", errors.amount && "border-destructive")}
                />
                {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount}</p>}
              </div>
            </div>
          </label>
        </div>

        {/* Payment Schedule */}
        <div className="flex flex-col gap-2 pt-2">
          <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-1">Payment Schedule</p>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_SCHEDULES.map((schedule) => (
              <label key={schedule} className="cursor-pointer">
                <input
                  type="radio"
                  name="payment_schedule"
                  value={schedule}
                  checked={formData.paymentSchedule === schedule}
                  onChange={(e) => onPaymentScheduleChange(e.target.value)}
                  className="peer sr-only"
                />
                <div className={cn(
                  "flex items-center justify-center h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-gray-700 text-slate-500 dark:text-slate-400 font-medium peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary transition-all",
                  formData.paymentSchedule === schedule && "border-primary bg-primary/10 text-primary"
                )}>
                  {schedule === "upfront" && "Upfront"}
                  {schedule === "net30" && "Net 30"}
                  {schedule === "net60" && "Net 60"}
                  {schedule === "custom" && "Custom"}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* File Uploader */}
        <div className="flex flex-col gap-2 pt-2">
          <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-1">Attachments</p>
          <div className="group relative flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary dark:hover:border-primary bg-slate-50 dark:bg-gray-700 hover:bg-slate-100 dark:hover:bg-gray-600 transition-all cursor-pointer">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="p-3 bg-white dark:bg-gray-600 rounded-full shadow-sm mb-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <p className="mb-1 text-sm font-medium text-slate-900 dark:text-white">Contracts or Documents</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">PDF, DOCX up to 10MB</p>
              {formData.files.length > 0 && (
                <p className="text-xs text-primary font-semibold mt-1">
                  {formData.files.length} file{formData.files.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={onFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Legal Notice */}
        <div className="flex gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 items-start">
          <Info className="text-primary h-5 w-5 mt-0.5" />
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Contracts uploaded here will be automatically sent to influencer for e-signature upon deal creation.
          </p>
        </div>
      </div>
    </>
  );
}

// Step 4: Review
function Step4Review({
  formData,
  places,
  contacts,
  onBackToStep,
}: {
  formData: {
    title: string;
    placeId: string;
    contactId: string;
    objective: string;
    startDate: string;
    endDate: string;
    currency: string;
    amount: string;
    paymentSchedule: string;
    deliverables: Array<Omit<Deliverable, "id" | "createdAt" | "dealId">>;
  };
  places: Array<{ id: string; name: string }>;
  contacts: Array<{ id: string; name: string }>;
  onBackToStep: (step: number) => void;
}) {
  const place = places.find((p) => p.id === formData.placeId);
  const contact = contacts.find((c) => c.id === formData.contactId);

  return (
    <>
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-slate-900 dark:text-white tracking-tight text-[28px] font-bold leading-tight text-left">
          Review Deal Details
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Please verify all information before sending.</p>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* General Info Card */}
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-900 dark:text-white text-base font-bold leading-tight">General Info</h3>
            <button onClick={() => onBackToStep(1)} className="text-primary hover:text-primary/80 transition-colors flex items-center justify-center rounded-full p-1 hover:bg-primary/10">
              <Edit2 className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col gap-4 pb-4 border-b border-gray-100 dark:border-gray-800/50">
            {/* Contact */}
            {contact && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 aspect-square bg-cover rounded-full h-12 w-12 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-primary font-bold text-xl">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-slate-900 dark:text-white text-sm font-semibold leading-normal">{contact.name}</p>
                </div>
              </div>
            )}
            {/* Place */}
            {place && (
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 border border-orange-200/50 dark:border-orange-700/30">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-slate-900 dark:text-white text-sm font-semibold leading-normal">{place.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">Brand</p>
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Title</span>
              <span className="text-sm text-slate-900 dark:text-white font-medium">{formData.title}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Status</span>
              <span className="inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                Draft
              </span>
            </div>
          </div>
        </div>

        {/* Deliverables Card */}
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-slate-900 dark:text-white text-base font-bold leading-tight">Deliverables</h3>
            <button onClick={() => onBackToStep(2)} className="text-primary hover:text-primary/80 transition-colors flex items-center justify-center rounded-full p-1 hover:bg-primary/10">
              <Edit2 className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-3">
            {formData.deliverables.map((deliverable, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-gray-800/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300">
                  <Video className="h-5 w-5" />
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-slate-900 dark:text-white text-sm font-semibold">
                    {DELIVERABLE_TYPES.find((t) => t.value === deliverable.type)?.label || "Content"}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 line-clamp-1">
                    {deliverable.description || "No description"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Qty: {deliverable.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Card */}
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-900 dark:text-white text-base font-bold leading-tight">Payment</h3>
            <button onClick={() => onBackToStep(3)} className="text-primary hover:text-primary/80 transition-colors flex items-center justify-center rounded-full p-1 hover:bg-primary/10">
              <Edit2 className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide mb-1">Total Amount</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{formData.amount || "0.00"}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{formData.currency}</span>
              </div>
            </div>
            <div className="w-full h-px bg-gray-200 dark:bg-gray-700"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Payment Terms</span>
                <span className="text-sm text-slate-900 dark:text-white font-medium">
                  {formData.paymentSchedule === "upfront" && "Upfront"}
                  {formData.paymentSchedule === "net30" && "Net 30"}
                  {formData.paymentSchedule === "net60" && "Net 60"}
                  {formData.paymentSchedule === "custom" && "Custom"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Platform Fee</span>
                <span className="text-sm text-slate-900 dark:text-white font-medium">Covered by Brand</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
