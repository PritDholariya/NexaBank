"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { StatCard } from "@/components/stat-card";
import { RejectModal } from "@/features/admin/components/reject-modal";
import {
  useHandleAuthError,
  useRequireAuth,
} from "@/features/auth/hooks/use-require-auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  approveAccount,
  getCustomers,
  rejectAccount,
} from "@/services/account-service";
import { ApiError } from "@/services/api-client";
import type { Customer, CustomerStatus } from "@/types/account";

const statusFilters: Array<{ label: string; value: CustomerStatus | "ALL" }> = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export function CustomerDashboard() {
  const handleAuthError = useHandleAuthError();
  useRequireAuth({ adminOnly: true });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filter, setFilter] = useState<CustomerStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [rejectTarget, setRejectTarget] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<number | null>(null);

  const loadCustomers = async (status: CustomerStatus | "ALL" = filter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomers(status === "ALL" ? undefined : status);
      setCustomers(data);
      setCurrentPage(1);
      setSelectedCustomer(null);
    } catch (requestError) {
      if (
        requestError instanceof ApiError &&
        handleAuthError(requestError.status, true)
      ) {
        return;
      }
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingCount = customers.filter(
    (customer) => customer.status === "PENDING",
  ).length;
  const approvedCount = customers.filter(
    (customer) => customer.status === "APPROVED",
  ).length;

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCustomers = useMemo(() => {
    if (!normalizedQuery) {
      return customers;
    }

    return customers.filter((customer) => {
      const fields = [
        customer.name,
        customer.email,
        customer.phoneNumber,
        customer.clientId ?? "",
        String(customer.id),
        customer.status,
      ];

      return fields.some((field) =>
        field.toLowerCase().includes(normalizedQuery),
      );
    });
  }, [customers, normalizedQuery]);

  const pageSize = 10;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / pageSize),
  );
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleApprove = async (customerId: number) => {
    setActioningId(customerId);
    setError(null);
    try {
      await approveAccount(customerId);
      await loadCustomers();
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message || "Approval failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejectTarget) {
      return;
    }

    const customerId = rejectTarget.id;
    setActioningId(customerId);
    setError(null);
    try {
      await rejectAccount(customerId, { reason });
      setRejectTarget(null);
      setSelectedCustomer(null);
      await loadCustomers();
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message || "Rejection failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setActioningId(null);
    }
  };

  return (
    <AppLayout
      title="Customer management"
      description="Review applications, approve new accounts, and manage customer records."
      variant="admin"
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/approvals">Quick approve</Link>
        </Button>
      }
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard title="Total customers" value={String(customers.length)} />
        <StatCard title="Pending review" value={String(pendingCount)} />
        <StatCard title="Approved" value={String(approvedCount)} />
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Customer list</CardTitle>
            <Input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search customers..."
              className="max-w-xs"
            />
          </div>

          <Tabs
            value={filter}
            onValueChange={(value) => {
              const next = value as CustomerStatus | "ALL";
              setFilter(next);
              loadCustomers(next);
            }}
          >
            <TabsList>
              {statusFilters.map((statusFilter) => (
                <TabsTrigger
                  key={statusFilter.value}
                  value={statusFilter.value}
                >
                  {statusFilter.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredCustomers.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No customers found.
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Client ID</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {customer.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={customer.status} />
                      </TableCell>
                      <TableCell>{customer.preferredAccountType}</TableCell>
                      <TableCell>{customer.clientId ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} ·{" "}
                  {filteredCustomers.length} results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Sheet
        open={selectedCustomer !== null}
        onOpenChange={(open) => !open && setSelectedCustomer(null)}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selectedCustomer ? (
            <>
              <SheetHeader>
                <SheetTitle>{selectedCustomer.name}</SheetTitle>
                <SheetDescription>
                  Customer ID #{selectedCustomer.id}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 px-6 py-2">
                <DetailRow label="Email" value={selectedCustomer.email} />
                <DetailRow
                  label="Phone"
                  value={selectedCustomer.phoneNumber}
                />
                <DetailRow label="Status" value={selectedCustomer.status} />
                <DetailRow
                  label="Account type"
                  value={selectedCustomer.preferredAccountType}
                />
                <DetailRow
                  label="Client ID"
                  value={selectedCustomer.clientId ?? "Not assigned"}
                />
                <DetailRow
                  label="Government ID"
                  value={selectedCustomer.governmentId}
                />
                <DetailRow label="Address" value={selectedCustomer.address} />
                <DetailRow
                  label="Submitted"
                  value={new Date(
                    selectedCustomer.createdAt,
                  ).toLocaleDateString()}
                />
              </div>

              <SheetFooter className="flex-row gap-2">
                {selectedCustomer.status === "PENDING" ? (
                  <>
                    <Button
                      onClick={() => handleApprove(selectedCustomer.id)}
                      disabled={actioningId === selectedCustomer.id}
                    >
                      {actioningId === selectedCustomer.id
                        ? "Processing..."
                        : "Approve"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setRejectTarget(selectedCustomer)}
                      disabled={actioningId === selectedCustomer.id}
                    >
                      Reject
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No actions available for {selectedCustomer.status}{" "}
                    applications.
                  </p>
                )}
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <RejectModal
        customerName={rejectTarget?.name ?? ""}
        isOpen={rejectTarget !== null}
        isSubmitting={actioningId === rejectTarget?.id}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleReject}
      />
    </AppLayout>
  );
}

function StatusBadge({ status }: { status: CustomerStatus }) {
  if (status === "APPROVED") {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Approved
      </Badge>
    );
  }
  if (status === "REJECTED") {
    return <Badge variant="destructive">Rejected</Badge>;
  }
  return <Badge variant="outline">Pending</Badge>;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b pb-3 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
