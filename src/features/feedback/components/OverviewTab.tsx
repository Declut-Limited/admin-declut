import { useMemo } from "react";
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
import { HiOutlineClock } from "react-icons/hi2";
import type { IconType } from "react-icons";
import documentTextIcon from "@/assets/icons/document-text-black.svg";
import radarIcon from "@/assets/icons/radar.svg";
import profileCircleIcon from "@/assets/icons/profile-circle.svg";
import tickCircleIcon from "@/assets/icons/tick-circle.svg";
import starIcon from "@/assets/icons/star-black.svg";
import dangerIcon from "@/assets/icons/danger.svg";
import orangeLegend from "@/assets/icons/OrangeLegendNode.svg";
import blueLegend from "@/assets/icons/BlueLegendNode.svg";
import FeedbackTable from "./FeedbackTable";
import {
  buildFeedbackOverview,
  mockFeedbackRows,
  needsAttentionFilters,
  typeBarColor,
} from "../mockData";
import { TiStarOutline, TiUserAddOutline, TiUserOutline } from "react-icons/ti";

const ratingColor: Record<number, string> = {
  5: "#12B76A",
  4: "#12B76A",
  3: "#F59E0B",
  2: "#F04438",
  1: "#F04438",
};

const needsAttentionIcon: Record<
  string,
  { icon: IconType; className: string }
> = {
  unreviewed: {
    icon: TbAlertTriangle,
    className: "text-[#F59E0B] bg-[#FFFAEB]",
  },
  lowRated: { icon: TiStarOutline, className: "text-[#F59E0B] bg-[#FFFAEB]" },
  awaiting: { icon: HiOutlineClock, className: "text-[#7F22FE] bg-[#F5F3FF]" },
  escalated: {
    icon: TiUserAddOutline,
    className: "text-[#B42318] bg-[#FEF3F2]",
  },
  unassigned: {
    icon: TiUserOutline,
    className: "text-brand-gray-light bg-gray-100",
  },
};

export default function OverviewTab() {
  const navigate = useNavigate();

  const overview = useMemo(() => buildFeedbackOverview(mockFeedbackRows), []);

  const recentFeedback = useMemo(
    () =>
      [...mockFeedbackRows]
        .sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime(),
        )
        .slice(0, 3),
    [],
  );

  const goToFiltered = (naKey: string) => {
    navigate(`/feedback?tab=All+Feedback&na=${naKey}`);
  };

  const stats = [
    {
      label: "Total Feedback",
      value: String(overview.totalFeedback),
      icon: documentTextIcon,
    },
    {
      label: "Awaiting First Review",
      value: String(overview.awaitingFirstReview),
      icon: radarIcon,
    },
    {
      label: "Currently with an Admin",
      value: String(overview.currentlyWithAdmin),
      icon: profileCircleIcon,
    },
    {
      label: "Resolved",
      value: String(overview.resolved),
      icon: tickCircleIcon,
    },
    {
      label: "Average Rating",
      value: overview.averageRating.toFixed(1),
      icon: starIcon,
    },
    {
      label: "Needs Attention",
      value: String(overview.needsAttention),
      icon: dangerIcon,
    },
  ];

  const maxTypeCount = Math.max(...overview.byType.map((t) => t.count), 1);
  const statusTotal =
    overview.byStatus.reduce((sum, s) => sum + s.count, 0) || 1;
  const maxRatingCount = Math.max(
    ...overview.ratingDistribution.map((r) => r.count),
    1,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stats-card">
            <p className="stats-card-value">{stat.value}</p>
            <p className="stats-card-meta">
              <img src={stat.icon} alt="" className="w-4 h-4 shrink-0" />
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* trend + rating distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-card">
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-4">
            Feedback Trend
          </p>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart
                data={overview.trend}
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
                  dataKey="month"
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
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-4">
            Rating Distribution
          </p>
          <div className="chart-container">
            <div className="flex gap-2 items-end">
              <p className="chart-total-value text-4xl text-brand-gray-dark dark:text-gray-100">
                {overview.averageRating.toFixed(1)}
              </p>
              <p className="chart-total-label">
                average rating · {overview.totalRatings.toLocaleString()}{" "}
                ratings
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              {overview.ratingDistribution.map((r) => (
                <div key={r.stars} className="flex items-center gap-3">
                  <span className="text-xs text-brand-gray-dark dark:text-gray-300 w-10 shrink-0">
                    {r.stars} star{r.stars === 1 ? "" : "s"}
                  </span>
                  <div className="category-progress-track flex-1">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(r.count / maxRatingCount) * 100}%`,
                        backgroundColor: ratingColor[r.stars],
                      }}
                    />
                  </div>
                  <span className="text-xs text-brand-gray-light w-6 text-right shrink-0">
                    {r.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* type + status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-card">
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-4">
            Feedback by Type
          </p>
          <div className="chart-container flex flex-col gap-4 py-2">
            {overview.byType.map((t) => (
              <div key={t.type}>
                <div className="flex items-center justify-between mb-2">
                  <span className="category-row-label">{t.label}</span>
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
            ))}
          </div>
        </div>

        <div className="chart-card">
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-4">
            Feedback by Status
          </p>
          <div className="chart-container py-2">
            <div className="flex w-full h-2.5 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
              {overview.byStatus
                .filter((s) => s.count > 0)
                .map((s) => (
                  <div
                    key={s.status}
                    style={{
                      width: `${(s.count / statusTotal) * 100}%`,
                      backgroundColor: s.color,
                    }}
                  />
                ))}
            </div>

            <div className="flex flex-col gap-3 mt-4">
              {overview.byStatus.map((s) => (
                <div
                  key={s.status}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="donut-legend-dot"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-brand-gray-dark dark:text-gray-300">
                      {s.label}
                    </span>
                  </div>
                  <span className="text-brand-gray-light">
                    {s.count} ({Math.round((s.count / statusTotal) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
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
              {overview.needsAttention} items
            </span>
          </div>
        </div>

        <div className="flex flex-col chart-container">
          {needsAttentionFilters.map((filter) => {
            const count = mockFeedbackRows.filter(filter.predicate).length;
            const { icon: Icon, className } = needsAttentionIcon[filter.key];

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => goToFiltered(filter.key)}
                className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-b-0 text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 rounded-lg"
              >
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${className}`}
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

        <FeedbackTable rows={recentFeedback} compact />
      </div>
    </div>
  );
}
