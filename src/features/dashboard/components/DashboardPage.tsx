import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import type { StatCard } from "../types";
import { FiChevronDown } from "react-icons/fi";
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
import avatarPlaceholder from "../../../assets/avatar.svg";
import logo from "../../../assets/icons/logo.svg";
import { useMe } from "@/features/auth/queries";
import Skeleton from "@/components/generic/Skeleton";

interface CategoryDistribution {
  label: string;
  transactions: string;
  value: string;
  percent: string;
  progress: number; // 0-100
}

interface TransactionStatusSlice {
  name: string;
  value: number;
  color: string;
}

interface ActivityItem {
  id: string;
  actor: string;
  isSystem?: boolean;
  avatarUrl?: string;
  message: React.ReactNode;
  timestamp: string;
}

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

const periodOptions = [
  "This Month",
  "Last Month",
  "Last 3 Months",
  "This Year",
  "Custom Range",
];

// placeholder data
const stats: StatCard[] = [
  {
    label: "Revenue",
    value: "₦48.2M",
    meta: "12% vs prior period",
    trend: "positive",
  },
  {
    label: "Escrow Balance",
    value: "₦312.7M",
    meta: "held across 4,182 transactions",
    trend: "neutral",
  },
  {
    label: "Transaction Today",
    value: "1,284",
    meta: "8.1% increase",
    trend: "positive",
  },
  {
    label: "Pending Inspections",
    value: "96",
    meta: "34 expiring in <6H",
    trend: "neutral",
  },
  {
    label: "Open Disputes",
    value: "2",
    meta: "5 breaching SLA",
    trend: "negative",
  },
  {
    label: "No of Users",
    value: "18,904",
    meta: "840 this week",
    trend: "positive",
  },
  {
    label: "New Listings",
    value: "3,412",
    meta: "840 this week",
    trend: "positive",
  },
  {
    label: "Completed Transactions",
    value: "₦4,240,000",
    meta: "98.4% rejection rate",
    trend: "neutral",
  },
];

const revenueData = [
  { month: "Jan", gross: 0, commission: 0 },
  { month: "Feb", gross: 8000000, commission: 6000000 },
  { month: "Mar", gross: 46000000, commission: 33000000 },
  { month: "Apr", gross: 47000000, commission: 35000000 },
  { month: "May", gross: 56000000, commission: 40000000 },
  { month: "Jun", gross: 56000000, commission: 41000000 },
  { month: "Jul", gross: 58000000, commission: 42000000 },
  { month: "Aug", gross: 56000000, commission: 41000000 },
  { month: "Sep", gross: 52000000, commission: 38000000 },
  { month: "Oct", gross: 52000000, commission: 38000000 },
  { month: "Nov", gross: 57000000, commission: 42000000 },
  { month: "Dec", gross: 61000000, commission: 45000000 },
];

const listingsData = [
  { month: "Aug", listings: 35000 },
  { month: "Sep", listings: 9000 },
  { month: "Oct", listings: 59000 },
  { month: "Nov", listings: 91000 },
  { month: "Dec", listings: 93000 },
  { month: "Jan", listings: 50000 },
];

const categoryDistribution: CategoryDistribution[] = [
  {
    label: "Electronics",
    transactions: "12,410 transactions",
    value: "₦364.9M",
    percent: "3.8%",
    progress: 78,
  },
  {
    label: "Home & Living",
    transactions: "12,410 transactions",
    value: "₦364.9M",
    percent: "3.8%",
    progress: 55,
  },
  {
    label: "Fashion",
    transactions: "12,410 transactions",
    value: "₦364.9M",
    percent: "3.8%",
    progress: 60,
  },
  {
    label: "Vehicles",
    transactions: "12,410 transactions",
    value: "₦364.9M",
    percent: "3.8%",
    progress: 40,
  },
  {
    label: "Kids",
    transactions: "12,410 transactions",
    value: "₦364.9M",
    percent: "3.8%",
    progress: 22,
  },
  {
    label: "Other Categories",
    transactions: "12,410 transactions",
    value: "₦364.9M",
    percent: "3.8%",
    progress: 18,
  },
];

const transactionStatus: TransactionStatusSlice[] = [
  { name: "Completed", value: 42, color: "#6366F1" },
  { name: "Escrow", value: 28, color: "#34D399" },
  { name: "Awaiting Inspection", value: 18, color: "#F59E0B" },
  { name: "Disputed", value: 8, color: "#22D3EE" },
  { name: "Cancelled", value: 4, color: "#A78BFA" },
];

interface ActivityItem {
  id: string;
  actor: string;
  isSystem?: boolean;
  avatarUrl?: string;
  message: React.ReactNode;
  timestamp: string;
}

const recentActivity: ActivityItem[] = [
  {
    id: "1",
    actor: "Ekeleme Oscar",
    avatarUrl: undefined, // swap for real avatar URL once available
    message: (
      <>
        <span className="font-semibold text-[#1A1A1A] dark:text-gray-100">
          Ekeleme Oscar
        </span>{" "}
        released ₦2,340,000 to{" "}
        <span className="font-semibold text-[#1A1A1A] dark:text-gray-100">
          Segun Adesina
        </span>
      </>
    ),
    timestamp: "10 Jul, 2026 at 14:32:08",
  },
  {
    id: "2",
    actor: "Funke Adeyemi",
    message: (
      <>
        <span className="font-semibold text-[#1A1A1A] dark:text-gray-100">
          Funke Adeyemi
        </span>{" "}
        rejected listing - reason:{" "}
        <span className="font-semibold text-[#1A1A1A] dark:text-gray-100">
          Misleading description
        </span>
      </>
    ),
    timestamp: "10 Jul, 2026 at 14:32:08",
  },
  {
    id: "3",
    actor: "System",
    isSystem: true,
    message: (
      <>
        <span className="font-semibold text-[#1A1A1A] dark:text-gray-100">
          System
        </span>{" "}
        auto-released ₦2,340,000 after inspection window expiry.
      </>
    ),
    timestamp: "10 Jul, 2026 at 14:32:08",
  },
];

const totalTransactions = transactionStatus.reduce(
  (sum, s) => sum + s.value,
  0,
);

function formatCompactNumber(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return `${value}`;
}

function formatNaira(value: number) {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(0)}M`;
  return `₦${value}`;
}

export default function DashboardPage() {
  const { data: me, isLoading } = useMe();
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [period, setPeriod] = useState("This Month");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<"Monthly" | "Quarterly">(
    "Monthly",
  );
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
              {period}
            </span>
          </p>

          <div className="relative" ref={ref}>
            <button
              className="period-filter-trigger cursor-pointer"
              onClick={() => setPeriodOpen((o) => !o)}
            >
              <img src={calendar} alt="calendar" className="w-4 h-4" />
              {period}
              <FiChevronDown
                className={`w-4 h-4 transition-transform ${periodOpen ? "rotate-180" : ""}`}
              />
            </button>

            {periodOpen && (
              <div className="period-filter-dropdown">
                {periodOptions.map((option) => (
                  <button
                    key={option}
                    className="period-filter-option"
                    onClick={() => {
                      setPeriod(option);
                      setPeriodOpen(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stats-card">
              <div className="bg-[#FAFAFA] rounded-md p-2 dark:bg-[#FFFFE71A]">
                <p className="stats-card-label">{stat.label}</p>
                <p className="stats-card-value">{stat.value}</p>
              </div>

              <div className="stats-card-meta">
                {(() => {
                  const { icon: Icon, text } = trendConfig[stat.trend];
                  return (
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-4 h-4 ${text}`} />
                    </span>
                  );
                })()}
                <span>{stat.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* revenue trend */}
      <div className="chart-card mt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase">
            Revenue Trend
          </p>

          <div className="chart-toggle-group">
            {(["Monthly", "Quarterly"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setChartPeriod(option)}
                className={`chart-toggle-option ${
                  chartPeriod === option
                    ? "bg-[#ECEEFF] dark:bg-gray-900 text-[#562AD8] dark:text-indigo-400"
                    : "text-[#888888] dark:text-gray-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={revenueData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="grossGradient" x1="0" y1="0" x2="0" y2="1">
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

          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <img src={orangeLegend} alt="legend" />
              Gross Revenue
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <img src={blueLegend} alt="legend" /> Commission
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div>
              <p className="chart-stat-label">12-Month Gross</p>
              <p className="chart-stat-value">₦364.9M</p>
            </div>
            <div>
              <p className="chart-stat-label">Best Month</p>
              <p className="chart-stat-value">July - ₦48.2M</p>
            </div>
            <div>
              <p className="chart-stat-label">Avg./Month</p>
              <p className="chart-stat-value">₦30.4M</p>
            </div>
            <div>
              <p className="chart-stat-label">Total Remittance</p>
              <p className="chart-stat-value">
                ₦87,500,000{" "}
                <span className="text-green-500 text-xs font-normal">
                  +12 this month
                </span>
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
            ₦29,517
            <span className="text-green-500 text-xs font-normal">
              +12 this month
            </span>
          </p>

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
                formatter={(value) => formatCompactNumber(Number(value))}
              />
              <Bar dataKey="listings" fill="#4F6EF7" maxBarSize={100} />
            </BarChart>
          </ResponsiveContainer>
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
              ₦87,500,000
              <span className="text-green-500 text-xs font-normal">
                +12 this month
              </span>
            </p>

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
          </div>
        </div>
        {/* transaction status */}
        <div className="chart-card">
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase mb-4">
            Transaction Status
          </p>

          <div className="chart-container flex flex-col items-center">
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
                      <Cell key={slice.name} fill={slice.color} stroke="none" />
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
                  {slice.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* recent activity */}
      <div className="chart-card mt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold tracking-wide text-[#888888] dark:text-gray-400 uppercase">
            Recent Activity
          </p>
          <button className="view-all-link">View All</button>
        </div>

        <div className="chart-container">
          {recentActivity.map((item) => (
            <div key={item.id} className="activity-row">
              {item.isSystem ? (
                <span className="w-8 h-8 rounded-full bg-[#4F6EF7] flex items-center justify-center shrink-0">
                  <img
                    src={logo}
                    alt="System"
                    className="w-4 h-4 object-contain"
                  />
                </span>
              ) : (
                <img
                  src={item.avatarUrl || avatarPlaceholder}
                  alt={item.actor}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
              )}

              <div>
                <p className="activity-text">{item.message}</p>
                <p className="activity-timestamp">{item.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}
