import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useDealsStore } from "@/stores/dealsStore";
import { usePlacesStore } from "@/stores/placesStore";
import { useContactsStore } from "@/stores/contactsStore";
import { type DealStatus, type Deal } from "@/lib/zod/schemas";
import { DollarSignIcon, MessageCircleIcon, MoreHorizontalIcon, GitCompareArrowsIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DealStatusPicker } from "./DealStatusPicker";

const STAGES: Array<{ status: DealStatus; label: string }> = [
  { status: "lead", label: "Lead" },
  { status: "contacted", label: "Contacted" },
  { status: "negotiation", label: "Negotiation" },
  { status: "confirmed", label: "Confirmed" },
  { status: "delivered", label: "Delivered" },
  { status: "paid", label: "Paid" },
  { status: "lost", label: "Lost" },
];

export function Pipeline() {
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = useState<DealStatus>("lead");
  const { deals } = useDealsStore();
  const { places } = usePlacesStore();
  const { contacts } = useContactsStore();

  const stageDeals = deals.filter((d) => d.status === selectedStage);

  const getPlaceName = (placeId?: string) => {
    const place = places.find((p) => p.id === placeId);
    return place?.name || "Unknown Place";
  };

  const getContactName = (contactId?: string) => {
    const contact = contacts.find((c) => c.id === contactId);
    return contact?.name || "Unknown Contact";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background pb-2 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex overflow-x-auto px-4 gap-6">
          {STAGES.map((stage) => {
            const count = deals.filter((d) => d.status === stage.status).length;
            return (
              <button
                key={stage.status}
                onClick={() => setSelectedStage(stage.status)}
                className={cn(
                  "flex flex-col items-center pb-3 gap-2 group min-w-[max-content] transition-colors",
                  selectedStage === stage.status
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300"
                )}
              >
                <span
                  className={cn(
                    "text-sm tracking-wide",
                    selectedStage === stage.status ? "font-bold" : "font-medium"
                  )}
                >
                  {stage.label} ({count})
                </span>
                <div
                  className={cn(
                    "h-0.5 w-full rounded-full",
                    selectedStage === stage.status
                      ? "bg-primary shadow-[0_0_8px_rgba(19,200,236,0.6)]"
                      : "bg-transparent"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {stageDeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-xl bg-card flex items-center justify-center mb-4">
              <DollarSignIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No deals in {STAGES.find((s) => s.status === selectedStage)?.label?.toLowerCase()}
            </h3>
            <p className="text-sm text-muted-foreground">
              Create your first deal to start tracking your collaborations
            </p>
          </div>
        ) : (
          stageDeals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              placeName={getPlaceName(deal.placeId)}
              contactName={getContactName(deal.contactId)}
            />
          ))
        )}
      </div>

      {/* FAB for creating new deal */}
      <button
        onClick={() => navigate({ to: "/deals/new" })}
        className="fixed bottom-24 right-4 z-30 size-14 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-900/30 dark:shadow-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
      >
        <Plus className="h-8 w-8" />
      </button>
    </div>
  );
}

function DealCard({ deal, placeName, contactName }: { deal: Deal; placeName: string; contactName: string }) {
  const navigate = useNavigate();
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const formatCurrency = (value?: number) => {
    if (!value) return "TBD";
    return `$${(value / 1000).toFixed(1)}k`;
  };

  const getTimeAgo = (date?: Date) => {
    const now = new Date();
    if (typeof date === "string") {
      date = new Date(date);
    }
    const diff = date ? now.getTime() - date.getTime() : 0;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  const handleCardClick = () => {
    navigate({ to: `/deals/${deal.id}` });
  };

  const handleStatusButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowStatusPicker(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="flex flex-col rounded-xl bg-card border border-slate-100 dark:border-slate-700/50 p-4 shadow-lg active:scale-[0.98] transition-transform cursor-pointer"
      >
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 shrink-0 rounded-lg bg-gradient-to-br from-primary to-[#0ea5c6] flex items-center justify-center text-white text-2xl font-bold shadow-inner">
            {placeName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between h-20 py-0.5">
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
                  {deal.title}
                </h3>
                <span className="text-[10px] font-medium text-primary uppercase tracking-wider">
                  {getTimeAgo(deal.createdAt)}
                </span>
              </div>
              <p className="text-muted-foreground text-sm font-normal truncate">
                {placeName}
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto gap-2">
              {contactName && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageCircleIcon className="h-3.5 w-3.5" />
                  <span className="text-xs">
                    {contactName}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 text-primary font-bold text-base">
                <DollarSignIcon className="h-5 w-5" />
                <span>{formatCurrency(deal.estimatedValue)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MessageCircleIcon className="h-4.5 w-4.5" />
            <span className="text-xs">Drafting email</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleStatusButtonClick}
              className="text-primary font-medium text-sm hover:text-primary/90 transition-colors flex items-center gap-1"
            >
              <GitCompareArrowsIcon className="h-3.5 w-3.5" />
              Change Status
            </button>
            <button className="text-muted-foreground hover:text-slate-900 dark:hover:text-white transition-colors">
              <MoreHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <DealStatusPicker
        dealId={deal.id}
        currentStatus={deal.status}
        open={showStatusPicker}
        onOpenChange={setShowStatusPicker}
      />
    </>
  );
}
