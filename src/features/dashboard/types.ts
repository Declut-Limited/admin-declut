export type StatTrend = "positive" | "negative" | "neutral";

export interface StatCard {
  label: string;
  value: string;
  meta: string;
  trend: StatTrend;
}

export type DashboardPeriod = "today" | "week" | "month" | "year" | "all";

export type CardStatus = "productive" | "warning" | "negative";

export interface DashboardCard {
  value: number;
  extra: {
    status: CardStatus;
    result: string;
  };
}

export interface DashboardCards {
  newUsers: DashboardCard;
  activeListings: DashboardCard;
  totalTransactions: DashboardCard;
  completedTransactions: DashboardCard;
  totalRevenue: DashboardCard;
  avgOrderValue: DashboardCard;
  disputedTransactions: DashboardCard;
  stalledTransactions: DashboardCard;
}

export interface DashboardInsightsResponse {
  success: boolean;
  data: {
    period: DashboardPeriod;
    cards: DashboardCards;
  };
}