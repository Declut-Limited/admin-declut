import { useState, useRef, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FiChevronDown } from "react-icons/fi";
import { IoArrowUpCircle } from "react-icons/io5";
import { TbAlertCircleFilled } from "react-icons/tb";
import type { IconType } from "react-icons";
import calendar from "../../../assets/icons/calendar.svg";
import Skeleton from "@/components/generic/Skeleton";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
import type { ReferralOverview } from "../types";

type DashboardFilter =
  | "thisMonth"
  | "lastMonth"
  | "last3Months"
  | "thisYear"
  | "custom";

interface StatCard {
  label: string;
  value: string;
  meta: string;
  trend: "positive" | "negative" | "neutral";
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

function formatCompactNaira(value: number) {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`;
  return `₦${value}`;
}

// TODO: replace with /admin/referrals/overview once available
const mockOverview: ReferralOverview = {
  activeCampaigns: 2,
  participants: 1235,
  successfulReferrals: 468,
  rewardsPaid: 4240000,
  conversionRate: 28.7,
  rewardSpendTotal: 364900000,
  bestMonth: "July - 50 Users",
  rewardSpend: [
    { month: "Jan", value: 38 },
    { month: "Feb", value: 12 },
    { month: "Mar", value: 60 },
    { month: "Apr", value: 10 },
    { month: "May", value: 30 },
    { month: "Jun", value: 95 },
    { month: "Jul", value: 14 },
    { month: "Aug", value: 98 },
    { month: "Sep", value: 48 },
    { month: "Oct", value: 82 },
  ],
  campaignPerformance: [
    { campaign: "September Refer & Earn", participants: 842, referrals: 1204, successful: 486, conversion: 40.4, qualified: 216, rewardSpend: 2150000 },
    { campaign: "Lagos Growth Campaign", participants: 428, referrals: 608, successful: 294, conversion: 48.4, qualified: 131, rewardSpend: 858000 },
    { campaign: "New Buyer Challenge", participants: 219, referrals: 301, successful: 106, conversion: 35.2, qualified: 48, rewardSpend: 240000 },
  ],
  topReferrers: [
    { participant: "Chibuzie Eke", successfulReferrals: 842, qualified: 216, transactionsGenerated: 24 },
    { participant: "Fortune Onyemuwa", successfulReferrals: 426, qualified: 131, transactionsGenerated: 21 },
    { participant: "Idowu Olatunji", successfulReferrals: 219, qualified: 48, transactionsGenerated: 17 },
  ],
  qualificationStatus: [
    { name: "Qualified", value: 35, color: "#6366F1" },
    { name: "Paid", value: 28, color: "#34D399" },
    { name: "In Progress", value: 18, color: "#F59E0B" },
    { name: "Expired", value: 12, color: "#22D3EE" },
    { name: "Disqualified", value: 7, color: "#A78BFA" },
  ],
};

function buildStats(overview: ReferralOverview): StatCard[] {
  return [
    {
      label: "Active Campaigns",
      value: String(overview.activeCampaigns),
      meta: "Currently running",
      trend: "positive",
    },
    {
      label: "Participants",
      value: overview.participants.toLocaleString(),
      meta: "users participating",
      trend: "positive",
    },
    {
      label: "Successful Referrals",
      value: overview.successfulReferrals.toLocaleString(),
      meta: "completed qualifying activity",
      trend: "positive",
    },
    {
      label: "Rewards Paid",
      value: currencyFormatter.format(overview.rewardsPaid),
      meta: "successfully paid",
      trend: "neutral",
    },
    {
      label: "Conversion Rate",
      value: `${overview.conversionRate}%`,
      meta: "referral to qualification",
      trend: "positive",
    },
  ];
}

export default function OverviewTab() {
  const [period, setPeriod] = useState<DashboardFilter>("thisMonth");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [customRange, setCustomRange] = useState<DateRange>({
    from: "",
    to: "",
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setPeriodOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // TODO: swap for useReferralOverview({ filter: period, ... })
  const overview = mockOverview;
  const overviewLoading = false;
  const overviewError = false;

  const stats = useMemo(() => (overview ? buildStats(overview) : []), [overview]);
  const periodLabel = periodOptions.find((o) => o.value === period)?.label ?? "";
  const awaitingCustomRange =
    period === "custom" && (!customRange.from || !customRange.to);

  return (
    <div className="flex flex-col gap-6">
      <div>
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

        <div className="referral-stats-grid">
          {awaitingCustomRange ? (
            <div className="col-span-full flex items-center justify-center py-10 bg-[#FAFAFA] dark:bg-[#FFFFE71A] rounded-md">
              <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                Pick a start and end date to see insights.
              </p>
            </div>
          ) : overviewError ? (
            <div className="col-span-full flex flex-col items-center justify-center gap-2 py-10 bg-[#FAFAFA] dark:bg-[#FFFFE71A] rounded-md">
              <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                Couldn't load referral insights for this period.
              </p>
              <button
                onClick={() => {
                  /* TODO: refetch once wired */
                }}
                className="text-sm text-brand-blue hover:underline cursor-pointer"
              >
                Try again
              </button>
            </div>
          ) : overviewLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
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

      {/* reward spend */}
      <div className="chart-card">
        <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-4">
          Reward Spend
        </p>

        <div className="chart-container">
          <div className="flex items-center gap-10 pb-4 border-b border-gray-200 dark:border-gray-800">
            <div>
              <p className="chart-total-label">Total</p>
              <p className="chart-total-value">
                {formatCompactNaira(overview.rewardSpendTotal)}
              </p>
            </div>
            <div>
              <p className="chart-total-label">Best Month</p>
              <p className="chart-total-value">{overview.bestMonth}</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260} className="mt-4">
            <BarChart data={overview.rewardSpend}>
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
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#4F6EF7" maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* campaign performance */}
      <div className="chart-card">
        <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-4">
          Campaign Performance
        </p>
        <div className="chart-container overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-brand-gray-dark dark:text-gray-200 tracking-wider font-semibold">
                <th className="pb-2">Campaign</th>
                <th className="pb-2">Participants</th>
                <th className="pb-2">Referrals</th>
                <th className="pb-2">Successful</th>
                <th className="pb-2">Conversion</th>
                <th className="pb-2">Qualified</th>
                <th className="pb-2">Reward Spend</th>
              </tr>
            </thead>
            <tbody>
              {overview.campaignPerformance.map((row) => (
                <tr
                  key={row.campaign}
                  className="border-t border-gray-50 dark:border-gray-800 font-medium text-xs"
                >
                  <td className="py-2.5 text-brand-gray-dark dark:text-gray-200">
                    {row.campaign}
                  </td>
                  <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                    {row.participants}
                  </td>
                  <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                    {row.referrals}
                  </td>
                  <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                    {row.successful}
                  </td>
                  <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                    {row.conversion}%
                  </td>
                  <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                    {row.qualified}
                  </td>
                  <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                    {formatCompactNaira(row.rewardSpend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* top referrers + qualification status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-card">
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-4">
            Top Referrers
          </p>
          <div className="chart-container">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-brand-gray-dark dark:text-gray-200 tracking-wider font-semibold">
                  <th className="pb-2">Participant</th>
                  <th className="pb-2">Successful Referrals</th>
                  <th className="pb-2">Qualified</th>
                  <th className="pb-2">Transactions Generated</th>
                </tr>
              </thead>
              <tbody>
                {overview.topReferrers.map((row) => (
                  <tr
                    key={row.participant}
                    className="border-t border-gray-50 dark:border-gray-800 text-xs font-medium"
                  >
                    <td className="py-2.5 text-brand-gray-dark dark:text-gray-200">
                      {row.participant}
                    </td>
                    <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                      {row.successfulReferrals}
                    </td>
                    <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                      {row.qualified}
                    </td>
                    <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                      {row.transactionsGenerated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-card">
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-4">
            Qualification Status
          </p>
          <div className="chart-container flex flex-col items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={overview.qualificationStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={1}
                  cornerRadius={3}
                  startAngle={90}
                  endAngle={-270}
                >
                  {overview.qualificationStatus.map((slice) => (
                    <Cell key={slice.name} fill={slice.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              {overview.qualificationStatus.map((slice) => (
                <div
                  key={slice.name}
                  className="flex items-center gap-1.5 text-xs text-[#000000B2] dark:text-gray-400"
                >
                  <span
                    className="donut-legend-dot"
                    style={{ backgroundColor: slice.color }}
                  />
                  {slice.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}