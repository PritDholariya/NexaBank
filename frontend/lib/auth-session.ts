const TOKEN_KEY = "nexabank.auth.token";
const CLIENT_ID_KEY = "nexabank.auth.clientId";
const ROLE_KEY = "nexabank.auth.role";

type JwtPayload = {
  sub?: string;
  role?: string;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded = atob(padded);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function saveSession(token: string, clientId: string) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = decodeJwtPayload(token);

  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(CLIENT_ID_KEY, clientId);
  if (payload?.role) {
    window.localStorage.setItem(ROLE_KEY, payload.role);
  } else {
    window.localStorage.removeItem(ROLE_KEY);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function getClientId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(CLIENT_ID_KEY);
}

export function getRole(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ROLE_KEY);
}

export function isAdminSession(): boolean {
  return getRole() === "ROLE_ADMIN";
}

export function clearSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(CLIENT_ID_KEY);
  window.localStorage.removeItem(ROLE_KEY);
}
