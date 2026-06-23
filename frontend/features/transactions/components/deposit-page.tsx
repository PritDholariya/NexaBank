"use client";

import { useProfile } from "@/features/account/hooks/use-profile";
import { DepositForm } from "@/features/transactions/components/deposit-form";
import { PortalLayout } from "@/components/layout/portal-layout";

export function DepositPage() {
  const { refresh } = useProfile();

  return (
    <PortalLayout
      title="Deposit"
      description="Add funds to your NexaBank account."
    >
      <DepositForm onSuccess={refresh} />
    </PortalLayout>
  );
}
