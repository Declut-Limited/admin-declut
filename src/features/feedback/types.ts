export type FeedbackType =
  | "share_an_improvement"
  | "report_a_problem"
  | "share_an_issue"
  | "others";

export type FeedbackStatus = "new" | "in_review" | "resolved" | "escalated";

export interface FeedbackUser {
  id: string;
  name: string;
  email: string;
  slug: string;
}

export interface FeedbackListItem {
  id: string;
  slug: string;
  type: FeedbackType;
  feedbackDescription: string;
  canContactMe: boolean;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
  rating: number;
  isLowRated: boolean;
  user: FeedbackUser;
  escalatedTo?: string;
  escalatedReason?: string;
  escalatedInternalNote?: string;
  // TODO: not yet in the API response — kept for the not-yet-wired AssignFeedbackModal
  assignedTo?: string | null;
}

export interface FeedbackStatusUpdatePayload {
  status: FeedbackStatus;
  escalatedTo?: string;
  escalatedReason?: string;
  escalatedInternalNote?: string;
}

export interface FeedbackListParams {
  page?: number;
  limit?: number;
  status?: FeedbackStatus;
  type?: FeedbackType;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface FeedbackListResponse {
  success: boolean;
  data: {
    results: FeedbackListItem[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface FeedbackNeedsAttentionCounts {
  unreviewedReportProblem: number;
  lowRatedUnresolvedFeedback: number;
  escalatedToOtherTeam: number;
}

export interface FeedbackRecentAttentionResponse {
  success: boolean;
  data: {
    needsAttention: FeedbackNeedsAttentionCounts;
    recentFeedback: FeedbackListItem[];
  };
}

export interface FeedbackDetailUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  slug: string;
  listingCount: number;
}

export interface FeedbackActivityLogActor {
  id: string;
  name: string;
  role: string;
  image?: string;
}

export interface FeedbackActivityLog {
  id: string;
  slug: string;
  event: string;
  label: string;
  oldState?: string;
  newState?: string;
  actor: FeedbackActivityLogActor;
  createdAt: string;
}

export interface FeedbackDetail {
  id: string;
  slug: string;
  type: FeedbackType;
  feedbackDescription: string;
  canContactMe: boolean;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
  rating: number;
  isLowRated: boolean;
  user: FeedbackDetailUser;
  activityLogs: FeedbackActivityLog[];
  internalNotes: unknown[];
  escalatedTo?: string;
  escalatedReason?: string;
  escalatedInternalNote?: string;
  // TODO: not yet in the API response — kept for the not-yet-wired AssignFeedbackModal
  assignedTo?: string | null;
}

export interface FeedbackDetailResponse {
  success: boolean;
  data: FeedbackDetail;
}

// TODO: replace with /admin/feedback/assignable-users once available
export interface AssignableUser {
  id: string;
  name: string;
  role: string;
}

export type FeedbackPeriod =
  | "thisMonth"
  | "lastMonth"
  | "last3Months"
  | "thisYear"
  | "lastYear"
  | "custom";

export interface FeedbackAnalyticsParams {
  period: FeedbackPeriod;
  startDate?: string;
  endDate?: string;
}

export interface FeedbackAnalyticsInsights {
  totalFeedback: number;
  awaitingReview: number;
  resolved: number;
  averageRating: number;
}

export interface FeedbackAnalyticsTrendPoint {
  label: string;
  submitted: number;
  resolved: number;
}

export interface FeedbackAnalyticsRatingDistribution {
  averageRating: number;
  totalRatings: number;
  ratingByStar: {
    "5_star": number;
    "4_star": number;
    "3_star": number;
    "2_star": number;
    "1_star": number;
  };
}

export interface FeedbackAnalyticsTypeBreakdown {
  type: FeedbackType;
  count: number;
}

export interface FeedbackAnalyticsStatusBreakdown {
  status: FeedbackStatus;
  count: number;
  percentage: string;
}

export interface FeedbackAnalyticsResponse {
  success: boolean;
  data: {
    period: string;
    since: string;
    until: string;
    insights: FeedbackAnalyticsInsights;
    feedbackTrend: FeedbackAnalyticsTrendPoint[];
    ratingDistribution: FeedbackAnalyticsRatingDistribution;
    filterByType: FeedbackAnalyticsTypeBreakdown[];
    filterByStatus: FeedbackAnalyticsStatusBreakdown[];
  };
}
