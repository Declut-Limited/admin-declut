export interface ActivityLogsListParams {
  page?: number;
  limit?: number;
  entityType?: string;
  startDate?: string;
  endDate?: string;
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

export interface ActivityLogActor {
  id: string;
  name: string;
  role: string;
}

export interface ActivityLogRow {
  _id: string;
  slug?: string;
  entityType: string;
  entityId: string;
  event: string;
  actor: ActivityLogActor | "system" | null;
  oldState?: string;
  newState?: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  label?: string;
  target?: {
    type: string;
    id: string;
  };
}

export interface ActivityLogDetailActor extends ActivityLogActor {
  email: string;
  createdAt: string;
}

export interface ActivityLogDetail extends Omit<ActivityLogRow, "actor"> {
  actor: ActivityLogDetailActor | "system" | null;
}

export interface ActivityLogDetailResponse {
  success: boolean;
  data: ActivityLogDetail;
}