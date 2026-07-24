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
} from "recharts";
import orangeLegend from "../../../assets/icons/OrangeLegendNode.svg";
import blueLegend from "../../../assets/icons/BlueLegendNode.svg";
import calendar from "../../../assets/icons/calendar.svg";

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
    label: "Rejected Listings",
    value: "₦4,240,000",
    meta: "3.4% rejection rate",
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

function formatNaira(value: number) {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(0)}M`;
  return `₦${value}`;
}

export default function DashboardPage() {
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
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node))
        setQuickActionsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName = "Shirley"; //

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
            <p className="text-[#DDDFFF]">{getGreeting()},</p> {userName}!
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
    </React.Fragment>
  );
}
