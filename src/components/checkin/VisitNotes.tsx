import * as React from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeftIcon, MicIcon, CameraIcon, Trash2Icon, PlayIcon, PauseIcon, SaveIcon, ListIcon, TagIcon, BoldIcon } from "lucide-react";
import { useVisitsStore } from "@/stores/visitsStore";
import { usePlacesStore } from "@/stores/placesStore";
import { saveVoiceMemo, updateVoiceMemoDuration, getVoiceMemo } from "@/lib/voiceMemoStorage";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Photo } from "@/lib/zod/schemas";

export function VisitNotes() {
  const { id: visitId } = useParams({ from: "/checkin/$id/notes" });
  const navigate = useNavigate();
  const { activeVisit, updateActiveVisit, addVoiceMemoToVisit, addPhotoToVisit, endVisit } = useVisitsStore();
  const { getPlaceById } = usePlacesStore();

  const [notes, setNotes] = React.useState("");
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingDuration, setRecordingDuration] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [sessionDuration, setSessionDuration] = React.useState(0);
  const [photos, setPhotos] = React.useState<Photo[]>([]);
  const [showCamera, setShowCamera] = React.useState(false);
  const [isRecordingReleased, setIsRecordingReleased] = React.useState(false);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const recordingTimerRef = React.useRef<number | null>(null);
  const sessionTimerRef = React.useRef<number | null>(null);

  const visit = activeVisit?.id === visitId ? activeVisit : null;
  const place = visit ? getPlaceById(visit.placeId) : null;

  // Load existing data from visit
  React.useEffect(() => {
    if (visit) {
      setNotes(visit.notes.join("\n"));
      setPhotos(visit.photos);
    }
  }, [visit]);

  // Session timer
  React.useEffect(() => {
    if (!isPaused && visit) {
      sessionTimerRef.current = window.setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    } else if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, [isPaused, visit]);

  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Format visit start time
  const formatVisitTime = React.useMemo(() => {
    if (!visit?.startTime) return "";
    return new Date(visit.startTime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }, [visit?.startTime]);

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const result = await saveVoiceMemo(audioBlob, visitId);

        if (result.success) {
          await updateVoiceMemoDuration(result.id, recordingDuration);
          const voiceMemo = await getVoiceMemo(result.id);
          if (voiceMemo) {
            addVoiceMemoToVisit(visitId, voiceMemo);
          }
        }

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      setIsRecordingReleased(false);

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsRecordingReleased(true);

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      // Reset released state after a short delay
      setTimeout(() => setIsRecordingReleased(false), 500);
    }
  };

  // Handle text formatting
  const handleFormat = (type: "bullet" | "bold" | "tag") => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = notes.substring(start, end);
    let newText = notes;

    switch (type) {
      case "bullet":
        newText = notes.substring(0, start) + "• " + selectedText + notes.substring(end);
        break;
      case "bold":
        newText = notes.substring(0, start) + "**" + selectedText + "**" + notes.substring(end);
        break;
      case "tag":
        newText = notes.substring(0, start) + "#" + selectedText + notes.substring(end);
        break;
    }

    setNotes(newText);
    saveNotesToVisit(newText);
  };

  // Save notes to visit
  const saveNotesToVisit = (noteText: string) => {
    const noteLines = noteText.split("\n").filter((line) => line.trim());
    updateActiveVisit({ notes: noteLines });
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    saveNotesToVisit(value);
  };

  const handleSave = () => {
    saveNotesToVisit(notes);
  };

  // Photo capture
  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(video, 0, 0);

        canvas.toBlob(async (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const photo: Photo = {
              id: crypto.randomUUID(),
              url,
              timestamp: new Date(),
            };
            setPhotos((prev) => [...prev, photo]);
            addPhotoToVisit(visitId, photo);
          }
          stream.getTracks().forEach((track) => track.stop());
          setShowCamera(false);
        }, "image/jpeg", 0.8);
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
      setShowCamera(false);
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter((p) => p.id !== photoId);
    setPhotos(updatedPhotos);
    updateActiveVisit({ photos: updatedPhotos });
  };

  // Pause/Resume session
  const handlePauseResume = () => {
    setIsPaused((prev) => !prev);
  };

  // Finish session
  const handleFinishSession = () => {
    updateActiveVisit({
      notes: notes.split("\n").filter((line) => line.trim()),
      photos,
    });
    endVisit(visitId);

    // Navigate to VisitSummary
    navigate({ to: `/checkin/${visitId}/summary` });
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="flex items-center gap-1.5"
            >
              <SaveIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Save</span>
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {place.name}
          </h1>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {formatVisitTime} • {formatDuration(sessionDuration)}
            </p>
            <button
              onClick={handlePauseResume}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                isPaused
                  ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300"
                  : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
              )}
            >
              {isPaused ? (
                <>
                  <PlayIcon className="h-4 w-4" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <PauseIcon className="h-4 w-4" />
                  <span>Pause</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-6 pb-24">
        {/* Voice Recorder Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Voice Memo
          </h2>

          <div className="flex flex-col items-center gap-4">
            {/* Waveform Animation */}
            {(isRecording || isRecordingReleased) && (
              <div className="flex items-center justify-center gap-1 h-16 w-full">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1 bg-cyan-500 rounded-full transition-all duration-150",
                      isRecording ? "animate-pulse" : "h-2"
                    )}
                    style={{
                      height: isRecording ? `${20 + Math.random() * 40}px` : "8px",
                      animationDelay: `${i * 50}ms`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Recording Timer */}
            {(isRecording || isRecordingReleased) && (
              <p className="text-2xl font-mono font-bold text-cyan-600 dark:text-cyan-400">
                {formatDuration(recordingDuration)}
              </p>
            )}

            {/* Hold-to-Record Button */}
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              onTouchStart={(e) => {
                e.preventDefault();
                startRecording();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                stopRecording();
              }}
              disabled={isPaused}
              className={cn(
                "flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-base transition-all active:scale-[0.98]",
                isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                  : "bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20",
                isPaused && "opacity-50 cursor-not-allowed"
              )}
            >
              <MicIcon className="h-5 w-5" />
              <span>{isRecording ? "Release to Stop" : "Hold to Record"}</span>
            </button>

            <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
              {isPaused ? "Session paused - cannot record" : "Hold button to record voice memo"}
            </p>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
            Field Notes
          </h2>

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-700">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleFormat("bullet")}
              className="flex items-center gap-1.5"
            >
              <ListIcon className="h-3.5 w-3.5" />
              <span className="text-xs">Bullet</span>
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleFormat("bold")}
              className="flex items-center gap-1.5"
            >
              <BoldIcon className="h-3.5 w-3.5" />
              <span className="text-xs">Bold</span>
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleFormat("tag")}
              className="flex items-center gap-1.5"
            >
              <TagIcon className="h-3.5 w-3.5" />
              <span className="text-xs">Tag</span>
            </Button>
          </div>

          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add notes about your visit..."
            className="w-full min-h-[150px] p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          />
        </div>

        {/* Photo Capture Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Photos ({photos.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCamera(!showCamera)}
              className="flex items-center gap-1.5"
              disabled={isPaused}
            >
              <CameraIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Add Photo</span>
            </Button>
          </div>

          {showCamera && (
            <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Camera access required for photo capture
              </p>
              <Button
                onClick={handleCameraCapture}
                className="w-full"
              >
                Capture Photo
              </Button>
            </div>
          )}

          {/* Photo Thumbnails */}
          {photos.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                >
                  <img
                    src={photo.url}
                    alt="Visit photo"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                  >
                    <Trash2Icon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {photos.length === 0 && !showCamera && (
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">
              No photos yet. Tap "Add Photo" to capture one.
            </p>
          )}
        </div>
      </div>

      {/* Finish Session Button */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-4 shadow-lg">
        <Button
          onClick={handleFinishSession}
          className="w-full py-3.5 text-base font-bold"
        >
          Finish Session
        </Button>
      </div>
    </div>
  );
}
