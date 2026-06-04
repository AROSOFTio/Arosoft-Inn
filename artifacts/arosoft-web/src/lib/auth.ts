export const userRoles = [
  "SUPER_ADMIN",
  "ADMIN",
  "SUPPORT",
  "CLIENT",
  "STUDENT",
  "FRONTEND_DEVELOPER",
  "BACKEND_DEVELOPER",
  "FULLSTACK_DEVELOPER",
  "MARKETING",
  "VIDEO_EDITOR",
  "FINANCE",
  "COMPLIANCE",
] as const;

export type UserRole = (typeof userRoles)[number];

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authTokenKey = "arosoft_auth_token";

export function getAuthToken() {
  return window.localStorage.getItem(authTokenKey);
}

export function setAuthToken(token: string) {
  window.localStorage.setItem(authTokenKey, token);
}

export function clearAuthToken() {
  window.localStorage.removeItem(authTokenKey);
}

export function getDashboardPath(role: UserRole) {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/admin";
    case "SUPPORT":
      return "/support";
    case "CLIENT":
      return "/client";
    case "STUDENT":
      return "/student";
    case "FRONTEND_DEVELOPER":
    case "BACKEND_DEVELOPER":
    case "FULLSTACK_DEVELOPER":
      return "/developer";
    case "MARKETING":
      return "/marketing";
    case "VIDEO_EDITOR":
      return "/video";
    case "FINANCE":
      return "/finance";
    case "COMPLIANCE":
      return "/compliance";
  }
}
