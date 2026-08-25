export type ReportStatus = "new" | "investigating" | "dismissed" | "resolved";

export interface ReportListing {
  _id: string;
  title: string;
  slug: string;
  mainImage: string;
}

export interface ReportUser {
  _id: string;
  email: string;
  name: string;
  slug: string;
}

export interface DisputeRow {
  _id: string;
  slug: string;
  title: string;
  reason: string;
  listing?: ReportListing | null;
  user?: ReportUser | null;
  createdBy: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DisputesListParams {
  page?: number;
  limit?: number;
}

export interface DisputesListResponse {
  success: boolean;
  data: {
    results: DisputeRow[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface DisputeDetailResponse {
  success: boolean;
  data: DisputeRow;
}

export interface UpdateReportStatusPayload {
  status: ReportStatus;
}