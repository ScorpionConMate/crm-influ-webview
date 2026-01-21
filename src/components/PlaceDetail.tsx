import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { usePlacesStore } from "@/stores/placesStore";
import { useContactsStore } from "@/stores/contactsStore";
import { type TimelineEvent } from "@/lib/zod/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Timeline } from "@/components/Timeline";
import {
  MapPinIcon,
  PhoneIcon,
  GlobeIcon,
  ClockIcon,
  UserIcon,
  MailIcon,
  MessageSquareIcon,
  ArrowLeftIcon,
  EditIcon,
  Trash2Icon,
  CheckCircle2Icon,
} from "lucide-react";

interface PlaceDetailProps {
  placeId: string;
}

export function PlaceDetail({ placeId }: PlaceDetailProps) {
  const navigate = useNavigate();
  const getPlaceById = usePlacesStore((state) => state.getPlaceById);
  const deletePlace = usePlacesStore((state) => state.deletePlace);
  const getContactsByPlace = useContactsStore((state) => state.getContactsByPlace);

  const place = getPlaceById(placeId);
  const contacts = getContactsByPlace(placeId);

  // Handle delete
  const handleDelete = () => {
    const result = deletePlace(placeId);
    if (result.success) {
      navigate({ to: "/places" });
    }
  };

  // Handle edit (for now, navigate back - will wire up actual edit flow later)
  const handleEdit = () => {
    // TODO: Implement edit flow with AddPlaceStep1/Step2
    // For now, just log placeholder
    console.log("Edit place:", placeId);
  };

  // Handle call
  const handleCall = () => {
    if (place?.phone) {
      window.location.href = `tel:${place.phone}`;
    }
  };

  // Handle map
  const handleMap = () => {
    if (place?.address && place?.city) {
      const query = encodeURIComponent(`${place.address}, ${place.city}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    }
  };

  // Handle website
  const handleWebsite = () => {
    if (place?.website) {
      window.open(place.website, "_blank");
    }
  };

  // Loading state
  if (!place) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <ClockIcon className="h-12 w-12 text-muted-foreground mb-4 animate-spin" />
        <p className="text-muted-foreground">Loading place details...</p>
      </div>
    );
  }

  // Not found state
  if (!place) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <p className="text-muted-foreground">Place not found</p>
        <Button onClick={() => navigate({ to: "/places" })} className="mt-4">
          Go to Places
        </Button>
      </div>
    );
  }

  // Parse tags from notes if they exist
  const parseTags = (notes?: string): string[] => {
    if (!notes) return [];
    const tagsMatch = notes.match(/Tags:\s*(.+?)(?:\n\n|$)/i);
    if (!tagsMatch) return [];
    return tagsMatch[1].split(",").map((tag) => tag.trim()).filter(Boolean);
  };

  const tags = parseTags(place.notes);

  // Create mock timeline events (will be replaced with real data from visitsStore later)
  const mockTimelineEvents: TimelineEvent[] = React.useMemo(() => {
    const events: TimelineEvent[] = [];

    // Add a placeholder event if no real events exist
    events.push({
      id: crypto.randomUUID(),
      type: "note_added",
      entityId: place.id,
      entityType: "place",
      title: "Place created",
      description: "This place was added to your CRM",
      timestamp: place.createdAt,
    });

    return events;
  }, [place.id, place.createdAt]);

  return (
    <div className="flex h-screen flex-col bg-background dark:bg-background">
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 bg-background/95 dark:bg-background/95 backdrop-blur-sm border-b border-border p-4 pb-2 flex items-center justify-between">
        <button
          onClick={() => navigate({ to: "/places" })}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-muted dark:hover:bg-muted/50 transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          Place Details
        </h2>
        <div className="flex gap-1">
          <button
            onClick={handleEdit}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-muted dark:hover:bg-muted/50 transition-colors"
          >
            <EditIcon className="h-5 w-5" />
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors text-destructive">
                <Trash2Icon className="h-5 w-5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Place</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{place.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex flex-col w-full flex-1 overflow-y-auto pb-24">
        {/* Hero Profile Header */}
        <div className="flex flex-col p-5 gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer">
              <div
                className="bg-center bg-no-repeat bg-cover rounded-2xl h-32 w-32 shadow-lg ring-4 ring-white dark:ring-border bg-muted flex items-center justify-center"
              >
                <MapPinIcon className="h-16 w-16 text-muted-foreground/50" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-background rounded-full p-1.5 border-4 border-background dark:border-background">
                <CheckCircle2Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <h1 className="text-2xl font-bold leading-tight text-center">{place.name}</h1>
              <p className="text-muted-foreground text-sm font-medium text-center">
                {place.address}, {place.city}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {place.category && (
                  <>
                    <Badge variant="secondary" className="text-xs">
                      {place.category}
                    </Badge>
                    <span className="text-muted-foreground text-xs mx-1">•</span>
                  </>
                )}
                <span className="text-muted-foreground text-xs">
                  Added {place.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full gap-3 mt-1">
              <Button
                onClick={handleCall}
                disabled={!place.phone}
                variant="outline"
                className="flex-1 h-10"
              >
                <PhoneIcon className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button
                onClick={handleMap}
                variant="outline"
                className="flex-1 h-10"
              >
                <MapPinIcon className="h-4 w-4 mr-2" />
                Map
              </Button>
              <Button
                onClick={handleWebsite}
                disabled={!place.website}
                variant="outline"
                className="flex-1 h-10"
              >
                <GlobeIcon className="h-4 w-4 mr-2" />
                Web
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        {place.phone || place.website || place.instagram ? (
          <>
            <div className="px-5 pb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    {place.phone && (
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`tel:${place.phone}`}
                          className="text-sm hover:text-primary transition-colors"
                        >
                          {place.phone}
                        </a>
                      </div>
                    )}
                    {place.website && (
                      <div className="flex items-center gap-3">
                        <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:text-primary transition-colors line-clamp-1"
                        >
                          {place.website}
                        </a>
                      </div>
                    )}
                    {place.instagram && (
                      <div className="flex items-center gap-3">
                        <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`https://instagram.com/${place.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:text-primary transition-colors"
                        >
                          {place.instagram}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="px-5 pb-6">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs font-normal">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {place.notes && (
          <div className="px-5 pb-6">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm whitespace-pre-wrap">{place.notes}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Primary Contact Section */}
        {contacts.length > 0 && (
          <div className="px-5 pb-8">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Contacts</CardTitle>
                  <span className="text-xs text-muted-foreground">{contacts.length}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center p-3 rounded-xl bg-muted/50 dark:bg-muted/30 border border-border"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <UserIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 ml-3">
                        <p className="font-medium truncate">{contact.name}</p>
                        {contact.role && (
                          <p className="text-sm text-muted-foreground truncate">{contact.role}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="h-9 w-9 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
                          >
                            <MailIcon className="h-4 w-4" />
                          </a>
                        )}
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="h-9 w-9 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
                          >
                            <PhoneIcon className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Interaction History / Timeline */}
        <div className="px-5 pb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">History</h3>
          </div>
          <Timeline events={mockTimelineEvents} />
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-background dark:bg-background border-t border-border z-50 backdrop-blur-md">
        <Button
          className="w-full h-12 shadow-lg shadow-primary/20"
          onClick={() => {
            // TODO: Implement create deal flow
            console.log("Create deal for place:", placeId);
          }}
        >
          <span className="material-symbols-outlined mr-2" style={{ fontSize: "20px" }}>
            add_circle
          </span>
          Create Deal
        </Button>
      </div>
    </div>
  );
}
