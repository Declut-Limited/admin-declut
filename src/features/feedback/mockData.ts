import type { AssignableUser, FeedbackStatus, FeedbackType } from "./types";

export const typeLabels: Record<FeedbackType, string> = {
  share_an_improvement: "Share an Improvement",
  report_a_problem: "Report a Problem",
  share_an_issue: "Share an Issue",
  others: "Others",
};

export const statusLabels: Record<FeedbackStatus, string> = {
  new: "New",
  in_review: "In Review",
  resolved: "Resolved",
  escalated: "Escalated",
};

export const statusPillClass: Record<FeedbackStatus, string> = {
  new: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  in_review: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  resolved: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  escalated: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
};

export const statusDotColor: Record<FeedbackStatus, string> = {
  new: "#2563EB",
  in_review: "#F59E0B",
  resolved: "#12B76A",
  escalated: "#F04438",
};

export const typePillClass: Record<FeedbackType, string> = {
  share_an_improvement: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  report_a_problem: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
  share_an_issue: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  others: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
};

export const typeBarColor: Record<FeedbackType, string> = {
  share_an_improvement: "#3B82F6",
  report_a_problem: "#F04438",
  share_an_issue: "#F59E0B",
  others: "#344054",
};

// TODO: replace with /admin/feedback/assignable-users once available
export const mockAssignableUsers: AssignableUser[] = [
  { id: "1", name: "Sarah John", role: "Support Lead" },
  { id: "2", name: "Ekeleme Oscar", role: "Super Admin" },
  { id: "3", name: "Amaka Obi", role: "Support" },
  { id: "4", name: "Dan Umoh", role: "Operations" },
  { id: "5", name: "Fortune Motu", role: "Super Admin" },
];
