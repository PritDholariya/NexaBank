import { Suspense } from "react";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";

export default function ChangePasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center text-sm font-semibold text-[#4b5f8f]">
          Loading...
        </main>
      }
    >
      <ChangePasswordForm />
    </Suspense>
  );
}
