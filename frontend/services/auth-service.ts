import { apiRequest } from "@/services/api-client";
import type {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
} from "@/types/auth";

export function login(payload: LoginRequest) {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function changePassword(payload: ChangePasswordRequest) {
  return apiRequest<AuthResponse>("/api/auth/change-password", {
    method: "POST",
    body: payload,
  });
}
