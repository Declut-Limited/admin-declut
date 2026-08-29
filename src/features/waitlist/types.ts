export interface WaitlistStats {
  waiting: number;
  invited: number;
  joined: number;
  buyerInterest: number;
  sellerInterest: number;
  both: number;
}

export interface PendingWaitlistUser {
  id: string;
  email: string;
  joined: string;
}

export interface InviteUsersPayload {
  userIds: string[];
  message: string;
}

export type WaitlistInterest = "buying" | "selling" | "both";
export type WaitlistStatus = "waiting" | "invited" | "joined" | "unsubscribed";
export type InviteStatus = "not_sent" | "sent" | "delivered" | "opened";

export interface WaitlistUser {
  _id: string;
  email: string;
  interest: WaitlistInterest;
  status: WaitlistStatus;
  inviteStatus: InviteStatus;
  createdAt: string;
  // TODO: not returned by the API yet
  lastContacted?: string | null;
}

export interface WaitlistInsights {
  waiting: number;
  invited: number;
  joined: number;
  buyerInterest: string;
  sellerInterest: string;
  bothBuyerAndSellerInterest: string;
}

export interface WaitlistInsightsResponse {
  success: boolean;
  data: WaitlistInsights;
}

export interface WaitlistListParams {
  page?: number;
  limit?: number;
  status?: string;
  interest?: string;
  inviteStatus?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface WaitlistListResponse {
  success: boolean;
  data: {
    results: WaitlistUser[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface InviteUserPayload {
  email: string;
  message: string;
}

export interface BulkInvitePayload {
  recipients: { id: string; email: string }[];
  message: string;
}