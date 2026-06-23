export type NotificationType =
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "TRANSFER_SENT"
  | "TRANSFER_RECEIVED"
  | "TRANSACTION_COMPLETED"
  | "TRANSACTION_FAILED";

export type Notification = {
  id: number;
  type: NotificationType | string;
  message: string;
  referenceId: string | null;
  amount: number | null;
  isRead: boolean;
  createdAt: string;
};

export type UnreadCountResponse = {
  unreadCount: number;
};
