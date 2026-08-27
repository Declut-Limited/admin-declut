import { api } from "@/lib/api/client";
import type {
  CategoryDistributionResponse,
  DashboardInsightsParams,
  DashboardInsightsResponse,
  ListingsPerMonthResponse,
  RecentActivityResponse,
  RevenueTrendsResponse,
  TransactionBreakdownResponse,
} from "./types";

export const getDashboardInsights = async (
  params: DashboardInsightsParams,
): Promise<DashboardInsightsResponse> => {
  const { data } = await api.get("/admin/dashboard/insights", { params });
  return data;
};

export const getRevenueTrends = async (
  year: number,
): Promise<RevenueTrendsResponse> => {
  const { data } = await api.get("/admin/dashboard/revenue-trends", {
    params: { year },
  });
  return data;
};

export const getListingsPerMonth =
  async (): Promise<ListingsPerMonthResponse> => {
    const { data } = await api.get("/admin/dashboard/listings-per-month");
    return data;
  };

export const getCategoryDistribution =
  async (): Promise<CategoryDistributionResponse> => {
    const { data } = await api.get("/admin/dashboard/category-distribution");
    return data;
  };

export const getRecentActivity = async (): Promise<RecentActivityResponse> => {
  const { data } = await api.get("/admin/dashboard/recent-activity");
  return data;
};

export const getTransactionBreakdown =
  async (): Promise<TransactionBreakdownResponse> => {
    const { data } = await api.get("/admin/dashboard/transaction-breakdown");
    return data;
  };
