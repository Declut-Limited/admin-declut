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

export interface AdminRole {
  id: string;
  name: string;
  permissions: Record<string, PermissionSet>;
}

export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  company: string;
  role: AdminRole;
  createdAt: string;
}

export interface MeResponse {
  success: boolean;
  data: AdminProfile;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  data: {
    sent: boolean;
  };
}

export interface VerifyResetTokenResponse {
  success: boolean;
  data: {
    valid: boolean;
    email?: string;
  };
}

export interface ResetPasswordPayload {
  password: string;
  passwordConfirm: string;
}
export interface ResetPasswordResponse {
  success: boolean;
  data: {
    reset: boolean;
  };
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  data: {
    changed: boolean;
  };
}