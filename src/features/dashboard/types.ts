export type StatTrend = "positive" | "negative" | "neutral";

export interface StatCard {
  label: string;
  value: string;
  meta: string;
  trend: StatTrend;
}