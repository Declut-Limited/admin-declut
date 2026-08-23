export interface GeneralSettings {
  company_name: string
  support_email: string
  default_currency: string
  timezone: string
}

export interface PaymentsSettings {
  card_payments: boolean
  bank_transfer: boolean
  wallet_balance: boolean
  escrow_release_window: string
}

export interface FeesCommissionSettings {
  default_commission_rate: string;
  buyer_service_fee:  string;
  escrow_release_fee:  string;
  minimum_payout_threshold:  string;
  default_currency: string
  timezone: string
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