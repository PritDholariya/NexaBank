"use client";

import { FormEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type RejectModalProps = {
  customerName: string;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export function RejectModal({
  customerName,
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
}: RejectModalProps) {
  const [reason, setReason] = useState("");

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (reason.trim().length > 0) {
      onConfirm(reason.trim());
      setReason("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Reject application</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {customerName}&apos;s application.
              This will be recorded and communicated to the applicant.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4">
            <Label htmlFor="rejectReason">Rejection reason</Label>
            <Textarea
              id="rejectReason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Enter reason..."
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting || reason.trim().length === 0}
            >
              {isSubmitting ? "Rejecting..." : "Confirm rejection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
