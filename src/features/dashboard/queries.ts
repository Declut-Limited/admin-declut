import { useQuery } from "@tanstack/react-query";
import { getDashboardInsights } from "./api";
import type { DashboardPeriod } from "./types";

export const useDashboardInsights = (period: DashboardPeriod) => {
  return useQuery({
    queryKey: ["dashboard", "insights", period],
    queryFn: () => getDashboardInsights(period),
    select: (res) => res.data,
  });
};