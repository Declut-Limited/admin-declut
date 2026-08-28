export interface GeneralSettings {
  companyName: string;
  supportEmail: string;
  defaultCurrency: string;
  timezone: string;
}

export interface InspectionWindow {
  inspectionPeriod: number;
  allowExtension: boolean;
  maxExtensionPeriod: number;
}

export interface PaymentsSettings {
  cardPaymentsEnabled: boolean;
  bankTransferEnabled: boolean;
  inspectionWindow: InspectionWindow;
  maxCodeAttempts: number;
}

export interface FeesCommissionSettings {
  commissionPercentage: number;
  buyerServiceFeePercentage: number;
  escrowReleaseFee: number;
  minimumPayoutThreshold: number;
}

export interface Settings {
  _id: string;
  companyName: string;
  supportEmail: string;
  defaultCurrency: string;
  timezone: string;
  cardPaymentsEnabled: boolean;
  bankTransferEnabled: boolean;
  maxCodeAttempts: number;
  inspectionWindow: InspectionWindow;
  commissionPercentage: number;
  buyerServiceFeePercentage: number;
  escrowReleaseFee: number;
  minimumPayoutThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsResponse {
  success: boolean;
  data: Settings;
}
export interface RoleCommissionOverride {
  role: string
  users_count: number
  marketplace: boolean
  money: boolean
  trust_safety: boolean
  admin: boolean
}

export interface RolePermission {
  module: string;
  view: boolean;
  write: boolean;
  delete: boolean;
}

export interface RoleEntry {
  id: string;
  role: string;
  permissions: RolePermission[];
  isNew?: boolean;
}

export interface PermissionSet {
  view: boolean;
  write: boolean;
  delete: boolean;
}

export type RolePermissions = Record<string, PermissionSet>;

export interface Role {
  _id: string;
  name: string;
  permissions: RolePermissions;
  createdBy: string;
  createdAt: string;
  userCount: number;
}

export interface RolesListResponse {
  success: boolean;
  data: Role[];
}

export interface CreateRolePayload {
  name: string;
  permissions: RolePermissions;
}

export interface UpdateRolePayload {
  name?: string;
  permissions?: Partial<Record<string, Partial<PermissionSet>>>;
}