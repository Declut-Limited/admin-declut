export interface ActivityLogRow {
  id: string;
  actorName: string;
  actorAvatarUrl?: string;
  action: string;
  target: string;
  targetLink?: string;
  ipAddress: string;
  timestamp: string;
}

export interface ActivityLogDetail {
  logCode: string;
  action: string;
  date: string;
  ipAddress: string;
  target: string;
  timestamp: string;
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