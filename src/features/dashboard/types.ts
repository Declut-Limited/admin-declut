export type StatTrend = "positive" | "negative" | "neutral";

export interface StatCard {
  label: string;
  value: string;
  meta: string;
  trend: StatTrend;
}

export type CardStatus = "productive" | "warning" | "negative";

export interface DashboardCard {
  value: number;
  extra: {
    status: CardStatus;
    result: string;
  };
}

export type DashboardFilter =
  | "thisMonth"
  | "lastMonth"
  | "last3Months"
  | "thisYear"
  | "custom";

export interface DashboardCard {
  value: number;
  extra: {
    status: CardStatus;
    result: string;
  };
}

export interface DashboardCards {
  numberOfUsers: DashboardCard;
  newListings: DashboardCard;
  transactionsToday: DashboardCard;
  completedTransactions: DashboardCard;
  revenue: DashboardCard;
  escrowBalance: DashboardCard;
  pendingInspections: DashboardCard;
  openDisputes: DashboardCard;
}

export interface DashboardInsightsParams {
  filter: DashboardFilter;
  startDate?: string;
  endDate?: string;
}

export interface DashboardInsightsResponse {
  success: boolean;
  data: {
    filter: DashboardFilter;
    since: string;
    until: string;
    cards: DashboardCards;
  };
}

export interface RevenueTrendPoint {
  year: number;
  month: string;
  grossRevenue: number;
  commissionAmount: number;
}
export interface RevenueTrendInsights {
  twelveMonthGross: string;
  bestMonth: string;
  avgPerMonth: string;
  totalRemittance: string;
}

export interface RevenueTrendsResponse {
  success: boolean;
  data: {
    year: number;
    trend: RevenueTrendPoint[];
    insights: RevenueTrendInsights;
  };
}

export interface ListingsPerMonthPoint {
  month: string;
  totalListing: number;
  listingWorth: number;
}

export interface ListingsPerMonthResponse {
  success: boolean;
  data: {
    totalListingsValue: number;
    trend: ListingsPerMonthPoint[];
  };
}
export interface CategoryDistributionItem {
  category: string;
  slug: string;
  transactionCount: number;
  percentage: number;
  amount: number;
}

export interface CategoryDistributionResponse {
  success: boolean;
  data: CategoryDistributionItem[];
}

export interface RecentActivityActor {
  id: string;
  name: string;
  role: string;
}

export interface RecentActivityEntry {
  _id: string;
  slug: string;
  entityType: string;
  entityId: string;
  event: string;
  actor: RecentActivityActor | "system";
  oldState?: string;
  newState?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
  label: string;
  target: {
    type: string;
    id: string;
  };
}

export interface RecentActivityResponse {
  success: boolean;
  data: {
    entries: RecentActivityEntry[];
  };
}

export interface TransactionBreakdownSlice {
  count: number;
  percentage: number;
}

export interface TransactionBreakdownResponse {
  success: boolean;
  data: {
    total: number;
    completed: TransactionBreakdownSlice;
    awaitingInspection: TransactionBreakdownSlice;
    disputed: TransactionBreakdownSlice;
    cancelled: TransactionBreakdownSlice;
  };
}