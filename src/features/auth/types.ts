export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
  }
}
export interface LogoutPayload {
  refreshToken: string
}

export interface LogoutResponse {
  success: boolean
  data: {
    loggedOut: boolean
  }
}

export interface PermissionSet {
  view: boolean
  write: boolean
  delete: boolean
}

export interface AdminProfile {
  id: string
  email: string
  name: string
  role: string
  company: string
  permissions: Record<string, PermissionSet>
  createdAt: string
}

export interface MeResponse {
  success: boolean
  data: AdminProfile
}