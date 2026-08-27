import { useQuery } from "@tanstack/react-query";
import { getCategoryDistribution, getDashboardInsights, getListingsPerMonth, getRecentActivity, getRevenueTrends, getTransactionBreakdown } from "./api";
import type { DashboardInsightsParams } from "./types";

export const useDashboardInsights = (params: DashboardInsightsParams) => {
  const isIncompleteCustom =
    params.filter === "custom" && (!params.startDate || !params.endDate);

  return useQuery({
    queryKey: ["dashboard", "insights", params],
    queryFn: () => getDashboardInsights(params),
    enabled: !isIncompleteCustom,
    select: (res) => res.data,
  });
};

export const useRevenueTrends = (year: number) => {
  return useQuery({
    queryKey: ["dashboard", "revenue-trends", year],
    queryFn: () => getRevenueTrends(year),
    select: (res) => res.data,
  });
};

export const useListingsPerMonth = () => {
  return useQuery({
    queryKey: ["dashboard", "listings-per-month"],
    queryFn: getListingsPerMonth,
    select: (res) => res.data,
  });
};

export const useCategoryDistribution = () => {
  return useQuery({
    queryKey: ["dashboard", "category-distribution"],
    queryFn: getCategoryDistribution,
    select: (res) => res.data,
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ["dashboard", "recent-activity"],
    queryFn: getRecentActivity,
    select: (res) => res.data.entries,
  });
};

export const useTransactionBreakdown = () => {
  return useQuery({
    queryKey: ["dashboard", "transaction-breakdown"],
    queryFn: getTransactionBreakdown,
    select: (res) => res.data,
  });
};