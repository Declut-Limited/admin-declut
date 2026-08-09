export interface PromotionRow {
  id: string;
  campaignName: string;
  type: "Featured" | "Banner" | "Discount";
  appliesTo: string;
  eligibleAudience: string;
  application: string;
  status: "Scheduled" | "Active" | "Ended";
  startDate: string;
}

export interface PromotionDetail {
  code: string;
  name: string;
  status: PromotionRow["status"];
  type: PromotionRow["type"];
  appliesTo: string;
  startDate: string;
  setup: {
    campaignType: string;
    appliesTo: string;
    eligibleAudience: string;
    startDate: string;
    endDate: string;
  };
  performance: {
    usage: string;
  };
  actor: {
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