export type UserStatus = "active" | "pending" | "suspended" | "banned";

export interface UserRow {
  type: "user" | "admin";
  id: string;
   slug?: string; 
  name: string;
  email: string;
  role: string;
   roleId?: string;
  listingsCount: number;
  status: UserStatus;
  joinedAt: string;
}

export interface UsersListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface UsersListResponse {
  success: boolean;
  data: {
    results: UserRow[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface SuspendUserPayload {
  reason: string;
  durationDays: number | null;
  outcome: string;
  notes?: string;
}

export interface PermissionSet {
  view: boolean;
  write: boolean;
  delete: boolean;
}

export interface AdminUserDetails {
  role: string;
  title: string;
  status: UserStatus;
  createdAt: string;
  email: string;
  name?: string; 
  permissions: Record<string, PermissionSet>;
}

export interface RegularUserDetails {
  role: string;
  status: UserStatus;
  createdAt: string;
  rating: string;
  verification: string | null;
  kycStatus: KycStatus; 
  name?: string;
  slug: string;
  email: string;
  phone: string;
}
export interface UserInsights {
  listings: { total: number; active: number };
  sales: { total: number; completed: number };
  purchases: { total: number; amountSpent: number };
  rating: { value: string; reviewCount: number };
}
export interface UserRecentTransaction {
  transactionId: string;
  role: "seller" | "buyer";
  direction: "inflow" | "outflow";
  amount: number;
  status: string;
  createdAt: string;
}

export type UserDetailData =
  | {
      type: "admin";
      details: AdminUserDetails;
    }
  | {
      type: "user";
      details: RegularUserDetails;
      insights: UserInsights;
      recentTransactions: UserRecentTransaction[];
    };

export interface UserDetailResponse {
  success: boolean;
  data: UserDetailData;
}

export interface UserListing {
  _id: string;
  seller: {
    id: string;
    name: string;
    contact: string;
    role: string;
    status: string;
    listingsCount: number;
    createdAt: string;
    rating: string;
  };
  title: string;
  description: string;
  category: { _id: string; title: string; slug: string };
  condition: string;
  price: number;
  images: string[];
  location: { type: string; coordinates: [number, number] };
  locationLabel: string;
  status: string;
  slug: string;
  views: number;
  saves: number;
  priceHistory: { price: number; changedAt: string }[];
  specs: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface UserListingsResponse {
  success: boolean;
  data: {
    results: UserListing[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ModulePermission {
  module: string;
  view: boolean;
  write: boolean;
  delete: boolean;
}

export interface InviteUserFormData {
  fullName: string;
  email: string;
  role: string;
  company: string;
  permissions: ModulePermission[];
}

export interface SuspendUserFormData {
  reason: string;
  duration: string;
  outcome: string;
  notes: string;
}

export interface UserListingRow {
  id: string;
  name: string;
  code: string;
  role: string;
  price: string;
  status: string;
  date: string;
}

export interface UserTransactionRow {
  id: string;
  item: string;
  role: "Seller" | "Buyer";
  amount: string;
}

export type KycStatus = "unverified" | "pending" | "verified" | "rejected";

export interface UpdateKycPayload {
  status: KycStatus;
}

export interface InviteSubAdminPayload {
  email: string;
  name: string;
  password: string;
  title: string;
  company: string;
  roleId: string;
}

export interface UpdateSubAdminRolePayload {
  roleId: string;
}