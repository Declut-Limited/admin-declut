export interface ActivityLogRow {
  _id: string;
  entityType: string;
  entityId: string;
  event: string;
  actor: string;
  oldState?: string;
  newState?: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ActivityLogsListParams {
  page?: number;
  limit?: number;
}

export interface ActivityLogsListResponse {
  success: boolean;
  data: {
    results: ActivityLogRow[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ActivityLogDetailResponse {
  success: boolean;
  data: ActivityLogRow;
}