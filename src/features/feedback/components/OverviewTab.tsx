import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FiChevronRight } from "react-icons/fi";
import { TbAlertTriangle } from "react-icons/tb";
import type { IconType } from "react-icons";
import documentTextIcon from "@/assets/icons/document-text-black.svg";
import radarIcon from "@/assets/icons/radar.svg";
import tickCircleIcon from "@/assets/icons/tick-circle.svg";
import starIcon from "@/assets/icons/star-black.svg";
import dangerIcon from "@/assets/icons/danger.svg";
import orangeLegend from "@/assets/icons/OrangeLegendNode.svg";
import blueLegend from "@/assets/icons/BlueLegendNode.svg";
import Skeleton from "@/components/generic/Skeleton";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";
import type { DateRange } from "@/components/generic/DateRangeFilter";
import FeedbackTable from "./FeedbackTable";
import { statusDotColor, statusLabels, typeBarColor, typeLabels } from "../mockData";
import { useFeedbackAnalytics, useFeedbackRecentAttention } from "../queries";
import type { FeedbackNeedsAttentionCounts, FeedbackPeriod } from "../types";
import { TiStarOutline, TiUserAddOutline } from "react-icons/ti";

const ratingColor: Record<number, string> = {
  5: "#12B76A",
  4: "#12B76A",
  3: "#F59E0B",
  2: "#F04438",
  1: "#F04438",
};

const needsAttentionConfig: {
  key: keyof FeedbackNeedsAttentionCounts;
  label: string;
  subtitle: string;
  icon: IconType;
  className: string;
}[] = [
  {
    key: "unreviewedReportProblem",
    label: "Unreviewed problem reports",
    subtitle: "New · Report a Problem",
    icon: TbAlertTriangle,
    className: "text-[#F59E0B] bg-[#FFFAEB]",
  },
  {
    key: "lowRatedUnresolvedFeedback",
    label: "Low-rated feedback",
    subtitle: "1-2 stars, not yet resolved",
    icon: TiStarOutline,
    className: "text-[#F59E0B] bg-[#FFFAEB]",
  },
  {
    key: "escalatedToOtherTeam",
    label: "Escalated to other teams",
    subtitle: "Support, Ops, Finance",
    icon: TiUserAddOutline,
    className: "text-[#B42318] bg-[#FEF3F2]",
  },
];

interface OverviewTabProps {
  period: FeedbackPeriod;
  customRange: DateRange;
}

export default function OverviewTab({ period, customRange }: OverviewTabProps) {
  const navigate = useNavigate();

  const {
    data: analytics,
    isLoading: analyticsLoading,
    isError: analyticsError,
    refetch: refetchAnalytics,
    error: analyticsErrorObj,
  } = useFeedbackAnalytics({
    period,
    ...(period === "custom" && customRange.from && customRange.to
      ? { startDate: customRange.from, endDate: customRange.to }
      : {}),
  });

  const awaitingCustomRange =
    period === "custom" && (!customRange.from || !customRange.to);

  const {
    data: recentAttention,
    isLoading: recentAttentionLoading,
    isError: recentAttentionError,
    refetch: refetchRecentAttention,
    error: recentAttentionErrorObj,
  } = useFeedbackRecentAttention();

  const goToFiltered = (naKey: string) => {
    navigate(`/feedback?tab=All+Feedback&na=${naKey}`);
  };

  const needsAttentionTotal = recentAttention
    ? needsAttentionConfig.reduce(
        (sum, filter) => sum + recentAttention.needsAttention[filter.key],
        0,
      )
    : 0;

  const statsLoading = analyticsLoading || recentAttentionLoading;
  const statsError = analyticsError || recentAttentionError;
  const retryStats = () => {
    refetchAnalytics();
    refetchRecentAttention();
  };

  const stats = analytics
    ? [
        {
          label: "Total Feedback",
          value: String(analytics.insights.totalFeedback),
          icon: documentTextIcon,
        },
        {
          label: "Awaiting First Review",
          value: String(analytics.insights.awaitingReview),
          icon: radarIcon,
        },
        {
          label: "Resolved",
          value: String(analytics.insights.resolved),
          icon: tickCircleIcon,
        },
        {
          label: "Average Rating",
          value: analytics.insights.averageRating.toFixed(1),
          icon: starIcon,
        },
        {
          label: "Needs Attention",
          value: String(needsAttentionTotal),
          icon: dangerIcon,
        },
      ]
    : [];

  const ratingDistribution = analytics
    ? [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        count:
          analytics.ratingDistribution.ratingByStar[
            `${stars}_star` as keyof typeof analytics.ratingDistribution.ratingByStar
          ],
      }))
    : [];

  const byType = analytics?.filterByType ?? [];
  const byStatus = analytics?.filterByStatus ?? [];

  const maxTypeCount = Math.max(...byType.map((t) => t.count), 1);
  const maxRatingCount = Math.max(
    ...ratingDistribution.map((r) => r.count),
    1,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {awaitingCustomRange ? (
          <div className="col-span-full flex items-center justify-center py-10 bg-[#FAFAFA] dark:bg-[#FFFFE71A] rounded-md">
            <p className="text-sm text-brand-gray-dark dark:text-gray-300">
              Pick a start and end date to see insights.
            </p>
          </div>
        ) : statsError ? (
          <div className="col-span-full flex flex-col items-center justify-center gap-2 py-10 bg-[#FAFAFA] dark:bg-[#FFFFE71A] rounded-md">
            <p className="text-sm text-brand-gray-dark dark:text-gray-300">
              {getApiErrorMessage(
                analyticsErrorObj ?? recentAttentionErrorObj,
                "Couldn't load feedback insights.",
              )}
            </p>
            <button
              onClick={retryStats}
              className="text-sm text-brand-blue hover:underline cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : statsLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="stats-card">
              <Skeleton className="h-6 w-16 mb-2" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          ))
        ) : (
          stats.map((stat) => (
            <div key={stat.label} className="stats-card">
              <p className="stats-card-value">{stat.value}</p>
              <p className="stats-card-meta">
                <img src={stat.icon} alt="" className="w-4 h-4 shrink-0" />
                {stat.label}
              </p>
            </div>
          ))
        )}
      </div>

      {/* trend + rating distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-card">
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-6">
            Feedback Trend
          </p>
          <div className="chart-container">
            {analyticsError ? (
              <div className="flex flex-col items-center justify-center gap-2 h-65">
                <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                  {getApiErrorMessage(
                    analyticsErrorObj,
                    "Couldn't load the feedback trend.",
                  )}
                </p>
                <button
                  onClick={() => refetchAnalytics()}
                  className="text-sm text-brand-blue hover:underline cursor-pointer"
                >
                  Try again
                </button>
              </div>
            ) : analyticsLoading ? (
              <Skeleton className="h-65 w-full rounded-md" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart
                  data={analytics?.feedbackTrend ?? []}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="submittedGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="resolvedGradient"
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
                    dataKey="label"
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    width={24}
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#resolvedGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="submitted"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fill="url(#submittedGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <img src={orangeLegend} alt="legend" />
                Submitted
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <img src={blueLegend} alt="legend" />
                Resolved
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-6">
            Rating Distribution
          </p>
          <div className="chart-container">
            {analyticsError ? (
              <div className="flex flex-col items-center justify-center gap-2 h-65">
                <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                  {getApiErrorMessage(
                    analyticsErrorObj,
                    "Couldn't load the rating distribution.",
                  )}
                </p>
                <button
                  onClick={() => refetchAnalytics()}
                  className="text-sm text-brand-blue hover:underline cursor-pointer"
                >
                  Try again
                </button>
              </div>
            ) : analyticsLoading ? (
              <Skeleton className="h-65 w-full rounded-md" />
            ) : (
              <>
                <div className="flex gap-2 items-end">
                  <p className="chart-total-value text-4xl text-brand-gray-dark dark:text-gray-100">
                    {(analytics?.ratingDistribution.averageRating ?? 0).toFixed(1)}
                  </p>
                  <p className="chart-total-label">
                    average rating ·{" "}
                    {(analytics?.ratingDistribution.totalRatings ?? 0).toLocaleString()}{" "}
                    ratings
                  </p>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  {ratingDistribution.map((r) => (
                    <div key={r.stars}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="category-row-label">
                          {r.stars} star{r.stars === 1 ? "" : "s"}
                        </span>
                        <span className="category-row-value">{r.count}</span>
                      </div>
                      <div className="category-progress-track">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(r.count / maxRatingCount) * 100}%`,
                            backgroundColor: ratingColor[r.stars],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* type + status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-card">
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-6">
            Feedback by Type
          </p>
          <div className="chart-container flex flex-col gap-4">
            {analyticsError ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10">
                <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                  {getApiErrorMessage(
                    analyticsErrorObj,
                    "Couldn't load feedback by type.",
                  )}
                </p>
                <button
                  onClick={() => refetchAnalytics()}
                  className="text-sm text-brand-blue hover:underline cursor-pointer"
                >
                  Try again
                </button>
              </div>
            ) : analyticsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-3.5 w-40" />
                    <Skeleton className="h-3.5 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))
            ) : (
              byType.map((t) => (
                <div key={t.type}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="category-row-label">{typeLabels[t.type]}</span>
                    <span className="category-row-value">{t.count}</span>
                  </div>
                  <div className="category-progress-track">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(t.count / maxTypeCount) * 100}%`,
                        backgroundColor: typeBarColor[t.type],
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="chart-card">
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-6">
            Feedback by Status
          </p>
          <div className="chart-container flex flex-col gap-4">
            {analyticsError ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10">
                <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                  {getApiErrorMessage(
                    analyticsErrorObj,
                    "Couldn't load feedback by status.",
                  )}
                </p>
                <button
                  onClick={() => refetchAnalytics()}
                  className="text-sm text-brand-blue hover:underline cursor-pointer"
                >
                  Try again
                </button>
              </div>
            ) : analyticsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3.5 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))
            ) : (
              byStatus.map((s) => (
                <div key={s.status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="category-row-label">{statusLabels[s.status]}</span>
                    <span className="category-row-value">
                      {s.count} ({s.percentage})
                    </span>
                  </div>
                  <div className="category-progress-track">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: s.percentage,
                        backgroundColor: statusDotColor[s.status],
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* needs attention */}
      <div className="chart-card">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
            Needs Attention
          </p>
          <div className="inline-flex items-center px-1.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-800">
            {" "}
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950">
              {needsAttentionTotal} items
            </span>
          </div>
        </div>

        {recentAttentionError ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <p className="text-sm text-brand-gray-dark dark:text-gray-300">
              {getApiErrorMessage(
                recentAttentionErrorObj,
                "Couldn't load items needing attention.",
              )}
            </p>
            <button
              onClick={() => refetchRecentAttention()}
              className="text-sm text-brand-blue hover:underline cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : recentAttentionLoading ? (
          <div className="flex flex-col chart-container">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-3.5 w-48 mb-1.5" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col chart-container">
            {needsAttentionConfig.map((filter) => {
              const count = recentAttention?.needsAttention[filter.key] ?? 0;
              const Icon = filter.icon;

              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => goToFiltered(filter.key)}
                  className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-b-0 text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 rounded-lg"
                >
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${filter.className}`}
                  >
                    <Icon className="w-6 h-6" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                      {filter.label}
                    </p>
                    <p className="text-xs text-brand-gray-light">
                      {filter.subtitle}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100 shrink-0">
                    {count}
                  </span>
                  <FiChevronRight className="w-4 h-4 text-brand-gray-light shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* recent feedback */}
      <div className="detail-section-card border-none">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
            Recent Feedback
          </p>
          <button
            onClick={() => navigate("/feedback?tab=All+Feedback")}
            className="view-all-link"
          >
            View All
          </button>
        </div>

        <FeedbackTable
          rows={recentAttention?.recentFeedback ?? []}
          compact
          query={{
            isLoading: recentAttentionLoading,
            isError: recentAttentionError,
            error: recentAttentionErrorObj,
          }}
        />
      </div>
    </div>
  );
}
