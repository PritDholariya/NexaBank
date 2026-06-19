"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { approveAccount, getCustomers, rejectAccount } from "@/services/account-service";
import { ApiError } from "@/services/api-client";
import { clearSession, getToken, isAdminSession } from "@/lib/auth-session";
import type { Customer, CustomerStatus } from "@/types/account";

const statusFilters: Array<{ label: string; value: CustomerStatus | "ALL" }> = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const token = useMemo(() => getToken(), []);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filter, setFilter] = useState<CustomerStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<number | null>(null);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    window.setTimeout(() => {
      setSelectedCustomer(null);
    }, 220);
  };

  const openDrawerForCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    window.setTimeout(() => setIsDrawerOpen(true), 10);
  };

  const loadCustomers = async (status: CustomerStatus | "ALL" = filter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomers(status === "ALL" ? undefined : status);
      setCustomers(data);
      setCurrentPage(1);
      setIsDrawerOpen(false);
      setSelectedCustomer(null);
    } catch (requestError) {
      if (requestError instanceof ApiError && (requestError.status === 401 || requestError.status === 403)) {
        clearSession();
        router.push("/admin/login");
        return;
      }
      setError("Failed to load customer list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !isAdminSession()) {
      router.push("/admin/login");
      return;
    }

    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, token]);

  useEffect(() => {
    if (!selectedCustomer) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedCustomer]);

  const pendingCount = customers.filter((customer) => customer.status === "PENDING").length;
  const approvedCount = customers.filter((customer) => customer.status === "APPROVED").length;

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

      return fields.some((field) => field.toLowerCase().includes(normalizedQuery));
    });
  }, [customers, normalizedQuery]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
        setError("Unexpected approval error.");
      }
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (customerId: number) => {
    const reason = window.prompt("Enter rejection reason");
    if (!reason || reason.trim().length === 0) {
      return;
    }

    setActioningId(customerId);
    setError(null);
    try {
      await rejectAccount(customerId, { reason: reason.trim() });
      await loadCustomers();
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message || "Rejection failed.");
      } else {
        setError("Unexpected rejection error.");
      }
    } finally {
      setActioningId(null);
    }
  };

  const onLogout = () => {
    clearSession();
    router.push("/admin/login");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef3ff_0%,#fefeff_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-[#d4e1ff] bg-[linear-gradient(140deg,#1948c4_0%,#356ff4_100%)] p-7 text-white shadow-[0_28px_90px_-48px_rgba(20,54,131,0.58)] sm:p-9">
          <p className="text-sm tracking-[0.15em] uppercase text-[#dce6ff]">NexaBank Admin Dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Customer onboarding control center</h1>
          <p className="mt-3 text-sm text-[#e8eeff]">Manage all customers, review pending applications, and approve/reject requests in one place.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Badge title="Total Customers" value={String(customers.length)} />
            <Badge title="Pending Requests" value={String(pendingCount)} />
            <Badge title="Approved Customers" value={String(approvedCount)} />
          </div>
          <button type="button" onClick={onLogout} className="mt-5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#1f4ac2]">
            Logout
          </button>
        </section>

        <section className="rounded-2xl border border-[#dde6ff] bg-white p-5 shadow-[0_20px_60px_-42px_rgba(24,60,140,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-[#172856]">Customers</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, email, client ID or status"
                className="w-72 rounded-xl border border-[#cfdcfb] px-3 py-2 text-sm text-[#1f2e53] outline-none focus:border-[#3664ea] focus:ring-4 focus:ring-[#dee8ff]"
              />
              {statusFilters.map((statusFilter) => (
                <button
                  key={statusFilter.value}
                  type="button"
                  onClick={() => {
                    setFilter(statusFilter.value);
                    loadCustomers(statusFilter.value);
                  }}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                    filter === statusFilter.value
                      ? "bg-[#1f4ac2] text-white"
                      : "bg-[#eff4ff] text-[#1f4ac2]"
                  }`}
                >
                  {statusFilter.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? <p className="mt-4 text-sm font-semibold text-[#4b5f8f]">Loading customers...</p> : null}
          {error ? <p className="mt-4 rounded-xl border border-[#ffd5d5] bg-[#fff5f5] px-3 py-2 text-sm text-[#aa1f1f]">{error}</p> : null}

          {!loading && filteredCustomers.length === 0 ? <p className="mt-4 text-sm text-[#5d6f94]">No customers found for selected filter/search.</p> : null}

          {!loading && filteredCustomers.length > 0 ? (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#e3ebff] text-xs tracking-[0.12em] text-[#5f7397] uppercase">
                    <th className="px-3 py-3">Customer</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Type</th>
                    <th className="px-3 py-3">Client ID</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-[#eef2ff] text-sm text-[#1f2e53]">
                      <td className="px-3 py-3">
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-xs text-[#62759c]">{customer.email}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-bold ${statusTone(customer.status)}`}>{customer.status}</span>
                      </td>
                      <td className="px-3 py-3">{customer.preferredAccountType}</td>
                      <td className="px-3 py-3">{customer.clientId ?? "-"}</td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => openDrawerForCustomer(customer)}
                          className="rounded-lg bg-[#eff4ff] px-3 py-1.5 text-xs font-bold text-[#1f4ac2]"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs font-semibold text-[#5f7397]">
                  Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredCustomers.length)} of {filteredCustomers.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg bg-[#eff4ff] px-3 py-1.5 text-xs font-bold text-[#1f4ac2] disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-semibold text-[#334b79]">Page {currentPage} / {totalPages}</span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg bg-[#eff4ff] px-3 py-1.5 text-xs font-bold text-[#1f4ac2] disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <div className="text-sm">
          <Link href="/" className="font-semibold text-[#3057d6]">Back to home</Link>
        </div>
      </div>

      {selectedCustomer ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close customer review"
            onClick={closeDrawer}
            className={`absolute inset-0 backdrop-blur-[1px] transition-colors duration-200 ${
              isDrawerOpen ? "bg-[#101531]/35" : "bg-[#101531]/0"
            }`}
          />

          <aside className={`absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-[#d8e4ff] bg-white p-6 shadow-[-20px_0_50px_-26px_rgba(17,40,94,0.4)] transition-transform duration-200 sm:p-8 ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-[#5970a4] uppercase">Application Review</p>
                <h3 className="mt-2 text-2xl font-extrabold text-[#172856]">{selectedCustomer.name}</h3>
                <p className="mt-1 text-sm text-[#5f7397]">Customer ID #{selectedCustomer.id}</p>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded-lg bg-[#eff4ff] px-3 py-1.5 text-xs font-bold text-[#1f4ac2]"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Info label="Email" value={selectedCustomer.email} />
              <Info label="Phone" value={selectedCustomer.phoneNumber} />
              <Info label="Status" value={selectedCustomer.status} />
              <Info label="Preferred Type" value={selectedCustomer.preferredAccountType} />
              <Info label="Client ID" value={selectedCustomer.clientId ?? "Not assigned"} />
              <Info label="Gov ID" value={selectedCustomer.governmentId} />
              <Info label="Address" value={selectedCustomer.address} />
              <Info label="Created At" value={new Date(selectedCustomer.createdAt).toLocaleString()} />
            </div>

            <div className="mt-6 rounded-xl border border-[#e8eeff] bg-[#f9fbff] p-4">
              <p className="text-xs font-bold tracking-[0.12em] text-[#60739a] uppercase">Decision</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedCustomer.status === "PENDING" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleApprove(selectedCustomer.id)}
                      disabled={actioningId === selectedCustomer.id}
                      className="rounded-lg bg-[#1f7a41] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                    >
                      {actioningId === selectedCustomer.id ? "Processing..." : "Approve Request"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(selectedCustomer.id)}
                      disabled={actioningId === selectedCustomer.id}
                      className="rounded-lg bg-[#c83232] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                    >
                      {actioningId === selectedCustomer.id ? "Processing..." : "Reject Request"}
                    </button>
                  </>
                ) : (
                  <p className="text-sm font-semibold text-[#5f7397]">No review actions available for {selectedCustomer.status} applications.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}

function statusTone(status: CustomerStatus): string {
  if (status === "APPROVED") {
    return "bg-[#ebfbf2] text-[#1e7d46]";
  }
  if (status === "REJECTED") {
    return "bg-[#fff0f0] text-[#ab2424]";
  }
  return "bg-[#fff9e8] text-[#996700]";
}

function Badge({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/15 px-4 py-2">
      <p className="text-[11px] tracking-[0.12em] text-[#dce6ff] uppercase">{title}</p>
      <p className="text-xl font-extrabold text-white">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-[#e7eeff] bg-[#f9fbff] p-3">
      <p className="text-[11px] font-bold tracking-[0.12em] text-[#60739a] uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#1f2e53] break-words">{value}</p>
    </article>
  );
}
