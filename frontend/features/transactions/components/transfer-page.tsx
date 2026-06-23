"use client";

import { useProfile } from "@/features/account/hooks/use-profile";
import { TransferForm } from "@/features/transactions/components/transfer-form";
import { PortalLayout } from "@/components/layout/portal-layout";

export function TransferPage() {
  const { profile, refresh } = useProfile();

  return (
    <PortalLayout
      title="Transfer"
      description="Send money to another NexaBank account."
    >
      <TransferForm
        senderIban={profile?.iban}
        availableBalance={profile ? Number(profile.balance) : undefined}
        onSuccess={refresh}
      />
    </PortalLayout>
  );
}
