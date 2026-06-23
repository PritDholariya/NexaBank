export type LoginRequest = {
  clientId: string;
  password: string;
};

export type ChangePasswordRequest = {
  clientId: string;
  oldPassword: string;
  newPassword: string;
};

export type AuthResponse = {
  token: string | null;
  message: string;
};
