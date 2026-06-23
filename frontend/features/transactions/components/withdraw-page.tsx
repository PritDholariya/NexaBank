"use client";

import { useProfile } from "@/features/account/hooks/use-profile";
import { WithdrawForm } from "@/features/transactions/components/withdraw-form";
import { PortalLayout } from "@/components/layout/portal-layout";

export function WithdrawPage() {
  const { profile, refresh } = useProfile();

  return (
    <PortalLayout
      title="Withdraw"
      description="Withdraw funds from your account."
    >
      <WithdrawForm
        availableBalance={profile ? Number(profile.balance) : undefined}
        onSuccess={refresh}
      />
    </PortalLayout>
  );
}
