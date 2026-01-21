import * as React from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeftIcon, CheckCircle2Icon, Edit2Icon, ClockIcon, FileTextIcon, MicIcon, ImageIcon } from "lucide-react";
import { useVisitsStore } from "@/stores/visitsStore";
import { usePlacesStore } from "@/stores/placesStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VisitSummaryProps {
  visitId?: string;
}

export function VisitSummary({ visitId: propVisitId }: VisitSummaryProps = {}) {
  const { id: paramVisitId } = useParams({ from: "/checkin/$id/summary" });
  const navigate = useNavigate();
  const { visits, endVisit, deleteVisit, activeVisit } = useVisitsStore();
  const { getPlaceById } = usePlacesStore();

  const visitId = propVisitId || paramVisitId;
  const visit = React.useMemo(() => {
    // Try activeVisit first, then look in visits array
    if (activeVisit?.id === visitId) return activeVisit;
    return visits.find((v) => v.id === visitId);
  }, [visitId, visits, activeVisit]);

  const place = React.useMemo(() => {
    return visit ? getPlaceById(visit.placeId) : null;
  }, [visit, getPlaceById]);

  // Format duration as MM:SS
  const formatDuration = React.useMemo(() => {
    if (!visit) return "0:00";
    const endTime = visit.endTime || new Date();
    const durationMs = endTime.getTime() - visit.startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [visit]);

  // Format visit date
  const formatVisitDate = React.useMemo(() => {
    if (!visit?.startTime) return "";
    return new Date(visit.startTime).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, [visit?.startTime]);

  // Handle save & sync
  const handleSaveAndSync = () => {
    if (!visitId) return;
    endVisit(visitId);
    navigate({ to: "/" });
  };

  // Handle discard session
  const handleDiscard = () => {
    if (!visitId) return;
    if (confirm("Are you sure you want to discard this visit session?")) {
      deleteVisit(visitId);
      navigate({ to: "/" });
    }
  };

  // Handle edit notes (navigate back to notes page)
  const handleEditNotes = () => {
    navigate({ to: `/checkin/${visitId}/notes` });
  };

  const handleBack = () => {
    navigate({ to: "/checkin/start" });
  };

  if (!visit || !place) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <p className="text-slate-500 dark:text-slate-400">Visit not found</p>
      </div>
    );
  }

  const visitStatus = visit.endTime ? "Complete" : "Pending";
  const hasPhotos = visit.photos.length > 0;
  const hasNotes = visit.notes.length > 0;
  const hasVoiceMemos = visit.voiceMemos.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            Session Summary
          </h1>
          <div className="w-[70px]" /> {/* Spacer for balance */}
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 pb-24">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6 border border-green-100 dark:border-green-900/50">
          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <CheckCircle2Icon className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-green-900 dark:text-green-100">
                Session Complete!
              </h2>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                {place.name}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shrink-0">
                  <ClockIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Duration
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                    {formatDuration}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                  visitStatus === "Complete"
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "bg-amber-100 dark:bg-amber-900/30"
                }`}>
                  <CheckCircle2Icon className={`h-5 w-5 ${
                    visitStatus === "Complete"
                      ? "text-green-600 dark:text-green-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Status
                  </p>
                  <p className={`text-lg font-semibold mt-1 ${
                    visitStatus === "Complete"
                      ? "text-green-700 dark:text-green-300"
                      : "text-amber-700 dark:text-amber-300"
                  }`}>
                    {visitStatus}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                  <MicIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Voice Memos
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                    {visit.voiceMemos.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Photos
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                    {visit.photos.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes Preview Card */}
        {hasNotes && (
          <Card className="bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileTextIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span>Notes</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditNotes}
                  className="flex items-center gap-1.5"
                >
                  <Edit2Icon className="h-3.5 w-3.5" />
                  <span className="text-xs">Edit</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {visit.notes.slice(0, 3).map((note, index) => (
                  <p
                    key={index}
                    className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2"
                  >
                    {note}
                  </p>
                ))}
                {visit.notes.length > 3 && (
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    +{visit.notes.length - 3} more note{visit.notes.length - 3 > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Media Strip */}
        {hasPhotos && (
          <Card className="bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span>Captured Photos ({visit.photos.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                {visit.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                  >
                    <img
                      src={photo.url}
                      alt="Visit photo"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty States */}
        {!hasNotes && !hasPhotos && !hasVoiceMemos && (
          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-8 text-center">
              <FileTextIcon className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No notes, photos, or voice memos were added during this visit.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Date Info */}
        <p className="text-xs text-center text-slate-400 dark:text-slate-500">
          {formatVisitDate}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-4 space-y-3 shadow-lg">
        <Button
          onClick={handleSaveAndSync}
          className="w-full py-3.5 text-base font-bold"
        >
          Save & Sync
        </Button>
        <Button
          variant="ghost"
          onClick={handleDiscard}
          className="w-full py-3 text-sm text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          Discard Session
        </Button>
      </div>
    </div>
  );
}
