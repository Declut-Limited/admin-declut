import type {
  AssignableUser,
  FeedbackDetail,
  FeedbackOverview,
  FeedbackRow,
  FeedbackStatus,
  FeedbackTrendPoint,
  FeedbackType,
} from "./types";

// TODO: replace with /admin/feedback once available
export const mockFeedbackRows: FeedbackRow[] = [
  {
    id: "FBK-001",
    userName: "Ada Okafor",
    userEmail: "ada.okafor@gmail.com",
    type: "problem",
    rating: 2,
    message:
      "The payment went through successfully but the item page still showed that I needed to pay again.",
    submittedAt: "2026-04-06",
    status: "new",
    assignedTo: null,
  },
  {
    id: "FBK-002",
    userName: "Tobi Ade",
    userEmail: "tobiade@gmail.com",
    type: "improvement",
    rating: 4,
    message: "Please add a way to save searches so I don't have to redo them every time.",
    submittedAt: "2026-04-06",
    status: "new",
    assignedTo: null,
  },
  {
    id: "FBK-003",
    userName: "Chisom Ezekwueme",
    userEmail: "chisom.ezekwueme@gmail.com",
    type: "compliment",
    rating: 5,
    message: "Inspection flow was smooth and the inspector was very professional.",
    submittedAt: "2026-03-06",
    status: "in_review",
    assignedTo: "Sarah John",
  },
  {
    id: "FBK-004",
    userName: "Femi Williams",
    userEmail: "femiwilliams@gmail.com",
    type: "problem",
    rating: 1,
    message: "Escrow release took 3 days after the inspection window closed.",
    submittedAt: "2026-02-06",
    status: "escalated",
    escalatedTo: "Operations",
    assignedTo: "Dan Umoh",
  },
  {
    id: "FBK-005",
    userName: "Blessing Josef",
    userEmail: "blessingjosef@gmail.com",
    type: "improvement",
    rating: 3,
    message: "Notifications are too frequent, I would like to control them per category.",
    submittedAt: "2026-01-05",
    status: "awaiting_action",
    assignedTo: "Amaka Obi",
  },
  {
    id: "FBK-006",
    userName: "David Uchechukwu",
    userEmail: "davidUchechukwu@gmail.com",
    type: "problem",
    rating: 2,
    message: "Listing photos fail to upload on mobile data, only works on wifi.",
    submittedAt: "2026-02-05",
    status: "in_review",
    assignedTo: "Sarah John",
  },
  {
    id: "FBK-007",
    userName: "Sarah Bello",
    userEmail: "sarahbello@gmail.com",
    type: "compliment",
    rating: 5,
    message: "Referral rewards paid out instantly. Nice touch!",
    submittedAt: "2026-01-05",
    status: "resolved",
    assignedTo: "Sarah John",
  },
  {
    id: "FBK-008",
    userName: "Michael Obi",
    userEmail: "michaelobi@gmail.com",
    type: "other",
    rating: 3,
    message: "Is there a way to use Declut for business accounts?",
    submittedAt: "2026-02-05",
    status: "new",
    assignedTo: null,
  },
  {
    id: "FBK-009",
    userName: "Ngozi Nwosu",
    userEmail: "ngozi.nwosu@mail.com",
    type: "problem",
    rating: 2,
    message:
      "The payment went through successfully but the item page still showed that I needed to pay again. I tried refreshing twice and it kept asking for payment, so I was scared of being charged twice.",
    submittedAt: "2026-09-12T16:32:00",
    status: "in_review",
    assignedTo: "Ekeleme Oscar",
  },
  {
    id: "FBK-010",
    userName: "Chinedu Eze",
    userEmail: "chinedu.eze@gmail.com",
    type: "improvement",
    rating: 4,
    message: "Would love a dark mode toggle in the seller dashboard.",
    submittedAt: "2026-03-01",
    status: "awaiting_action",
    assignedTo: null,
  },
  {
    id: "FBK-011",
    userName: "Fatima Bello",
    userEmail: "fatima.bello@gmail.com",
    type: "compliment",
    rating: 5,
    message: "Support resolved my dispute within an hour. Excellent service.",
    submittedAt: "2026-01-20",
    status: "resolved",
    assignedTo: "Dan Umoh",
  },
  {
    id: "FBK-012",
    userName: "Emeka Obiora",
    userEmail: "emeka.obiora@gmail.com",
    type: "problem",
    rating: 1,
    message: "App crashes when I try to upload more than 5 photos to a listing.",
    submittedAt: "2026-03-25",
    status: "new",
    assignedTo: null,
  },
];

// TODO: replace with /admin/feedback/overview once available
export const mockFeedbackTrend: FeedbackTrendPoint[] = [
  { month: "Jan", submitted: 1, resolved: 0 },
  { month: "Feb", submitted: 3, resolved: 1 },
  { month: "Mar", submitted: 5, resolved: 2 },
  { month: "Apr", submitted: 7, resolved: 4 },
  { month: "May", submitted: 6, resolved: 5 },
  { month: "Jun", submitted: 8, resolved: 6 },
  { month: "Jul", submitted: 7, resolved: 7 },
  { month: "Aug", submitted: 9, resolved: 7 },
  { month: "Sep", submitted: 9, resolved: 8 },
];

export const typeLabels: Record<FeedbackType, string> = {
  problem: "Report a Problem",
  improvement: "Suggest an Improvement",
  compliment: "Share a Compliment",
  other: "Other",
};

export const statusLabels: Record<FeedbackStatus, string> = {
  new: "New",
  in_review: "In Review",
  awaiting_action: "Awaiting Action",
  resolved: "Resolved",
  escalated: "Escalated",
};

export const statusPillClass: Record<FeedbackStatus, string> = {
  new: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  in_review: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  awaiting_action: "text-[#7F22FE] bg-[#F5F3FF] dark:text-purple-400 dark:bg-purple-950",
  resolved: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  escalated: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
};

export const statusDotColor: Record<FeedbackStatus, string> = {
  new: "#2563EB",
  in_review: "#F59E0B",
  awaiting_action: "#7F22FE",
  resolved: "#12B76A",
  escalated: "#F04438",
};

export const typePillClass: Record<FeedbackType, string> = {
  problem: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
  improvement: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  compliment: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  other: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
};

export const typeBarColor: Record<FeedbackType, string> = {
  problem: "#F04438",
  improvement: "#3B82F6",
  compliment: "#12B76A",
  other: "#344054",
};

export interface NeedsAttentionFilter {
  key: string;
  label: string;
  subtitle: string;
  predicate: (row: FeedbackRow) => boolean;
}

export const needsAttentionFilters: NeedsAttentionFilter[] = [
  {
    key: "unreviewed",
    label: "Unreviewed problem reports",
    subtitle: "New · Report a Problem",
    predicate: (row) => row.status === "new" && row.type === "problem",
  },
  {
    key: "lowRated",
    label: "Low-rated feedback",
    subtitle: "1-2 stars, not yet resolved",
    predicate: (row) => row.rating <= 2 && row.status !== "resolved",
  },
  {
    key: "awaiting",
    label: "Awaiting admin action",
    subtitle: "Blocked on an internal step",
    predicate: (row) => row.status === "awaiting_action",
  },
  {
    key: "escalated",
    label: "Escalated to other teams",
    subtitle: "Support, Ops, Finance",
    predicate: (row) => row.status === "escalated",
  },
  {
    key: "unassigned",
    label: "Unassigned feedback",
    subtitle: "No admin owns these yet",
    predicate: (row) => !row.assignedTo && row.status !== "resolved",
  },
];

export function buildFeedbackOverview(rows: FeedbackRow[]): FeedbackOverview {
  const totalFeedback = rows.length;
  const awaitingFirstReview = rows.filter((r) => r.status === "new").length;
  const currentlyWithAdmin = rows.filter(
    (r) => r.status === "in_review" || r.status === "awaiting_action",
  ).length;
  const resolved = rows.filter((r) => r.status === "resolved").length;
  const totalRatings = rows.length;
  const averageRating =
    Math.round((rows.reduce((sum, r) => sum + r.rating, 0) / (totalRatings || 1)) * 10) / 10;

  const needsAttentionIds = new Set(
    rows
      .filter((row) => needsAttentionFilters.some((f) => f.predicate(row)))
      .map((row) => row.id),
  );

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: rows.filter((r) => r.rating === stars).length,
  }));

  const byType = (Object.keys(typeLabels) as FeedbackType[]).map((type) => ({
    type,
    label: typeLabels[type],
    count: rows.filter((r) => r.type === type).length,
  }));

  const byStatus = (Object.keys(statusLabels) as FeedbackStatus[]).map((status) => ({
    status,
    label: statusLabels[status],
    count: rows.filter((r) => r.status === status).length,
    color: statusDotColor[status],
  }));

  return {
    totalFeedback,
    awaitingFirstReview,
    currentlyWithAdmin,
    resolved,
    averageRating,
    totalRatings,
    needsAttention: needsAttentionIds.size,
    trend: mockFeedbackTrend,
    ratingDistribution,
    byType,
    byStatus,
  };
}

// TODO: replace with /admin/feedback/assignable-users once available
export const mockAssignableUsers: AssignableUser[] = [
  { id: "1", name: "Sarah John", role: "Support Lead" },
  { id: "2", name: "Ekeleme Oscar", role: "Super Admin" },
  { id: "3", name: "Amaka Obi", role: "Support" },
  { id: "4", name: "Dan Umoh", role: "Operations" },
  { id: "5", name: "Fortune Motu", role: "Super Admin" },
];

const attachmentsById: Record<string, FeedbackDetail["attachments"]> = {
  "FBK-009": [
    { id: "1", name: "Payment_error.png", url: "#" },
  ],
};

const notesById: Record<string, FeedbackDetail["notes"]> = {
  "FBK-009": [
    {
      id: "1",
      author: "Sarah Johnson",
      timestamp: "12 Sep · 5:01 PM",
      body: "Great inspection feedback — shared with the Lagos inspection team.",
    },
  ],
};

function buildActivity(row: FeedbackRow): FeedbackDetail["activity"] {
  return [
    {
      id: "1",
      label: `Opened and moved to ${statusLabels[row.status]} by ${row.assignedTo ?? "Admin"}`,
      actor: row.assignedTo ?? "Unassigned",
      timestamp: "13 Sep · 11:24 AM",
    },
    {
      id: "2",
      label: "Feedback submitted from the Declut app",
      actor: row.userName,
      timestamp: `${formatShortDate(row.submittedAt)} · ${formatTime(row.submittedAt)}`,
    },
  ];
}

function formatShortDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function buildFeedbackDetail(row: FeedbackRow): FeedbackDetail {
  const sequence = Number(row.id.split("-")[1]) || 1;

  return {
    ...row,
    attachments: attachmentsById[row.id] ?? [],
    notes: notesById[row.id] ?? [],
    activity: buildActivity(row),
    user: {
      name: row.userName,
      email: row.userEmail,
      role: row.type === "problem" ? "Seller/Buyer" : "Buyer",
      status: "active",
      contactPermission: true,
      totalListings: sequence % 5,
      memberSince: "2025-04-27",
      rating: 5,
    },
    submissionContext: {
      appVersion: "3.4.0 (Build 806)",
      device: "iPhone 12",
      os: "iOS 17.6",
      screen: row.type === "compliment" ? "Inspection Summary" : "Checkout",
    },
  };
}
