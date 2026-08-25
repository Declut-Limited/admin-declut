import { api } from "@/lib/api/client";
import type { DashboardInsightsResponse, DashboardPeriod } from "./types";

export const getDashboardInsights = async (period: DashboardPeriod): Promise<DashboardInsightsResponse> => {
  const { data } = await api.get("/admin/dashboard/insights", { params: { period } });
  return data;
};