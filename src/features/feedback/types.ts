export type FeedbackType = "problem" | "improvement" | "compliment" | "other";

export type FeedbackStatus =
  | "new"
  | "in_review"
  | "awaiting_action"
  | "resolved"
  | "escalated";

export interface FeedbackRow {
  id: string;
  userName: string;
  userEmail: string;
  type: FeedbackType;
  rating: number;
  message: string;
  submittedAt: string;
  status: FeedbackStatus;
  escalatedTo?: string;
  assignedTo: string | null;
}

export interface FeedbackAttachment {
  id: string;
  name: string;
  url: string;
}

export interface FeedbackNote {
  id: string;
  author: string;
  timestamp: string;
  body: string;
}

export interface FeedbackActivityEvent {
  id: string;
  label: string;
  actor: string;
  timestamp: string;
}

export interface FeedbackUserInfo {
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended" | "banned";
  contactPermission: boolean;
  totalListings: number;
  memberSince: string;
  rating: number;
}

export interface FeedbackSubmissionContext {
  appVersion: string;
  device: string;
  os: string;
  screen: string;
}

export interface FeedbackDetail extends FeedbackRow {
  attachments: FeedbackAttachment[];
  notes: FeedbackNote[];
  activity: FeedbackActivityEvent[];
  user: FeedbackUserInfo;
  submissionContext: FeedbackSubmissionContext;
}

export interface AssignableUser {
  id: string;
  name: string;
  role: string;
}

export interface FeedbackTrendPoint {
  month: string;
  submitted: number;
  resolved: number;
}

export interface FeedbackOverview {
  totalFeedback: number;
  awaitingFirstReview: number;
  currentlyWithAdmin: number;
  resolved: number;
  averageRating: number;
  totalRatings: number;
  needsAttention: number;
  trend: FeedbackTrendPoint[];
  ratingDistribution: { stars: number; count: number }[];
  byType: { type: FeedbackType; label: string; count: number }[];
  byStatus: {
    status: FeedbackStatus;
    label: string;
    count: number;
    color: string;
  }[];
}
