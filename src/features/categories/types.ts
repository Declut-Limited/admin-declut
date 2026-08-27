export type CategoryStatus = "active" | "hidden";

export interface CategoryRow {
  id: string;
  title: string;
  slug: string;
  status: CategoryStatus;
  listingCount: number;
  createdAt: string;
}

export interface CategoriesListResponse {
  success: boolean;
  data: CategoryRow[];
}

export interface CreateCategoryPayload {
  title: string;
}

export interface UpdateCategoryPayload {
  title: string;
}