"use client";

import { useCallback, useEffect, useState } from "react";
import { useHandleAuthError } from "@/features/auth/hooks/use-require-auth";
import { getMyProfile } from "@/services/account-service";
import { ApiError } from "@/services/api-client";
import type { UserProfileResponse } from "@/types/account";

export function useProfile() {
  const handleAuthError = useHandleAuthError();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch (requestError) {
      if (
        requestError instanceof ApiError &&
        handleAuthError(requestError.status)
      ) {
        return;
      }
      setError("Unable to load account details.");
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { profile, loading, error, refresh };
}
