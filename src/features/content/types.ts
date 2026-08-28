export type ContentType = "faq" | "page" | "banner";
export type ContentStatus = "draft" | "published";

export interface ContentAuthor {
  _id: string;
  email: string;
  name: string;
  title: string;
  createdAt: string;
  role: {
    _id: string;
    name: string;
  };
}

export interface ContentRow {
  _id: string;
  title: string;
  slug: string;
  contentType: ContentType;
  status: ContentStatus;
  contentBody: string;
  whereToAppear: string;
  createdBy: ContentAuthor | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContentListParams {
  page?: number;
  limit?: number;
  status?: string;
  contentType?: string;
}

export interface ContentListResponse {
  success: boolean;
  data: {
    results: ContentRow[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface ContentDetailResponse {
  success: boolean;
  data: ContentRow;
}

export interface CreateContentPayload {
  title: string;
  contentType: ContentType;
  whereToAppear: string;
  status: ContentStatus;
  contentBody: string;
}

export type UpdateContentPayload = Partial<CreateContentPayload>;