import { Badge } from "@/components/ui/badge";
import type { TransactionStatus } from "@/types/transaction";

const statusConfig: Record<
  TransactionStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

export function TransactionStatusBadge({
  status,
}: {
  status: TransactionStatus;
}) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
