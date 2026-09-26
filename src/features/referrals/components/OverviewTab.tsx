import { useMemo, useState } from "react";
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
import { TbAlertCircleFilled } from "react-icons/tb";
import Skeleton from "@/components/generic/Skeleton";
import CustomSelect from "@/components/generic/CustomSelect";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";
import { useReferralAnalytics, useReferralDashboard } from "../queries";
import type { ReferralDashboardQualificationStatus } from "../types";

type AnalyticsPeriod =
  | "thisMonth"
  | "lastMonth"
  | "last3Months"
  | "thisYear"
  | "lastYear"
  | "custom";

const periodOptions: { label: string; value: AnalyticsPeriod }[] = [
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Last 3 Months", value: "last3Months" },
  { label: "This Year", value: "thisYear" },
  { label: "Last Year", value: "lastYear" },
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

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) =>
  String(CURRENT_YEAR - i),
);

const QUALIFICATION_STATUS_META: {
  key: keyof ReferralDashboardQualificationStatus;
  label: string;
  color: string;
}[] = [
  { key: "qualified", label: "Qualified", color: "#6366F1" },
  { key: "paid", label: "Paid", color: "#34D399" },
  { key: "inProgress", label: "In Progress", color: "#F59E0B" },
  { key: "expired", label: "Expired", color: "#22D3EE" },
  { key: "disqualified", label: "Disqualified", color: "#A78BFA" },
  { key: "left", label: "Left", color: "#F472B6" },
];

export default function OverviewTab() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("thisMonth");
  const [customRange, setCustomRange] = useState<DateRange>({
    from: "",
    to: "",
  });
  const [year, setYear] = useState(String(CURRENT_YEAR));

  const awaitingCustomRange =
    period === "custom" && (!customRange.from || !customRange.to);

  const analyticsQuery = useReferralAnalytics(
    awaitingCustomRange
      ? undefined
      : {
          period,
          startDate: period === "custom" ? customRange.from : undefined,
          endDate: period === "custom" ? customRange.to : undefined,
        },
  );
  const {
    data: analytics,
    isLoading: analyticsLoading,
    isError: analyticsError,
    error: analyticsErrorObj,
  } = analyticsQuery;

  const stats = useMemo(() => {
    if (!analytics) return [];
    const { insights } = analytics;
    return [
      {
        label: "Active Campaigns",
        value: String(insights.activeCampaigns),
        meta: "Currently running",
      },
      {
        label: "Participants",
        value: insights.participants.toLocaleString(),
        meta: "users participating",
      },
      {
        label: "Successful Referrals",
        value: insights.successfulReferrals.toLocaleString(),
        meta: "completed qualifying activity",
      },
      {
        label: "Reward Paid",
        value: currencyFormatter.format(insights.rewardPaid),
        meta: "successfully paid",
      },
      {
        label: "Conversion Rate",
        value: insights.conversionRate,
        meta: "referral to qualification",
      },
    ];
  }, [analytics]);

  const periodLabel =
    periodOptions.find((o) => o.value === period)?.label ?? "";

  const dashboardQuery = useReferralDashboard({ year: Number(year) });
  const { data: dashboard, isLoading, isError, error } = dashboardQuery;

  const qualificationSlices = useMemo(() => {
    if (!dashboard) return [];
    return QUALIFICATION_STATUS_META.map((meta) => ({
      name: meta.label,
      value: dashboard.qualificationStatus[meta.key],
      color: meta.color,
    }));
  }, [dashboard]);

  const qualificationTotal = qualificationSlices.reduce(
    (sum, slice) => sum + slice.value,
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-[#888888] dark:text-gray-400">
            Showing data for:{" "}
            <span className="font-medium text-[#454545] dark:text-gray-100">
              {periodLabel}
            </span>
            {analytics && (
              <span className="text-brand-gray-light">
                {" "}
                ({formatDate(analytics.since)} – {formatDate(analytics.until)})
              </span>
            )}
          </p>

          <div className="flex items-center gap-2">
            {period === "custom" && (
              <DateRangeFilter value={customRange} onChange={setCustomRange} />
            )}
            <div className="w-40">
              <CustomSelect
                value={periodLabel}
                options={periodOptions.map((o) => o.label)}
                onChange={(label) => {
                  const option = periodOptions.find((o) => o.label === label);
                  if (option) setPeriod(option.value);
                }}
              />
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
          ) : analyticsError ? (
            <div className="col-span-full flex flex-col items-center justify-center gap-2 py-10 bg-[#FAFAFA] dark:bg-[#FFFFE71A] rounded-md">
              <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                {getApiErrorMessage(
                  analyticsErrorObj,
                  "Couldn't load referral insights for this period.",
                )}
              </p>
            </div>
          ) : analyticsLoading ? (
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
                  <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                    <TbAlertCircleFilled className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </span>
                  <span>{stat.meta}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-[#888888] dark:text-gray-400">
          Showing chart data for:{" "}
          <span className="font-medium text-[#454545] dark:text-gray-100">
            {year}
          </span>
        </p>
        <div className="w-32">
          <CustomSelect value={year} options={YEAR_OPTIONS} onChange={setYear} />
        </div>
      </div>

      {isError ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 bg-[#FAFAFA] dark:bg-[#FFFFE71A] rounded-md">
          <p className="text-sm text-brand-gray-dark dark:text-gray-300">
            {getApiErrorMessage(error, "Couldn't load referral insights.")}
          </p>
        </div>
      ) : isLoading || !dashboard ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
          {/* reward spend */}
          <div className="chart-card">
            <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-6">
              Reward Spend
            </p>

            <div className="chart-container">
              <div className="flex items-center gap-10 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <p className="chart-total-label">Total</p>
                  <p className="chart-total-value">
                    {formatCompactNaira(dashboard.rewardSpent.totalSpent)}
                  </p>
                </div>
                <div>
                  <p className="chart-total-label">Best Month</p>
                  <p className="chart-total-value">
                    {dashboard.rewardSpent.bestMonth ?? "—"}
                  </p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={260} className="mt-4">
                <BarChart data={dashboard.rewardSpent.chart}>
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
                  <Bar dataKey="amountSpent" fill="#4F6EF7" maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* campaign performance */}
          <div className="chart-card">
            <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-6">
              Campaign Performance
            </p>
            <div className="chart-container overflow-x-auto">
              {dashboard.campaignPerformance.length === 0 ? (
                <div className="detail-empty-state">No campaigns yet.</div>
              ) : (
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
                    {dashboard.campaignPerformance.map((row) => (
                      <tr
                        key={row.id}
                        className="border-t border-gray-50 dark:border-gray-800 font-medium text-xs"
                      >
                        <td className="py-2.5 text-brand-gray-dark dark:text-gray-200">
                          {row.name}
                        </td>
                        <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                          {row.participants}
                        </td>
                        <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                          {row.referralCount}
                        </td>
                        <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                          {row.successfulCount}
                        </td>
                        <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                          {row.conversionRate}
                        </td>
                        <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                          {row.qualified}
                        </td>
                        <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                          {formatCompactNaira(row.rewardSpent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* top referrers + qualification status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="chart-card">
              <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-6">
                Top Referrers
              </p>
              <div className="chart-container">
                {dashboard.topReferrals.length === 0 ? (
                  <div className="detail-empty-state">
                    No top referrers yet.
                  </div>
                ) : (
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
                      {dashboard.topReferrals.map((row) => (
                        <tr
                          key={row.participantId}
                          className="border-t border-gray-50 dark:border-gray-800 text-xs font-medium"
                        >
                          <td className="py-2.5 text-brand-gray-dark dark:text-gray-200">
                            {row.name}
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
                )}
              </div>
            </div>

            <div className="chart-card">
              <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-6">
                Qualification Status
              </p>
              <div className="chart-container flex flex-col items-center">
                {qualificationTotal === 0 ? (
                  <div className="detail-empty-state">
                    No participant activity yet.
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={qualificationSlices}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={1}
                          cornerRadius={3}
                          startAngle={90}
                          endAngle={-270}
                        >
                          {qualificationSlices.map((slice) => (
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

                    <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                      {qualificationSlices.map((slice) => (
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
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
