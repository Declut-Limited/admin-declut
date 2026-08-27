import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import type { StatCard } from "../types";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { IconType } from "react-icons";
import { IoArrowUpCircle } from "react-icons/io5";
import { TbAlertCircleFilled } from "react-icons/tb";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import orangeLegend from "../../../assets/icons/OrangeLegendNode.svg";
import blueLegend from "../../../assets/icons/BlueLegendNode.svg";
import calendar from "../../../assets/icons/calendar.svg";
import { LuDot } from "react-icons/lu";
import logo from "../../../assets/icons/logo.svg";
import { useMe } from "@/features/auth/queries";
import Skeleton from "@/components/generic/Skeleton";
import {
  useCategoryDistribution,
  useDashboardInsights,
  useListingsPerMonth,
  useRecentActivity,
  useRevenueTrends,
  useTransactionBreakdown,
} from "../queries";
import type {
  DashboardFilter,
  DashboardCards,
  CardStatus,
} from "@/features/dashboard/types";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const trendConfig: Record<StatCard["trend"], { icon: IconType; text: string }> =
  {
    positive: {
      icon: IoArrowUpCircle,
      text: "text-green-600 dark:text-green-400",
    },
    negative: {
      icon: TbAlertCircleFilled,
      text: "text-red-600 dark:text-red-400",
    },
    neutral: {
      icon: TbAlertCircleFilled,
      text: "text-amber-600 dark:text-amber-400",
    },
  };

const periodOptions: { label: string; value: DashboardFilter }[] = [
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Last 3 Months", value: "last3Months" },
  { label: "This Year", value: "thisYear" },
  { label: "Custom Range", value: "custom" },
];

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const statusToTrend: Record<CardStatus, StatCard["trend"]> = {
  productive: "positive",
  warning: "neutral",
  negative: "negative",
};

function buildStats(cards: DashboardCards): StatCard[] {
  return [
    {
      label: "Revenue",
      value: currencyFormatter.format(cards.revenue.value),
      meta: cards.revenue.extra.result,
      trend: statusToTrend[cards.revenue.extra.status] ?? "neutral",
    },
    {
      label: "Escrow Balance",
      value: currencyFormatter.format(cards.escrowBalance.value),
      meta: cards.escrowBalance.extra.result,
      trend: statusToTrend[cards.escrowBalance.extra.status] ?? "neutral",
    },
    {
      label: "Transactions Today",
      value: cards.transactionsToday.value.toLocaleString(),
      meta: cards.transactionsToday.extra.result,
      trend: statusToTrend[cards.transactionsToday.extra.status] ?? "neutral",
    },
    {
      label: "Completed Transactions",
      value: cards.completedTransactions.value.toLocaleString(),
      meta: cards.completedTransactions.extra.result,
      trend:
        statusToTrend[cards.completedTransactions.extra.status] ?? "neutral",
    },
    {
      label: "Pending Inspections",
      value: cards.pendingInspections.value.toLocaleString(),
      meta: cards.pendingInspections.extra.result,
      trend: statusToTrend[cards.pendingInspections.extra.status] ?? "neutral",
    },
    {
      label: "Open Disputes",
      value: cards.openDisputes.value.toLocaleString(),
      meta: cards.openDisputes.extra.result,
      trend: statusToTrend[cards.openDisputes.extra.status] ?? "neutral",
    },
    {
      label: "Number of Users",
      value: cards.numberOfUsers.value.toLocaleString(),
      meta: cards.numberOfUsers.extra.result,
      trend: statusToTrend[cards.numberOfUsers.extra.status] ?? "neutral",
    },
    {
      label: "New Listings",
      value: cards.newListings.value.toLocaleString(),
      meta: cards.newListings.extra.result,
      trend: statusToTrend[cards.newListings.extra.status] ?? "neutral",
    },
  ];
}

const MIN_YEAR = 2000;
const MAX_YEAR = 2100;

const TRANSACTION_SLICE_META = [
  { key: "completed", name: "Completed", color: "#6366F1" },
  { key: "awaitingInspection", name: "Awaiting Inspection", color: "#A78BFA" },
  { key: "disputed", name: "Disputed", color: "#22D3EE" },
  { key: "cancelled", name: "Cancelled", color: "#F59E0B" },
] as const;

function formatCompactNumber(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return `${value}`;
}

function formatNaira(value: number) {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(0)}M`;
  return `₦${value}`;
}

function formatActivityTimestamp(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const datePart = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return `${datePart} at ${timePart}`;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function DashboardPage() {
  const { data: me, isLoading } = useMe();
  const navigate = useNavigate();
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [period, setPeriod] = useState<DashboardFilter>("thisMonth");
  const [customRange, setCustomRange] = useState<DateRange>({
    from: "",
    to: "",
  });

  const {
    data: insights,
    isLoading: insightsLoading,
    isError: insightsError,
    refetch: refetchInsights,
    error: insightsErrorObj,
  } = useDashboardInsights({
    filter: period,
    ...(period === "custom" && customRange.from && customRange.to
      ? { startDate: customRange.from, endDate: customRange.to }
      : {}),
  });

  const stats = insights ? buildStats(insights.cards) : [];
  const periodLabel =
    periodOptions.find((o) => o.value === period)?.label ?? "";
  const awaitingCustomRange =
    period === "custom" && (!customRange.from || !customRange.to);
  const [periodOpen, setPeriodOpen] = useState(false);

  const [chartYear, setChartYear] = useState(new Date().getFullYear());

  const {
    data: revenueTrends,
    isLoading: revenueLoading,
    isError: revenueError,
    refetch: refetchRevenue,
    error: revenueErrorObj,
  } = useRevenueTrends(chartYear);

  const revenueData = useMemo(
    () =>
      (revenueTrends?.trend ?? []).map((point) => ({
        month: point.month.charAt(0).toUpperCase() + point.month.slice(1),
        gross: point.grossRevenue,
        commission: point.commissionAmount,
      })),
    [revenueTrends],
  );

  const {
    data: listingsPerMonth,
    isLoading: listingsLoading,
    isError: listingsError,
    refetch: refetchListings,
    error: listingsErrorObj,
  } = useListingsPerMonth();

  const listingsData = useMemo(
    () =>
      (listingsPerMonth?.trend ?? []).map((point) => ({
        month: point.month.charAt(0).toUpperCase() + point.month.slice(1),
        listings: point.totalListing,
        worth: point.listingWorth,
      })),
    [listingsPerMonth],
  );

  const totalListingsCount = useMemo(
    () =>
      (listingsPerMonth?.trend ?? []).reduce(
        (sum, point) => sum + point.totalListing,
        0,
      ),
    [listingsPerMonth],
  );

  const {
    data: categoryDistributionData,
    isLoading: categoryLoading,
    isError: categoryError,
    refetch: refetchCategory,
    error: categoryErrorObj,
  } = useCategoryDistribution();

  const categoryDistribution = useMemo(() => {
    const items = categoryDistributionData ?? [];

    return items.map((item) => ({
      label: item.category,
      transactions: `${item.transactionCount.toLocaleString()} transaction${
        item.transactionCount === 1 ? "" : "s"
      }`,
      value: formatNaira(item.amount),
      percent: `${item.percentage}%`,
      progress: item.percentage,
    }));
  }, [categoryDistributionData]);

  const totalContributionValue = useMemo(
    () =>
      (categoryDistributionData ?? []).reduce(
        (sum, item) => sum + item.amount,
        0,
      ),
    [categoryDistributionData],
  );

  const {
    data: recentActivity = [],
    isLoading: activityLoading,
    isError: activityError,
    refetch: refetchActivity,
    error: activityErrorObj,
  } = useRecentActivity();

  const {
    data: transactionBreakdown,
    isLoading: breakdownLoading,
    isError: breakdownError,
    refetch: refetchBreakdown,
    error: breakdownErrorObj,
  } = useTransactionBreakdown();

  const transactionStatus = useMemo(
    () =>
      TRANSACTION_SLICE_META.map((meta) => ({
        name: meta.name,
        value: transactionBreakdown?.[meta.key].count ?? 0,
        percentage: transactionBreakdown?.[meta.key].percentage ?? 0,
        color: meta.color,
      })),
    [transactionBreakdown],
  );

  const totalTransactions = transactionBreakdown?.total ?? 0;

  const ref = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setPeriodOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        quickActionsRef.current &&
        !quickActionsRef.current.contains(e.target as Node)
      )
        setQuickActionsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName = me?.name ?? "";

  return (
    <React.Fragment>
      {/* greeting */}
      <div
        className="rounded-xl flex justify-between items-center px-6 py-5"
        style={{ background: "linear-gradient(135deg, #D19E00, #2563EB)" }}
      >
        {/* text */}
        <div className="flex flex-col gap-1 text-white">
          <span className="font-bold text-2xl flex gap-1 tracking-wide">
            <p className="text-[#DDDFFF]">{getGreeting()},</p>{" "}
            {isLoading ? (
              <Skeleton className="h-6 w-24 bg-white/20" />
            ) : (
              `${userName}!`
            )}
          </span>
          <p className="text-[15px] text-white/90 tracking-wide">
            Here's what's happening across Declut today.
          </p>
        </div>

        {/* quick actions */}
        <div className="relative" ref={quickActionsRef}>
          <button
            onClick={() => setQuickActionsOpen((o) => !o)}
            className="tracking-wide flex items-center gap-2 bg-white text-[#454545] text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Quick Actions
            <IoMdArrowDropdown
              className={`w-4 h-4 text-[#6D6D6D] transition-transform ${quickActionsOpen ? "rotate-180" : ""}`}
            />
          </button>

          {quickActionsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                Add User
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                New Listing
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                Export Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* stats */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-[#888888] dark:text-gray-400">
            Showing data for:{" "}
            <span className="font-medium text-[#454545] dark:text-gray-100">
              {periodLabel}
            </span>
          </p>

          <div className="flex items-center gap-2">
            {period === "custom" && (
              <DateRangeFilter value={customRange} onChange={setCustomRange} />
            )}

            <div className="relative" ref={ref}>
              <button
                className="period-filter-trigger cursor-pointer"
                onClick={() => setPeriodOpen((o) => !o)}
              >
                <img src={calendar} alt="calendar" className="w-4 h-4" />
                {periodLabel}
                <FiChevronDown
                  className={`w-4 h-4 transition-transform ${periodOpen ? "rotate-180" : ""}`}
                />
              </button>

              {periodOpen && (
                <div className="period-filter-dropdown">
                  {periodOptions.map((option) => (
                    <button
                      key={option.value}
                      className="period-filter-option"
                      onClick={() => {
                        setPeriod(option.value);
                        setPeriodOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="stats-grid">
          {awaitingCustomRange ? (
            <div className="col-span-full flex items-center justify-center py-10 bg-[#FAFAFA] dark:bg-[#FFFFE71A] rounded-md">
              <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                Pick a start and end date to see insights.
              </p>
            </div>
          ) : insightsError ? (
            <div className="col-span-full flex flex-col items-center justify-center gap-2 py-10 bg-[#FAFAFA] dark:bg-[#FFFFE71A] rounded-md">
              <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                {getApiErrorMessage(
                  insightsErrorObj,
                  "Couldn't load insights for this period.",
                )}
              </p>
              <button
                onClick={() => refetchInsights()}
                className="text-sm text-brand-blue hover:underline cursor-pointer"
              >
                Try again
              </button>
            </div>
          ) : insightsLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="stats-card">
                <div className="bg-[#FAFAFA] rounded-md p-2 dark:bg-[#FFFFE71A]">
                  <Skeleton className="h-3 w-24 mb-2" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="stats-card-meta">
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))
          ) : (
            stats.map((stat) => (
              <div key={stat.label} className="stats-card">
                <div className="bg-[#FAFAFA] rounded-md p-2 dark:bg-[#FFFFE71A]">
                  <p className="stats-card-label">{stat.label}</p>
                  <p className="stats-card-value">{stat.value}</p>
                </div>

                <div className="stats-card-meta">
                  {(() => {
                    const { icon: Icon, text } = trendConfig[stat.trend];
                    return (
                      <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                        <Icon className={`w-4 h-4 ${text}`} />
                      </span>
                    );
                  })()}
                  <span>{stat.meta}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* revenue trend */}
      <div className="chart-card mt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase">
            Revenue Trend
          </p>

          <div className="chart-toggle-group">
            <button
              onClick={() => setChartYear((y) => Math.max(MIN_YEAR, y - 1))}
              disabled={chartYear <= MIN_YEAR}
              className="chart-toggle-option text-[#888888] dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous year"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button className="chart-toggle-option bg-[#ECEEFF] dark:bg-gray-900 text-[#562AD8] dark:text-indigo-400">
              {chartYear}
            </button>
            <button
              onClick={() => setChartYear((y) => Math.min(MAX_YEAR, y + 1))}
              disabled={chartYear >= MAX_YEAR}
              className="chart-toggle-option text-[#888888] dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next year"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="chart-container">
          {revenueError ? (
            <div className="flex flex-col items-center justify-center gap-2 h-65">
              <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                {getApiErrorMessage(
                  revenueErrorObj,
                  `Couldn't load revenue trends for ${chartYear}.`,
                )}
              </p>
              <button
                onClick={() => refetchRevenue()}
                className="text-sm text-brand-blue hover:underline cursor-pointer"
              >
                Try again
              </button>
            </div>
          ) : revenueLoading ? (
            <Skeleton className="h-65 w-full rounded-md" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="grossGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="commissionGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatNaira}
                  tick={{ fontSize: 12, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip formatter={(value) => formatNaira(Number(value))} />

                <Area
                  type="monotone"
                  dataKey="commission"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#commissionGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="gross"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="url(#grossGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <img src={orangeLegend} alt="legend" />
              Gross Revenue
            </div>
            {/* TODO: the API returns a single `revenue` series — no commission split yet */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <img src={blueLegend} alt="legend" /> Commission
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div>
              <p className="chart-stat-label">12-Month Gross</p>
              <p className="chart-stat-value">
                {revenueTrends?.insights.twelveMonthGross ?? "—"}
              </p>
            </div>
            <div>
              <p className="chart-stat-label">Best Month</p>
              <p className="chart-stat-value">
                {revenueTrends?.insights.bestMonth ?? "—"}
              </p>
            </div>
            <div>
              <p className="chart-stat-label">Avg./Month</p>
              <p className="chart-stat-value">
                {revenueTrends?.insights.avgPerMonth ?? "—"}
              </p>
            </div>
            <div>
              <p className="chart-stat-label">Total Remittance</p>
              <p className="chart-stat-value">
                {revenueTrends?.insights.totalRemittance ?? "—"}{" "}
                {/* TODO: no month-over-month delta in the API response */}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* listings per month */}
      <div className="chart-card mt-6">
        <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-4">
          Listings Per Month
        </p>

        <div className="chart-container">
          <p className="chart-total-label">No. Of Listings</p>
          <p className="chart-total-value pb-4 border-b border-gray-200 dark:border-gray-800">
            {listingsPerMonth ? totalListingsCount.toLocaleString() : "—"}
            <span className="text-green-500 text-xs font-normal">
              {listingsPerMonth
                ? `${formatNaira(listingsPerMonth.totalListingsValue)} total worth`
                : ""}
            </span>
          </p>

          {listingsError ? (
            <div className="flex flex-col items-center justify-center gap-2 h-65">
              <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                {getApiErrorMessage(
                  listingsErrorObj,
                  "Couldn't load listings per month.",
                )}
              </p>
              <button
                onClick={() => refetchListings()}
                className="text-sm text-brand-blue hover:underline cursor-pointer"
              >
                Try again
              </button>
            </div>
          ) : listingsLoading ? (
            <Skeleton className="h-65 w-full rounded-md mt-4" />
          ) : (
            <ResponsiveContainer width="100%" height={260} className="mt-4">
              <BarChart
                data={listingsData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatCompactNumber}
                  tick={{ fontSize: 12, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value, name) =>
                    name === "worth"
                      ? formatNaira(Number(value))
                      : formatCompactNumber(Number(value))
                  }
                />
                <Bar dataKey="listings" fill="#4F6EF7" maxBarSize={100} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* category distribution and transaction status */}
      <div className="two-col-grid">
        {/* category distribution */}
        <div className="chart-card">
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-4">
            Category Distribution
          </p>

          <div className="chart-container">
            <p className="chart-total-label">Total Contribution Value</p>
            <p className="chart-total-value pb-2 border-b border-gray-200 dark:border-gray-800">
              {categoryDistributionData
                ? formatNaira(totalContributionValue)
                : "—"}
              {/* TODO: no month-over-month delta in the API response */}
              <span className="text-green-500 text-xs font-normal"></span>
            </p>

            {categoryError ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10">
                <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                  {getApiErrorMessage(
                    categoryErrorObj,
                    "Couldn't load category distribution.",
                  )}
                </p>
                <button
                  onClick={() => refetchCategory()}
                  className="text-sm text-brand-blue hover:underline cursor-pointer"
                >
                  Try again
                </button>
              </div>
            ) : categoryLoading ? (
              <div className="mt-4 flex flex-col gap-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <Skeleton className="h-3.5 w-40" />
                      <Skeleton className="h-3.5 w-24" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
                {categoryDistribution.map((cat) => (
                  <div key={cat.label} className="py-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-1 items-center">
                        <span className="category-row-label">{cat.label}</span>
                        <LuDot size={16} color="#D0D5DD" />
                        <span className="category-row-count">
                          {cat.transactions}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="category-row-value">{cat.value}</span>
                        <LuDot size={16} color="#D0D5DD" />

                        <span className="category-row-percent">
                          {cat.percent}
                        </span>
                      </div>
                    </div>
                    <div className="category-progress-track">
                      <div
                        className="category-progress-fill"
                        style={{ width: `${cat.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* transaction status */}
        <div className="chart-card">
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-4">
            Transaction Status
          </p>

          <div className="chart-container flex flex-col items-center">
            {breakdownError ? (
              <div className="flex flex-col items-center justify-center gap-2 h-100">
                <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                  {getApiErrorMessage(
                    breakdownErrorObj,
                    "Couldn't load transaction status.",
                  )}
                </p>
                <button
                  onClick={() => refetchBreakdown()}
                  className="text-sm text-brand-blue hover:underline cursor-pointer"
                >
                  Try again
                </button>
              </div>
            ) : breakdownLoading ? (
              <Skeleton className="w-70 h-70 rounded-full my-14" />
            ) : (
              <>
                <div className="relative w-full">
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={transactionStatus}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={95}
                        outerRadius={140}
                        paddingAngle={1}
                        cornerRadius={3}
                        startAngle={90}
                        endAngle={-270}
                      >
                        {transactionStatus.map((slice) => (
                          <Cell
                            key={slice.name}
                            fill={slice.color}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-2xl font-bold text-[#1A1A1A] dark:text-gray-100">
                      {totalTransactions.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#888888] dark:text-gray-400">
                      transactions
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                  {transactionStatus.map((slice) => (
                    <div
                      key={slice.name}
                      className="flex items-center gap-1.5 text-xs text-[#000000B2] dark:text-gray-400"
                    >
                      <span
                        className="donut-legend-dot"
                        style={{ backgroundColor: slice.color }}
                      />
                      {slice.name} ({slice.percentage}%)
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* recent activity */}
      <div className="chart-card mt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase">
            Recent Activity
          </p>
          <button
            className="view-all-link"
            onClick={() => navigate("/activity-logs")}
          >
            View All
          </button>
        </div>

        <div className="chart-container">
          {activityError ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10">
              <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                {getApiErrorMessage(
                  activityErrorObj,
                  "Couldn't load recent activity.",
                )}
              </p>
              <button
                onClick={() => refetchActivity()}
                className="text-sm text-brand-blue hover:underline cursor-pointer"
              >
                Try again
              </button>
            </div>
          ) : activityLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="activity-row">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-3.5 w-64 mb-1.5" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))
          ) : (
            recentActivity.map((item) => {
              const isSystem = !item.actor || item.actor === "system";
              const actorName =
                isSystem || typeof item.actor === "string"
                  ? "System"
                  : item.actor.name;

              return (
                <div key={item._id} className="activity-row">
                  {isSystem ? (
                    <span className="w-8 h-8 rounded-full bg-[#4F6EF7] flex items-center justify-center shrink-0">
                      <img
                        src={logo}
                        alt="System"
                        className="w-4 h-4 object-contain"
                      />
                    </span>
                  ) : (
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #D19E00, #2563EB)",
                      }}
                    >
                      {getInitials(actorName)}
                    </span>
                  )}

                  <div>
                    <p className="activity-text">
                      <span className="font-semibold text-[#1D2939] dark:text-gray-100">
                        {actorName}
                      </span>{" "}
                      {" — "}
                      {item.label.charAt(0).toLowerCase() + item.label.slice(1)}
                      {/* {item.newState && (
                        <>
                          {" — "}
                          <span className="font-semibold text-[#1D2939] dark:text-gray-100">
                            {item.newState.replace(/_/g, " ")}
                          </span>
                        </>
                      )} */}
                    </p>
                    <p className="activity-timestamp">
                      {formatActivityTimestamp(item.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
