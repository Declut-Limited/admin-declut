export interface UserRow {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  listings: number;
  status: "Active" | "Pending" | "Suspended";
  joined: string;
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

export interface UserDetail {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: "Active" | "Pending" | "Suspended";
  accountType: "Buyer/Seller" | "Admin";
  company: string;
  memberSince: string;
  rating: number;
  reviewCount: number;
  verification: {
    type: string;
    submitted: string;
    status: "Approved" | "Rejected" | "Pending";
  };
  stats: {
    totalListings: number;
    activeListings: number;
    salesAsSeller: string;
    completedSales: number;
    purchasesAsBuyer: number;
    purchaseAmount: string;
  };
  listings: UserListingRow[];
  transactions: UserTransactionRow[];
  permissions?: ModulePermission[]; // only for Admin
}