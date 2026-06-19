export type AccountType = "SAVINGS" | "CURRENT";

export type CustomerStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Role = "ROLE_USER" | "ROLE_ADMIN";

export type AccountRegistrationRequest = {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  governmentId: string;
  accountType: AccountType;
};

export type AccountRegistrationResponse = {
  customerId: number;
  status: CustomerStatus;
  message: string;
};

export type AccountApprovalResponse = {
  clientId: string;
  iban: string;
  bic: string;
  message: string;
};

export type Account = {
  id: number;
  iban: string;
  bic: string;
  accountType: AccountType;
  customerId: number;
  balance: string;
  createdAt: string;
};

export type Customer = {
  id: number;
  clientId: string | null;
  role: Role;
  status: CustomerStatus;
  preferredAccountType: AccountType;
  requiresPasswordChange: boolean;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  governmentId: string;
  photoUrl: string | null;
  passwordHash: string | null;
  createdAt: string;
};

export type RejectionRequest = {
  reason: string;
};

export type UserProfileResponse = {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  photoUrl: string | null;
  clientId: string;
  iban: string;
  bic: string;
  balance: number;
  accountType: AccountType;
};
