export interface CategoryRow {
  id: string;
  name: string;
  listings: string;
  status: "Active" | "Hidden";
  created: string;
}