import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDealsStore } from "@/stores/dealsStore";
import { usePlacesStore } from "@/stores/placesStore";
import { useContactsStore } from "@/stores/contactsStore";
import { useRemindersStore } from "@/stores/remindersStore";
import { type Deal, type DealStatus, type TimelineEvent, type Deliverable, type PaymentInfo, type Reminder } from "@/lib/zod/schemas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Timeline } from "@/components/Timeline";
import { DealEdit } from "./DealEdit";
import { cn } from "@/lib/utils";
import {
  ArrowLeftIcon,
  Edit2Icon,
  Trash2Icon,
  PlusIcon,
  DollarSignIcon,
  CalendarIcon,
  FileTextIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  AlertCircleIcon,
  StickyNoteIcon,
  CheckCircle2Icon,
} from "lucide-react";

interface DealDetailProps {
  dealId: string;
  onBack?: () => void;
}

const STAGE_COLORS: Record<DealStatus, { bg: string; text: string }> = {
  lead: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300" },
  contacted: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
  negotiation: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
  confirmed: { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-300" },
  delivered: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300" },
  paid: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300" },
  lost: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300" },
};

const PAYMENT_STATUS_COLORS: Record<PaymentInfo["status"], { bg: string; text: string }> = {
  pending: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
  paid: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300" },
  overdue: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300" },
};

function formatCurrency(value: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getStatusLabel(status: DealStatus): string {
  const labels: Record<DealStatus, string> = {
    lead: "Lead",
    contacted: "Contacted",
    negotiation: "Negotiation",
    confirmed: "Confirmed",
    delivered: "Delivered",
    paid: "Paid",
    lost: "Lost",
  };
  return labels[status] || status;
}

function getDeliverableTypeLabel(type: Deliverable["type"]): string {
  const labels: Record<Deliverable["type"], string> = {
    post: "Post",
    story: "Story",
    reel: "Reel",
    video: "Video",
    other: "Other",
  };
  return labels[type] || type;
}

function getPaymentStatusLabel(status: PaymentInfo["status"]): string {
  const labels: Record<PaymentInfo["status"], string> = {
    pending: "Pending",
    paid: "Paid",
    overdue: "Overdue",
  };
  return labels[status] || status;
}

function generateTimelineEvents(deal: Deal, placeName: string, contactName: string, reminders: Reminder[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Deal created event
  events.push({
    id: crypto.randomUUID(),
    type: "deal_created",
    entityId: deal.id,
    entityType: "deal",
    title: "Deal created",
    description: `Deal "${deal.title}" was created`,
    timestamp: deal.createdAt,
    metadata: {
      placeName,
      contactName,
    },
  });

  // Status change events
  events.push({
    id: crypto.randomUUID(),
    type: "deal_status_changed",
    entityId: deal.id,
    entityType: "deal",
    title: `Status changed to ${getStatusLabel(deal.status)}`,
    timestamp: deal.updatedAt,
  });

  // Deliverable events
  deal.deliverables.forEach((deliverable) => {
    events.push({
      id: crypto.randomUUID(),
      type: "deliverable_added",
      entityId: deliverable.id,
      entityType: "deal",
      title: `Deliverable added: ${getDeliverableTypeLabel(deliverable.type)}`,
      description: deliverable.description,
      timestamp: deliverable.createdAt,
      metadata: {
        deliverableId: deliverable.id,
      },
    });

    if (deliverable.completedDate) {
      events.push({
        id: crypto.randomUUID(),
        type: "deliverable_completed",
        entityId: deliverable.id,
        entityType: "deal",
        title: `Deliverable completed: ${getDeliverableTypeLabel(deliverable.type)}`,
        timestamp: deliverable.completedDate,
        metadata: {
          deliverableId: deliverable.id,
        },
      });
    }
  });

  // Payment events
  deal.payments.forEach((payment) => {
    events.push({
      id: crypto.randomUUID(),
      type: "payment_added",
      entityId: payment.id,
      entityType: "deal",
      title: `Payment ${getPaymentStatusLabel(payment.status)}`,
      description: `${formatCurrency(payment.amount, payment.currency)}`,
      timestamp: payment.createdAt,
      metadata: {
        paymentId: payment.id,
      },
    });

    if (payment.status === "paid" && payment.paidDate) {
      events.push({
        id: crypto.randomUUID(),
        type: "payment_completed",
        entityId: payment.id,
        entityType: "deal",
        title: "Payment completed",
        description: `${formatCurrency(payment.amount, payment.currency)} paid`,
        timestamp: payment.paidDate,
        metadata: {
          paymentId: payment.id,
        },
      });
    }
  });

  // Reminder events
  reminders.forEach((reminder) => {
    events.push({
      id: crypto.randomUUID(),
      type: reminder.completed ? "reminder_completed" : "reminder_created",
      entityId: reminder.id,
      entityType: "reminder",
      title: reminder.completed ? "Reminder completed" : "Reminder created",
      description: reminder.title,
      timestamp: reminder.completed ? reminder.completedDate || reminder.createdAt : reminder.createdAt,
      metadata: {
        reminderId: reminder.id,
        priority: reminder.priority,
      },
    });
  });

  return events;
}

export function DealDetail({ dealId, onBack }: DealDetailProps) {
  const navigate = useNavigate();
  const getDealById = useDealsStore((state) => state.getDealById);
  const updateDeal = useDealsStore((state) => state.updateDeal);
  const deleteDeal = useDealsStore((state) => state.deleteDeal);
  const getPlaceById = usePlacesStore((state) => state.getPlaceById);
  const getContactById = useContactsStore((state) => state.getContactById);
  const getRemindersByDeal = useRemindersStore((state) => state.getRemindersByDeal);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [noteInput, setNoteInput] = React.useState("");
  const [isAddingNote, setIsAddingNote] = React.useState(false);

  const deal = getDealById(dealId);
  const place = deal?.placeId ? getPlaceById(deal.placeId) : undefined;
  const contact = deal?.contactId ? getContactById(deal.contactId) : undefined;
  const reminders = dealId ? getRemindersByDeal(dealId) : [];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate({ to: "/pipeline" });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSave = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (deal) {
      deleteDeal(deal.id);
      handleBack();
    }
  };

  const handleAddNote = () => {
    if (noteInput.trim() && deal) {
      const existingNotes = deal.notes || "";
      const updatedNotes = existingNotes ? `${existingNotes}\n\n${noteInput.trim()}` : noteInput.trim();
      updateDeal(deal.id, { notes: updatedNotes });
      setNoteInput("");
      setIsAddingNote(false);
    }
  };

  const handleCreateReminder = () => {
    alert("Quick Reminder will be available in Phase 3 (Group F). For now, reminders can be created from Reminders screen.");
  };

  const handlePlaceClick = () => {
    if (deal?.placeId) {
      navigate({ to: `/places/${deal.placeId}` });
    }
  };

  const handleContactClick = () => {
    if (deal?.contactId) {
      navigate({ to: `/contacts/${deal.contactId}` });
    }
  };

  if (!deal) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <AlertCircleIcon className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Deal not found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The deal you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  const statusColors = STAGE_COLORS[deal.status] || STAGE_COLORS.lead;
  const timelineEvents = generateTimelineEvents(deal, place?.name || "Unknown Place", contact?.name || "Unknown Contact", reminders);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsAddingNote(!isAddingNote)}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Note
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCreateReminder}>
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Reminder
                </Button>
                <Button variant="ghost" size="icon" onClick={handleEdit}>
                  <Edit2Icon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {isEditing && deal ? (
        <div className="flex-1 overflow-y-auto p-4">
          <DealEdit deal={deal} onCancel={handleEditCancel} onSave={handleEditSave} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
          {/* Summary Section */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-xl">{deal.title}</CardTitle>
              <Badge className={cn(statusColors.bg, statusColors.text)}>
                {getStatusLabel(deal.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Place and Contact */}
            <div className="space-y-3">
              {place ? (
                <button
                  onClick={handlePlaceClick}
                  className="flex flex-col items-start gap-1.5 text-left w-full hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-2 transition-colors"
                >
                  <div className="flex items-center gap-2 w-full">
                    <MapPinIcon className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {place.name}
                    </span>
                    {place.category && (
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {place.category}
                      </Badge>
                    )}
                  </div>
                  <div className="ml-6 text-xs text-slate-600 dark:text-slate-400">
                    {place.city && <span>{place.city}</span>}
                    {place.city && place.address && <span className="mx-1">•</span>}
                    {place.address && <span>{place.address}</span>}
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                  <MapPinIcon className="h-4 w-4" />
                  <span>Place not specified</span>
                </div>
              )}
              {contact ? (
                <button
                  onClick={handleContactClick}
                  className="flex flex-col items-start gap-1.5 text-left w-full hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-2 transition-colors"
                >
                  <div className="flex items-center gap-2 w-full">
                    <UserIcon className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {contact.name}
                    </span>
                    {contact.role && (
                      <Badge variant="outline" className="text-xs ml-auto">
                        {contact.role}
                      </Badge>
                    )}
                  </div>
                  {contact.email && (
                    <div className="ml-6 text-xs text-slate-600 dark:text-slate-400">
                      {contact.email}
                    </div>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                  <UserIcon className="h-4 w-4" />
                  <span>Contact not specified</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Values */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <DollarSignIcon className="h-3.5 w-3.5" />
                  <span>Estimated Value</span>
                </div>
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  {deal.estimatedValue ? formatCurrency(deal.estimatedValue, deal.currency) : "Not set"}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <DollarSignIcon className="h-3.5 w-3.5" />
                  <span>Actual Value</span>
                </div>
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  {deal.actualValue ? formatCurrency(deal.actualValue, deal.currency) : "Not set"}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span>Start Date</span>
                </div>
                <p className="text-sm text-slate-900 dark:text-white">
                  {deal.startDate ? formatDate(deal.startDate) : "Not set"}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span>End Date</span>
                </div>
                <p className="text-sm text-slate-900 dark:text-white">
                  {deal.endDate ? formatDate(deal.endDate) : "Not set"}
                </p>
              </div>
            </div>

            {/* Notes */}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                <StickyNoteIcon className="h-3.5 w-3.5" />
                <span>Notes</span>
              </div>
              {deal.notes ? (
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                  {deal.notes}
                </p>
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500 mb-3">
                  No notes yet
                </p>
              )}
              {isAddingNote && (
                <div className="space-y-2 mt-2">
                  <Textarea
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Add a note..."
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setIsAddingNote(false); setNoteInput(""); }}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleAddNote} disabled={!noteInput.trim()}>
                      Save Note
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Deliverables Section */}
        {deal.deliverables.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deal.deliverables.map((deliverable) => {
                  const isCompleted = !!deliverable.completedDate;
                  const statusColors = isCompleted
                    ? { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300" }
                    : { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300" };
                  return (
                    <div
                      key={deliverable.id}
                      className="flex flex-col gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileTextIcon className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {getDeliverableTypeLabel(deliverable.type)}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            x{deliverable.quantity}
                          </span>
                        </div>
                        <Badge className={cn(statusColors.bg, statusColors.text, "text-xs")}>
                          {isCompleted ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle2Icon className="h-3 w-3" />
                              Completed
                            </span>
                          ) : (
                            "Pending"
                          )}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {deliverable.description}
                      </p>
                      {deliverable.dueDate && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <CalendarIcon className="h-3 w-3" />
                          <span>Due: {formatDate(deliverable.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payments Section */}
        {deal.payments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deal.payments.map((payment) => {
                  const statusColors = PAYMENT_STATUS_COLORS[payment.status];
                  return (
                    <div
                      key={payment.id}
                      className="flex flex-col gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <DollarSignIcon className="h-4 w-4 text-slate-400" />
                          <span className="text-base font-semibold text-slate-900 dark:text-white">
                            {formatCurrency(payment.amount, payment.currency)}
                          </span>
                        </div>
                        <Badge className={cn(statusColors.bg, statusColors.text, "text-xs")}>
                          {getPaymentStatusLabel(payment.status)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                        <span>{payment.method.toUpperCase()}</span>
                        {payment.invoiceNumber && <span>Invoice: {payment.invoiceNumber}</span>}
                      </div>
                      {payment.terms && (
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Terms: {payment.terms}
                        </p>
                      )}
                      {payment.dueDate && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <CalendarIcon className="h-3 w-3" />
                          <span>Due: {formatDate(payment.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">History</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline events={timelineEvents} />
          </CardContent>
        </Card>
      </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogPortal>
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia>
                <Trash2Icon className="h-6 w-6 text-destructive" />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete deal?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this deal and all associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/80">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </div>
  );
}
