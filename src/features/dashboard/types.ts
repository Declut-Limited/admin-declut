export type StatTrend = "positive" | "negative" | "neutral";

export interface StatCard {
  label: string;
  value: string;
  meta: string;
  trend: StatTrend;
}

export type DashboardPeriod = "today" | "week" | "month" | "year" | "all";

export interface DashboardCards {
  newUsers: number;
  activeListings: number;
  totalTransactions: number;
  completedTransactions: number;
  totalRevenue: number;
  avgOrderValue: number;
  disputedTransactions: number;
  stalledTransactions: number;
}

export interface DashboardInsightsResponse {
  success: boolean;
  data: {
    period: DashboardPeriod;
    cards: DashboardCards;
  };
}
