import * as React from "react";
import { useContactsStore } from "@/stores/contactsStore";
import { usePlacesStore } from "@/stores/placesStore";
import { Timeline } from "@/components/Timeline";
import { type TimelineEvent } from "@/lib/zod/schemas";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeftIcon,
  PhoneIcon,
  MailIcon,
  MessageCircleIcon,
  Building2Icon,
  EditIcon,
  Trash2Icon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
} from "lucide-react";

interface ContactDetailProps {
  contactId: string;
  onBack?: () => void;
}

// Mock timeline events for demo - in real app, these would come from a store
const mockTimelineEvents: TimelineEvent[] = [
  {
    id: crypto.randomUUID(),
    type: "note_added",
    entityId: crypto.randomUUID(),
    entityType: "contact",
    title: "Initial contact",
    description: "Met Sarah at the restaurant launch event. She's interested in promotional content.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: crypto.randomUUID(),
    type: "reminder_created",
    entityId: crypto.randomUUID(),
    entityType: "contact",
    title: "Follow-up call scheduled",
    description: "Schedule a follow-up call to discuss partnership details.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
];

export function ContactDetail({ contactId, onBack }: ContactDetailProps) {
  const getContactById = useContactsStore((state) => state.getContactById);
  const deleteContact = useContactsStore((state) => state.deleteContact);
  const getPlaceById = usePlacesStore((state) => state.getPlaceById);
  const placeLinks = useContactsStore((state) => state.placeLinks);

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Find contact by ID
  const contact = React.useMemo(() => getContactById(contactId), [contactId, getContactById]);

  // Find associated place
  const linkedPlace = React.useMemo(() => {
    if (!contact) return undefined;
    const link = placeLinks.find((l) => l.contactId === contact.id);
    return link ? getPlaceById(link.placeId) : undefined;
  }, [contact, placeLinks, getPlaceById]);

  // Handle delete with confirmation
  const handleDelete = () => {
    setIsDeleting(true);
    const result = deleteContact(contactId);
    setIsDeleting(false);

    if (result.success) {
      setShowDeleteDialog(false);
      onBack?.();
    } else {
      // Show error - in real app, you'd have error state
      console.error("Failed to delete contact:", result.error);
    }
  };

  // Handle edit button click - for now, just log (will wire up AddContact modal later)
  const handleEdit = () => {
    console.log("Edit contact:", contact);
    // TODO: Open AddContact modal with contact data pre-filled
  };

  // Handle action buttons
  const handleWhatsApp = () => {
    if (contact?.phone) {
      const formattedPhone = contact.phone.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${formattedPhone}`, "_blank");
    }
  };

  const handleEmail = () => {
    if (contact?.email) {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  const handleCall = () => {
    if (contact?.phone) {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  // Loading state
  if (!contact) {
    return (
      <div className="flex min-h-screen flex-col bg-background dark:bg-background">
        {/* Header */}
        <header className="flex-none border-b border-border bg-surface/95 backdrop-blur px-4 py-3 flex items-center justify-center relative">
          <button
            onClick={onBack}
            className="absolute left-4 text-foreground"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold tracking-tight">Contact Details</h1>
          <div className="w-6" />
        </header>

        {/* Not found state */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <UserIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Contact Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The contact you're looking for doesn't exist or has been deleted.
            </p>
            <Button onClick={onBack} variant="outline">
              Go Back
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background dark:bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 flex-none border-b border-border bg-background/95 backdrop-blur px-4 py-3 pb-2 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          Contact Details
        </h2>
        <button
          onClick={handleEdit}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <EditIcon className="h-5 w-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-5">
          {/* Contact Profile Section */}
          <div className="flex flex-col items-center gap-4">
            {/* Avatar */}
            <div className="relative group cursor-pointer">
              <div className="flex size-32 items-center justify-center rounded-full bg-muted border-4 border-background shadow-lg overflow-hidden">
                <UserIcon className="h-16 w-16 text-muted-foreground" />
              </div>
            </div>

            {/* Name and Role */}
            <div className="flex flex-col items-center justify-center gap-1 text-center">
              <h1 className="text-2xl font-bold leading-tight">{contact.name}</h1>
              {contact.role && (
                <p className="text-muted-foreground text-sm font-medium">{contact.role}</p>
              )}

              {/* Linked Place Badge */}
              {linkedPlace && (
                <button
                  onClick={() => {
                    // Navigate to place detail - for now using window.location
                    // TODO: Use TanStack Router's navigate when route is set up
                    console.log("Navigate to place:", linkedPlace.id);
                  }}
                  className="flex items-center gap-1 mt-1 bg-muted border-border px-3 py-1 rounded-full shadow-sm hover:bg-muted/80 transition-colors"
                >
                  <Building2Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold">{linkedPlace.name}</span>
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex w-full gap-3 mt-1">
              <Button
                onClick={handleWhatsApp}
                variant="secondary"
                className="flex-1 h-10 gap-2"
              >
                <MessageCircleIcon className="h-5 w-5 text-green-600 dark:text-green-500" />
                <span className="text-sm font-semibold">WhatsApp</span>
              </Button>
              <Button
                onClick={handleEmail}
                variant="secondary"
                className="flex-1 h-10 gap-2"
              >
                <MailIcon className="h-5 w-5" />
                <span className="text-sm font-semibold">Email</span>
              </Button>
              <Button
                onClick={handleCall}
                variant="secondary"
                className="flex-1 h-10 gap-2"
              >
                <PhoneIcon className="h-5 w-5" />
                <span className="text-sm font-semibold">Call</span>
              </Button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card size="sm" className="flex flex-col gap-1 p-4">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Contact Since
              </p>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <p className="text-lg font-bold">
                  {contact.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            </Card>
            <Card size="sm" className="flex flex-col gap-1 p-4">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Last Updated
              </p>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-primary" />
                <p className="text-lg font-bold">
                  {contact.updatedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            </Card>
          </div>

          {/* Contact Details */}
          {(contact.email || contact.phone || contact.instagram) && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold uppercase tracking-wider pl-1">Contact Info</h3>
              <div className="flex flex-col gap-2">
                {contact.email && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <MailIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm font-medium truncate hover:text-primary transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <PhoneIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-sm font-medium truncate hover:text-primary transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}
                {contact.instagram && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <FileTextIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                    <a
                      href={`https://instagram.com/${contact.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium truncate hover:text-primary transition-colors"
                    >
                      {contact.instagram}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes Section */}
          {contact.notes && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold uppercase tracking-wider pl-1">Notes</h3>
              <Card size="sm" className="p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{contact.notes}</p>
              </Card>
            </div>
          )}

          {/* Divider */}
          <div className="h-px w-full bg-border" />

          {/* History Section */}
          <div className="flex flex-col gap-3 pb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider pl-1">History</h3>
              <Button variant="ghost" size="sm" className="text-xs font-medium">
                <FileTextIcon className="h-4 w-4 mr-1" />
                Add Note
              </Button>
            </div>
            <Timeline events={mockTimelineEvents} />
          </div>
        </div>
      </main>

      {/* Footer with Delete Button */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border z-50">
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          className="w-full h-12 gap-2 font-semibold"
        >
          <Trash2Icon className="h-5 w-5" />
          Delete Contact
        </Button>
      </footer>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {contact.name} and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
