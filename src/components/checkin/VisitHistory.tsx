import * as React from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeftIcon, MicIcon, FileTextIcon, ImageIcon, InfoIcon, PlayIcon, PlusIcon } from "lucide-react";
import { useVisitsStore } from "@/stores/visitsStore";
import { usePlacesStore } from "@/stores/placesStore";
import { cn } from "@/lib/utils";
import type { VoiceMemo, Photo } from "@/lib/zod/schemas";

type FilterType = "all" | "voice" | "text";

type TimelineItem =
  | { type: "voice"; data: VoiceMemo; timestamp: Date }
  | { type: "text"; data: { content: string; tags?: string[] }; timestamp: Date }
  | { type: "photo"; data: Photo[]; timestamp: Date }
  | { type: "info"; data: { title: string; content: string }; timestamp: Date };

export function VisitHistory() {
  const { id: visitId } = useParams({ from: "/checkin/$id/history" });
  const navigate = useNavigate();
  const { visits } = useVisitsStore();
  const { getPlaceById } = usePlacesStore();

  const [filter, setFilter] = React.useState<FilterType>("all");

  const visit = React.useMemo(() => visits.find((v) => v.id === visitId), [visits, visitId]);
  const place = visit ? getPlaceById(visit.placeId) : null;

  // Group visits by place and create timeline items
  const historicalVisits = React.useMemo(() => {
    if (!visit) return [];
    return visits.filter((v) => v.placeId === visit.placeId && v.id !== visit.id);
  }, [visits, visit]);

  // Build timeline items from all visits including current
  const timelineItems = React.useMemo(() => {
    if (!visit) return [];

    const allVisits = [visit, ...historicalVisits];
    const items: TimelineItem[] = [];

    allVisits.forEach((v) => {
      // Add voice memos
      v.voiceMemos.forEach((memo) => {
        items.push({
          type: "voice",
          data: memo,
          timestamp: memo.timestamp,
        });
      });

      // Add text notes
      v.notes.forEach((note) => {
        // Extract tags from note (lines starting with #)
        const lines = note.split("\n");
        const tags = lines
          .filter((line) => line.trim().startsWith("#"))
          .map((tag) => tag.trim().replace("#", ""));
        const content = lines.filter((line) => !line.trim().startsWith("#")).join("\n");

        items.push({
          type: "text",
          data: { content, tags: tags.length > 0 ? tags : undefined },
          timestamp: new Date(v.startTime),
        });
      });

      // Add photos
      if (v.photos.length > 0) {
        items.push({
          type: "photo",
          data: v.photos,
          timestamp: new Date(v.startTime),
        });
      }
    });

    // Sort by timestamp (newest first)
    return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [visit, historicalVisits]);

  // Filter timeline items
  const filteredItems = React.useMemo(() => {
    if (filter === "all") return timelineItems;
    return timelineItems.filter((item) => item.type === filter);
  }, [timelineItems, filter]);

  // Group items by date
  const groupedByDate = React.useMemo(() => {
    const groups = new Map<string, TimelineItem[]>();
    filteredItems.forEach((item) => {
      const dateKey = item.timestamp.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(item);
    });
    return groups;
  }, [filteredItems]);

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleBack = () => {
    navigate({ to: `/checkin/${visitId}/notes` });
  };

  const handleNewNote = () => {
    navigate({ to: `/checkin/${visitId}/notes` });
  };

  const handleItemClick = (item: TimelineItem) => {
    console.log("Item clicked:", item);
    // Could open detail modal or navigate to specific view
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
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center justify-center size-10 rounded-full text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
              {place.name}
            </h2>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {place.city}, {place.category}
            </span>
          </div>
          <button className="flex items-center justify-end px-2 py-1 rounded-lg text-primary hover:bg-primary/10 transition-colors">
            <p className="text-base font-bold leading-normal tracking-[0.015em]">Edit</p>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 py-2">
        {Array.from(groupedByDate.entries()).map(([dateLabel, items]) => (
          <div key={dateLabel}>
            {/* Date Header */}
            <div className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur py-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight px-2 flex items-center gap-2">
                {isToday(items[0].timestamp) ? (
                  <span className="text-primary text-xl">📅</span>
                ) : (
                  <span className="text-slate-400 text-xl">📅</span>
                )}
                {isToday(items[0].timestamp) ? `Today - ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : dateLabel}
              </h3>
            </div>

            {/* Timeline Group */}
            <div className="ml-4 border-l-2 border-slate-200 dark:border-slate-700 pl-6 pb-2 space-y-8">
              {items.map((item, index) => (
                <TimelineItemCard key={`${item.type}-${index}`} item={item} formatTime={formatTime} onClick={() => handleItemClick(item)} />
              ))}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-slate-400 dark:text-slate-500 text-center">
              No items found for this filter
            </p>
          </div>
        )}
      </main>

      {/* Floating Action Bar */}
      <div className="absolute bottom-6 left-0 right-0 px-4 flex justify-center z-50">
        <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-[#1A2C30] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 dark:border-slate-700 backdrop-blur-xl">
          {/* Filter: All */}
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold transition-transform hover:scale-105 active:scale-95",
              filter === "all"
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            All
          </button>

          {/* Filter: Voice */}
          <button
            onClick={() => setFilter("voice")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1",
              filter === "voice"
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            <MicIcon className="h-5 w-5" />
          </button>

          {/* Filter: Text */}
          <button
            onClick={() => setFilter("text")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1",
              filter === "text"
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            <FileTextIcon className="h-5 w-5" />
          </button>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* New Button */}
          <button
            onClick={handleNewNote}
            className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-transform active:scale-95 group"
          >
            <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform" />
            New
          </button>
        </div>
      </div>
    </div>
  );
}

function TimelineItemCard({ item, formatTime, onClick }: { item: TimelineItem; formatTime: (date: Date) => string; onClick: () => void }) {
  return (
    <div className="relative group">
      {/* Timeline Dot */}
      <div className="absolute -left-[31px] top-6 size-4 rounded-full bg-primary border-[3px] border-slate-50 dark:border-slate-950 shadow-sm z-10" />

      <div
        onClick={onClick}
        className="flex flex-col gap-3 rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow cursor-pointer"
      >
        {item.type === "voice" && <VoiceMemoCard data={item.data} formatTime={formatTime} />}
        {item.type === "text" && <TextNoteCard data={item.data} formatTime={formatTime} />}
        {item.type === "photo" && <PhotoGridCard data={item.data} formatTime={formatTime} />}
        {item.type === "info" && <InfoCard data={item.data} formatTime={formatTime} />}
      </div>
    </div>
  );
}

function VoiceMemoCard({ data, formatTime }: { data: VoiceMemo; formatTime: (date: Date) => string }) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Audio playback logic would go here
  };

  return (
    <>
      {/* Meta Row */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
          <MicIcon className="h-3.5 w-3.5" />
          Voice Memo
        </div>
        <span className="text-xs text-slate-400 font-medium">{formatTime(data.timestamp)}</span>
      </div>

      {/* Player UI */}
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="flex shrink-0 items-center justify-center rounded-full size-12 bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition active:scale-95"
        >
          {isPlaying ? (
            <span className="material-symbols-outlined text-2xl ml-1">pause</span>
          ) : (
            <PlayIcon className="h-5 w-5 ml-0.5" />
          )}
        </button>
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          <p className="text-slate-900 dark:text-white text-base font-bold leading-tight truncate">Voice Memo</p>
          {/* Waveform Visualization */}
          <div className="flex items-center gap-1 h-6 w-full">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1 rounded-full",
                  i < 7 ? "bg-primary/60" : i < 9 ? "bg-primary/40" : "bg-slate-200 dark:bg-slate-700"
                )}
                style={{
                  height: `${30 + (i % 3) * 20 + Math.random() * 20}%`,
                }}
              />
            ))}
            <div className="ml-auto text-xs font-mono font-medium text-slate-500">
              {formatDuration(data.duration)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TextNoteCard({ data, formatTime }: { data: { content: string; tags?: string[] }; formatTime: (date: Date) => string }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <FileTextIcon className="h-3.5 w-3.5" />
          Note
        </div>
        <span className="text-xs text-slate-400 font-medium">{formatTime(new Date())}</span>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-1 flex flex-col justify-center gap-1">
          <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">Note</p>
          <p className="text-slate-600 dark:text-slate-300 text-sm font-normal leading-relaxed line-clamp-3">
            {data.content}
          </p>
        </div>

        {data.tags && data.tags.length > 0 && (
          <div className="flex gap-2 mt-1 flex-wrap">
            {data.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function PhotoGridCard({ data, formatTime }: { data: Photo[]; formatTime: (date: Date) => string }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <ImageIcon className="h-3.5 w-3.5" />
          Photo
        </div>
        <span className="text-xs text-slate-400 font-medium">{formatTime(new Date())}</span>
      </div>

      <div className={cn(
        "flex gap-2 overflow-hidden rounded-lg",
        data.length === 1 ? "h-32" : "h-32"
      )}>
        {data.slice(0, 3).map((photo, index) => (
          <div
            key={photo.id}
            className={cn(
              "bg-cover bg-center relative",
              data.length === 1 ? "flex-1 rounded-lg" : index === 0 ? "flex-1 rounded-l-lg" : index === data.length - 1 || index === 2 ? "flex-1 rounded-r-lg" : "flex-1"
            )}
            style={{ backgroundImage: `url(${photo.url})` }}
          >
            <div className="absolute inset-0 bg-black/10" />
          </div>
        ))}
      </div>

      <p className="text-slate-600 dark:text-slate-300 text-sm italic">
        "Reference photo"
      </p>
    </>
  );
}

function InfoCard({ data, formatTime }: { data: { title: string; content: string }; formatTime: (date: Date) => string }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <InfoIcon className="h-3.5 w-3.5" />
          Info
        </div>
        <span className="text-xs text-slate-400 font-medium">{formatTime(new Date())}</span>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-1 flex flex-col justify-center gap-1">
          <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">
            {data.title}
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-sm font-normal leading-relaxed">
            {data.content}
          </p>
        </div>
      </div>
    </>
  );
}
