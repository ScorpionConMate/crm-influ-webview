import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useDealsStore } from "@/stores/dealsStore";
import { type DealStatus } from "@/lib/zod/schemas";
import { cn } from "@/lib/utils";
import {
  UserSearchIcon,
  MailIcon,
  GitCompareArrowsIcon,
  CheckCircle2Icon,
  RocketIcon,
  DollarSignIcon,
  XCircleIcon,
  CheckIcon,
} from "lucide-react";

interface DealStatusPickerProps {
  dealId: string;
  currentStatus: DealStatus;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_OPTIONS: Array<{
  status: DealStatus;
  label: string;
  icon: React.ElementType;
}> = [
  { status: "lead", label: "Lead", icon: UserSearchIcon },
  { status: "contacted", label: "Contacted", icon: MailIcon },
  { status: "negotiation", label: "Negotiation", icon: GitCompareArrowsIcon },
  { status: "confirmed", label: "Confirmed", icon: CheckCircle2Icon },
  { status: "delivered", label: "Delivered", icon: RocketIcon },
  { status: "paid", label: "Paid", icon: DollarSignIcon },
  { status: "lost", label: "Lost", icon: XCircleIcon },
];

export function DealStatusPicker({ dealId, currentStatus, open, onOpenChange }: DealStatusPickerProps) {
  const { updateDeal } = useDealsStore();
  const [selectedStatus, setSelectedStatus] = useState<DealStatus>(currentStatus);
  const [lostReason, setLostReason] = useState("");

  const handleStatusChange = (status: DealStatus) => {
    setSelectedStatus(status);

    if (status === "lost") {
      return;
    }

    updateDeal(dealId, { status });
    setLostReason("");
    onOpenChange(false);
  };

  const handleLostConfirm = () => {
    if (selectedStatus === "lost") {
      updateDeal(dealId, { status: selectedStatus, lostReason: lostReason || undefined });
      setLostReason("");
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus(currentStatus);
    setLostReason("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="fixed bottom-0 top-auto left-0 right-0 max-w-none translate-x-0 translate-y-0 rounded-t-3xl pb-6">
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full mx-auto mb-6" />
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left text-lg font-bold text-slate-900 dark:text-white">
            Move Deal To...
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-2">
          {STATUS_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedStatus === option.status;
            const isCurrent = currentStatus === option.status;

            return (
              <button
                key={option.status}
                onClick={() => handleStatusChange(option.status)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 text-left group",
                  isSelected && option.status === "lost"
                    ? "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
                    : isSelected
                    ? "bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800"
                    : isCurrent
                    ? "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    isSelected && option.status === "lost"
                      ? "bg-red-500 text-white"
                      : isSelected
                      ? "bg-cyan-500 text-white"
                      : isCurrent
                      ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span
                    className={cn(
                      "font-medium block",
                      isSelected && option.status === "lost"
                        ? "text-red-700 dark:text-red-400"
                        : isSelected
                        ? "text-cyan-700 dark:text-cyan-400"
                        : "text-slate-900 dark:text-white"
                    )}
                  >
                    {option.label}
                  </span>
                  {isCurrent && !isSelected && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">Current Stage</span>
                  )}
                </div>
                {(isSelected || isCurrent) && (
                  <CheckIcon
                    className={cn(
                      "w-5 h-5",
                      isSelected && option.status === "lost"
                        ? "text-red-500"
                        : isSelected
                        ? "text-cyan-500"
                        : "text-slate-400"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>

        {selectedStatus === "lost" && (
          <div className="mt-4 space-y-3">
            <label
              htmlFor="lost-reason"
              className="block text-sm font-medium text-slate-900 dark:text-white"
            >
              Why was this deal lost?
            </label>
            <Input
              id="lost-reason"
              type="text"
              placeholder="e.g., Budget constraints, Timing..."
              value={lostReason}
              onChange={(e) => setLostReason(e.target.value)}
              className="w-full"
            />
            <div className="flex gap-2">
              <AlertDialogCancel
                onClick={handleClose}
                className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </AlertDialogCancel>
              <button
                onClick={handleLostConfirm}
                className="flex-1 h-9 px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Lost
              </button>
            </div>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
