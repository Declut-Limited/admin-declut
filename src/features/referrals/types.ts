export type CampaignStatus = "draft" | "published" | "scheduled" | "ended";

export type ReferralParticipantStatus =
  | "in_progress"
  | "qualified"
  | "paid"
  | "disqualified"
  | "expired"
  | "left";

export type ReferralRewardStatus = "pending" | "paid" | "canceled";

export interface ReferralCampaignUser {
  _id: string;
  email: string;
  name: string;
  slug: string;
}

export interface ReferralCampaignRequirement {
  referralAmount: number;
  eachReferredTask: string[];
  minimumTransactionValueCompletedSale: number;
  minimumTransactionValueCompletedTransaction: number;
}

export interface ReferralCampaignEligibility {
  eligibleUsers: string;
  eligibleLocation: string;
}

export interface ReferralCampaignValidationRules {
  transactionCompleted: boolean;
  escrowReleased: boolean;
  notRefunded: boolean;
  notDisputed: boolean;
  notFlagged: boolean;
  meetsMinimumTransactionAmount: boolean;
}

export interface ReferralCampaign {
  _id: string;
  name: string;
  description: string;
  internalCampaignCode: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  rewardType: string;
  rewardAmount: number;
  maxCampaignBudget: number;
  referralRequirement: ReferralCampaignRequirement;
  qualificationWindow: number;
  eligibility: ReferralCampaignEligibility;
  validationRules: ReferralCampaignValidationRules;
  paymentMethod: string;
  paymentSchedule: string;
  // only present once the campaign has been scheduled
  activationDate?: string;
  activationTime?: string;
  createdBy: ReferralCampaignUser;
  updatedBy: ReferralCampaignUser[];
  createdAt: string;
  updatedAt: string;
}

export interface ReferralCampaignsListParams {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReferralCampaignListItem {
  _id: string;
  name: string;
  reward: number;
  from: string;
  to: string;
  requirement: string;
  participants: number;
  qualified: number;
  paid: number;
  status: string;
  createdBy: string;
}

export interface ReferralCampaignsListResponse {
  success: boolean;
  data: {
    results: ReferralCampaignListItem[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface ReferralCampaignResponse {
  success: boolean;
  data: ReferralCampaign;
}

export interface ReferralCampaignPayload {
  name: string;
  description: string;
  internalCampaignCode: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  rewardType: string;
  rewardAmount: number;
  maxCampaignBudget: number;
  referralRequirement: ReferralCampaignRequirement;
  qualificationWindow: number;
  eligibility: ReferralCampaignEligibility;
  validationRules: ReferralCampaignValidationRules;
  paymentMethod: string;
  paymentSchedule: string;
  activationDate?: string;
  activationTime?: string;
}


export interface ReferralParticipantRef {
  id: string;
  name: string;
}

export interface ReferralListRef {
  _id: string;
  name: string;
}

export interface ReferralParticipantListItem {
  _id: string;
  slug: string | null;
  participant: ReferralListRef;
  campaign: ReferralListRef;
  referredUsers: number;
  qualified: number;
  progressPercentage: number;
  deadline: string;
  reward: number;
  status: ReferralParticipantStatus;
}

export interface ReferralParticipantsListParams {
  page?: number;
  limit?: number;
  status?: string;
  campaignId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReferralParticipantsListResponse {
  success: boolean;
  data: {
    results: ReferralParticipantListItem[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface ReferralParticipantInsights {
  potentialReward: number;
  referredUsers: number;
  qualifiedReferrals: number;
  ownTransactions: string;
  rewardAmountPaid: number;
}

export interface ReferralParticipantTimelineEvent {
  event: string;
  label: string;
  createdAt: string;
}

export interface ReferralParticipantReferredUser {
  id: string;
  slug: string | null;
  referredUser: ReferralParticipantRef;
  referredAt: string;
  qualifiedAt: string | null;
  hasCompletedChallenge: boolean;
}

export interface ReferralParticipantTransaction {
  id: string;
  productName: string;
  amount: number;
  date: string;
  buyer: string;
  seller: string;
  status: string;
}

export interface ReferralParticipantDetail {
  id: string;
  status: ReferralParticipantStatus;
  participant: ReferralParticipantRef & { email: string };
  campaign: ReferralParticipantRef;
  joinedAt: string;
  insights: ReferralParticipantInsights;
  referredUsers: {
    results: ReferralParticipantReferredUser[];
    total: number;
    page: number;
    limit: number;
  };
  transactions: {
    results: ReferralParticipantTransaction[];
    total: number;
    page: number;
    limit: number;
  };
  timeline: ReferralParticipantTimelineEvent[];
}

export interface ReferralParticipantDetailParams {
  referralsPage?: number;
  referralsLimit?: number;
  transactionsPage?: number;
  transactionsLimit?: number;
}

export interface ReferralParticipantResponse {
  success: boolean;
  data: ReferralParticipantDetail;
}

export interface ReferralDashboardParams {
  year?: number;
}

export interface ReferralDashboardCampaignPerformance {
  id: string;
  name: string;
  participants: number;
  referralCount: number;
  successfulCount: number;
  conversionRate: string;
  qualified: number;
  rewardSpent: number;
}

export interface ReferralDashboardQualificationStatus {
  inProgress: number;
  qualified: number;
  paid: number;
  disqualified: number;
  expired: number;
  left: number;
}

export interface ReferralDashboardTopReferrer {
  participantId: string;
  name: string;
  successfulReferrals: number;
  qualified: number;
  transactionsGenerated: number;
}

export interface ReferralDashboard {
  year: number;
  rewardSpent: {
    chart: { month: string; amountSpent: number }[];
    bestMonth: string | null;
    totalSpent: number;
  };
  campaignPerformance: ReferralDashboardCampaignPerformance[];
  topReferrals: ReferralDashboardTopReferrer[];
  qualificationStatus: ReferralDashboardQualificationStatus;
}

export interface ReferralDashboardResponse {
  success: boolean;
  data: ReferralDashboard;
}

export interface ReferralRewardsListParams {
  page?: number;
  limit?: number;
  status?: string;
  campaignId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReferralRewardListItem {
  _id: string;
  slug: string | null;
  participant: ReferralListRef;
  campaign: ReferralListRef;
  reward: number;
  qualifiedOn: string;
  payment: ReferralRewardStatus;
  schedule: string;
}

export interface ReferralRewardsListResponse {
  success: boolean;
  data: {
    results: ReferralRewardListItem[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface BulkMarkRewardsPaidPayload {
  rewardIds: string[];
}

export interface ReferralAnalyticsParams {
  period?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReferralAnalyticsInsights {
  activeCampaigns: number;
  participants: number;
  successfulReferrals: number;
  rewardPaid: number;
  conversionRate: string;
}

export interface ReferralAnalytics {
  period: string;
  since: string;
  until: string;
  insights: ReferralAnalyticsInsights;
}

export interface ReferralAnalyticsResponse {
  success: boolean;
  data: ReferralAnalytics;
}

export interface CampaignFormData {
  // step 1
  name: string;
  description: string;
  code: string;
  status: string;
  startDate: string;
  endDate: string;
  // step 2
  rewardType: string;
  rewardAmount: string;
  maxBudget: string;
  // step 3
  referralsRequired: string;
  referredUserAction: string;
  minTransactionValue: string;
  useSeparateValues: boolean;
  minValueCompletedSale: string;
  minValueCompletedTransaction: string;
  // step 4 ("Referrer Requirements") removed 
  // referrerTransactionsRequired: string;
  // transactionType: string;
  // step 5
  qualificationWindow: string;
  // "Countdown Starts From" removed 
  // countdownStartsFrom: string;
  // step 6
  eligibleUsers: string;
  geographicRestriction: string;
  // step 7
  validationRules: string[];
  // step 8
  payoutMethod: string;
  paymentSchedule: string;
}