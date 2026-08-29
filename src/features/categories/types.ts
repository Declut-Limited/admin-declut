export type CategoryStatus = "active" | "hidden";

export interface CategoryRow {
  id: string;
  title: string;
  slug: string;
  status: CategoryStatus;
  listingCount: number;
  createdAt: string;
}

export interface CategoriesListParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface CategoriesListResponse {
  success: boolean;
  data: {
    results: CategoryRow[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface CreateCategoryPayload {
  title: string;
}

export interface UpdateCategoryPayload {
  title: string;
}