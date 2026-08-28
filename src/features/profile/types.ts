import type { AdminRole } from "../auth/types"

// types.ts
export interface ProfileGeneral {
  first_name: string
  last_name: string
  phone_number: string
  phone_country_code: string
  work_email: string
  photo_url?: string
}

export interface ProfilePersonalization {
  appearance: 'Light' | 'Dark' | 'System'
  landing_page: string
  default_rows_per_page: string
  date_format: string
  time_format: string
  timezone: string
  language: string
}

export interface ProfileAccount {
  admin_id: string
  full_name: string
  work_email: string
  role: string
  account_status: string
  account_created: string
  last_profile_update: string
  last_login: string
  password_changed: string
  active_sessions: number
  failed_attempts: number
}

export interface ActiveSession {
  id: string
  device: string
  location: string
  timestamp: string
  is_current: boolean
}

export interface DashboardPreferences {
  landingPage: string;
  rowsPerPage: number;
  dateFormat: string;
  timeFormat: string;
  timezone: string;
  language: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  dashboardPreferences: DashboardPreferences;
  passwordChangedAt: string | null;
  lastLoginAt: string | null;
  lastProfileUpdateAt: string | null;
  role: AdminRole;
  createdAt: string;
}

export interface UpdateProfileGeneralPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}