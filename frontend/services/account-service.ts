import { apiRequest } from "@/services/api-client";
import type {
  Account,
  AccountApprovalResponse,
  AccountRegistrationRequest,
  AccountRegistrationResponse,
  Customer,
  CustomerStatus,
  RejectionRequest,
  UserProfileResponse,
} from "@/types/account";

export function registerAccount(payload: AccountRegistrationRequest) {
  return apiRequest<AccountRegistrationResponse>("/api/accounts/register", {
    method: "POST",
    body: payload,
  });
}

export function approveAccount(customerId: number) {
  return apiRequest<AccountApprovalResponse>(
    `/api/accounts/admin/approve/${customerId}`,
    {
      method: "POST",
      requiresAuth: true,
    },
  );
}

export function getAccountById(accountId: number) {
  return apiRequest<Account>(`/api/accounts/${accountId}`, {
    requiresAuth: true,
  });
}

export function getCustomers(status?: CustomerStatus) {
  const query = status ? `?status=${status}` : "";
  return apiRequest<Customer[]>(`/api/accounts/admin/customers${query}`, {
    requiresAuth: true,
  });
}

export function rejectAccount(customerId: number, payload: RejectionRequest) {
  return apiRequest<string>(`/api/accounts/admin/reject/${customerId}`, {
    method: "POST",
    body: payload,
    requiresAuth: true,
  });
}

export function getMyProfile() {
  return apiRequest<UserProfileResponse>("/api/accounts/profile", {
    requiresAuth: true,
  });
}
