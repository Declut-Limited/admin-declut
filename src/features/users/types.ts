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