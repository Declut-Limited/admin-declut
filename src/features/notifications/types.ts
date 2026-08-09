export interface NotificationRow {
  id: string;
  title: string;
  trigger: string;
  triggerLink?: string;
  recipientName: string;
  recipientAvatarUrl?: string;
  channel: "PUSH" | "SMS" | "Email";
  status: "Draft" | "Scheduled" | "Sent";
  startDate: string;
}

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