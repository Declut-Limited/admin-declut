export const escrowClass: Record<string, string> = {
  held: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  released: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  refunded: "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
};

export const inspectionClass: Record<string, string> = {
  awaiting: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  completed:
    "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  failed: "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
};

export const statusPillClass: Record<string, string> = {
  pending_payment:
    "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  escrow_active:
    "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  awaiting_inspection:
    "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  resolved: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  completed: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  refunded: "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
  disputed: "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
  under_investigation:
    "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
  stalled: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  cancelled:
    "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
};

export const statusFallback =
  "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800";

export const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function formatLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatCountdown(deadline: string | null | undefined) {
  if (!deadline) return null;
  const target = new Date(deadline).getTime();
  if (Number.isNaN(target)) return null;

  const diffMs = target - Date.now();
  if (diffMs <= 0) return { label: "Expired", hours: 0 };

  const hours = Math.floor(diffMs / 3_600_000);
  const minutes = Math.floor((diffMs % 3_600_000) / 60_000);

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return { label: `${days}d ${hours % 24}h`, hours };
  }
  return { label: `${hours}h ${minutes}m`, hours };
}
