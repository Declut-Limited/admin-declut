export interface NotificationDetail {
  code: string;
  title: string;
  status: NotificationRow["status"];
  kind: "Automated" | "Manual Broadcast";
  triggeredBy: string;
  channel: string;
  recipientLabel: string;
  triggerSetup: {
    campaignType: string;
    appliesTo: string;
    eligibleAudience: string;
    startDate: string;
    endDate: string;
  };
  messagePreview: {
    channelTo: string;
    body: string;
  };
  recipient: {
    name: string;
    id: string;
    email: string;
    avatarUrl?: string;
    role: string;
    status: "Active" | "Suspended";
    company: string;
    totalListings: number;
    memberSince: string;
    rating: number;
  };
}

export interface AutomationRule {
  id: string;
  title: string;
  description: string;
  trigger: string;
  channel: string;
  delay: string;
  enabled: boolean;
}

export type NotificationStatus =
  | "draft"
  | "scheduled"
  | "sending"
  | "sent"
  | "failed";

export type NotificationChannel = "push" | "sms" | "email" | "both";

export interface NotificationRow {
  _id: string;
  title: string;
  trigger: string;
  recipientDescription: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  startDate: string;
  content: string;
  createdBy: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
}

export interface NotificationsListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface NotificationsListResponse {
  success: boolean;
  data: {
    results: NotificationRow[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface NotificationChannelResult {
  status: "sent" | "failed" | "skipped";
  error?: string;
}

export interface AdminNotification {
  _id: string;
  recipientType: string;
  recipient: string;
  type: string;
  title: string;
  body: string;
  broadcast: string;
  read: boolean;
  createdAt: string;
  channels: Record<string, NotificationChannelResult>;
}

export interface AdminNotificationsResponse {
  success: boolean;
  data: {
    results: AdminNotification[];
    total: number;
    unreadCount: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}