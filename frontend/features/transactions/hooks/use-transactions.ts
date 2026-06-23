"use client";

import { useCallback, useEffect, useState } from "react";
import { useHandleAuthError } from "@/features/auth/hooks/use-require-auth";
import { getTransactionHistory } from "@/services/transaction-service";
import { ApiError } from "@/services/api-client";
import type { Transaction } from "@/types/transaction";

export function useTransactions(options?: { pollIntervalMs?: number }) {
  const handleAuthError = useHandleAuthError();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const data = await getTransactionHistory();
      setTransactions(data);
    } catch (requestError) {
      if (
        requestError instanceof ApiError &&
        handleAuthError(requestError.status)
      ) {
        return;
      }
      setError("Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  useEffect(() => {
    refresh();

    if (!options?.pollIntervalMs) {
      return;
    }

    const interval = window.setInterval(refresh, options.pollIntervalMs);
    return () => window.clearInterval(interval);
  }, [refresh, options?.pollIntervalMs]);

  return { transactions, loading, error, refresh };
}
