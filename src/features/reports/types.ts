export type ReportStatus =
  | "new"
  | "investigating"
  | "disputed"
  | "dismissed"
  | "resolved";

export interface ReportListing {
  _id: string;
  title: string;
  slug: string;
  mainImage: string;
}

export interface ReportParty {
  _id: string;
  email: string;
  name: string;
  phone: string;
  slug: string;
  createdAt: string;
  status: string;
  rating: number;
  // The counters below aren't returned by the API yet — render "—" until they are.
  priorReportsFiled?: number;
  reportsAgainstCount?: number;
  reportsAgainstWindowDays?: number;
  activeListings?: number;
}

export interface ReportRow {
  _id: string;
  slug: string;
  title?: string;
  reason: string;
  listing?: ReportListing | null;
  reporter?: ReportParty | null;
  createdBy: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ReportsListParams {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReportsListResponse {
  success: boolean;
  data: {
    results: ReportRow[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface UpdateReportStatusPayload {
  status: ReportStatus;
}

export interface ReportEvidenceAsset {
  publicId: string;
  url: string;
  secureUrl: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface ReportSellerDispute {
  _id: string;
  disputeClaim: string;
  evidenceImages: ReportEvidenceAsset[];
  evidenceVideo?: ReportEvidenceAsset | null;
}

export interface ReportDetail {
  _id: string;
  slug: string;
  reason: string;
  listing?: ReportListing | null;
  transaction?: string | null;
  reporter?: ReportParty | null;
  accusedUser?: ReportParty | null;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  // Only present once the seller has disputed the report.
  sellerDispute?: ReportSellerDispute | null;
}

export interface ReportDetailResponse {
  success: boolean;
  data: ReportDetail;
}

// -- Resolution outcomes --
// Each maps to its own endpoint: POST /admin/reports/:id/resolve/release
// (side with seller), /resolve/refund (refund buyer, listing stays up), or
// /resolve/delist-and-refund (uphold + take the listing down). All three
// take a { reason: string } body.
export type ReportResolutionOutcome =
  | "release"
  | "refund"
  | "delist-and-refund";

export interface ResolveReportPayload {
  reason: string;
}

export type ReportWorkflowPhase =
  | "awaiting_seller"
  | "admin_override"
  | "seller_disputed"
  | "resolved"
  | "dismissed";
