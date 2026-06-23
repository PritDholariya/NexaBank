"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getToken, isAdminSession } from "@/lib/auth-session";

type UseRequireAuthOptions = {
  adminOnly?: boolean;
  redirectTo?: string;
};

export function useRequireAuth({
  adminOnly = false,
  redirectTo,
}: UseRequireAuthOptions = {}) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push(redirectTo ?? (adminOnly ? "/admin/login" : "/login"));
      return;
    }

    if (adminOnly && !isAdminSession()) {
      router.push("/admin/login");
    }
  }, [adminOnly, redirectTo, router]);
}

export function useHandleAuthError() {
  const router = useRouter();

  return useCallback((status: number, adminContext = false) => {
    if (status === 401 || status === 403) {
      clearSession();
      router.push(adminContext ? "/admin/login" : "/login");
      return true;
    }

    return false;
  }, [router]);
}
