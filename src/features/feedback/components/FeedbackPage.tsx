import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "@/components/generic/PageHeader";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
import { FiChevronDown } from "react-icons/fi";
import calendar from "@/assets/icons/calendar.svg";
import DateRangeFilter, { type DateRange } from "@/components/generic/DateRangeFilter";
import OverviewTab from "./OverviewTab";
import AllFeedbackTab from "./AllFeedbackTab";

const TABS = ["Overview", "All Feedback"] as const;
type FeedbackTab = (typeof TABS)[number];

type PeriodFilter = "thisMonth" | "lastMonth" | "last3Months" | "thisYear" | "custom";

const periodOptions: { label: string; value: PeriodFilter }[] = [
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Last 3 Months", value: "last3Months" },
  { label: "This Year", value: "thisYear" },
  { label: "Custom Range", value: "custom" },
];

export default function FeedbackPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [period, setPeriod] = useState<PeriodFilter>("thisMonth");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [customRange, setCustomRange] = useState<DateRange>({ from: "", to: "" });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setPeriodOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabParam = searchParams.get("tab");
  const activeTab: FeedbackTab = TABS.includes(tabParam as FeedbackTab)
    ? (tabParam as FeedbackTab)
    : "Overview";

  const setActiveTab = (tab: FeedbackTab) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", tab);
    if (tab !== "All Feedback") next.delete("na");
    setSearchParams(next);
  };

  const periodLabel = periodOptions.find((o) => o.value === period)?.label ?? "";

  return (
    <div>
      <PageHeader
        title="Feedback"
        subtitle="Everything Declut users submit from the app — what they said, how they rated us, and what still needs attention."
        actions={
          <>
            {activeTab === "Overview" && (
              <>
                {period === "custom" && (
                  <DateRangeFilter value={customRange} onChange={setCustomRange} />
                )}

                <div className="relative" ref={ref}>
                  <button
                    className="period-filter-trigger cursor-pointer"
                    onClick={() => setPeriodOpen((o) => !o)}
                  >
                    <img src={calendar} alt="" className="w-4 h-4" />
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
              </>
            )}

            <Button
              leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
              onClick={() => {
                // TODO: no feedback export endpoint yet
              }}
            >
              Export
            </Button>
          </>
        }
      />

      <div className="referral-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`referral-tab ${activeTab === tab ? "referral-tab-active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && <OverviewTab />}
      {activeTab === "All Feedback" && <AllFeedbackTab />}
    </div>
  );
}
