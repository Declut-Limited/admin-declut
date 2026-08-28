export type CampaignStatus = "active" | "scheduled" | "ended" | "paused" | "draft" | "archived";
export type ParticipantStatus = "qualified" | "approved" | "expired" | "in_progress" | "disqualified";
export type RewardPaymentStatus = "pending" | "paid";

export interface Campaign {
  id: string;
  code: string;
  name: string;
  reward: number;
  from: string;
  to: string;
  requirement: string;
  participants: number;
  qualified: number;
  paid: number;
  status: CampaignStatus;
  createdBy: string;
}

export interface Participant {
  id: string;
  name: string;
  campaignName: string;
  referredUsers: number;
  qualified: number;
  ownTransactions: string;
  progress: number;
  deadline: string;
  reward: number;
  status: ParticipantStatus;
}

export interface Reward {
  id: string;
  participant: string;
  campaign: string;
  reward: number;
  qualifiedOn: string;
  payment: RewardPaymentStatus;
  schedule: string;
}

export interface ReferralOverview {
  activeCampaigns: number;
  participants: number;
  successfulReferrals: number;
  rewardsPaid: number;
  conversionRate: number;
  rewardSpend: { month: string; value: number }[];
  rewardSpendTotal: number;
  bestMonth: string;
  campaignPerformance: {
    campaign: string;
    participants: number;
    referrals: number;
    successful: number;
    conversion: number;
    qualified: number;
    rewardSpend: number;
  }[];
  topReferrers: {
    participant: string;
    successfulReferrals: number;
    qualified: number;
    transactionsGenerated: number;
  }[];
  qualificationStatus: { name: string; value: number; color: string }[];
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
  // step 4
  referrerTransactionsRequired: string;
  transactionType: string;
  // step 5
  qualificationWindow: string;
  countdownStartsFrom: string;
  // step 6
  eligibleUsers: string;
  geographicRestriction: string;
  // step 7
  validationRules: string[];
  // step 8
  payoutMethod: string;
  paymentSchedule: string;
}