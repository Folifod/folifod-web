"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  adminInputClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
} from "@/components/admin/admin-form-styles";

export default function AcceptInviteClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/accept-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        name: String(formData.get("name") || ""),
        password: String(formData.get("password") || ""),
      }),
    });

    const result = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setError(typeof result.error === "string" ? result.error : "Unable to accept invite.");
      return;
    }

    router.push("/admin/login");
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b2f44] px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8">
          <h1 className="text-xl font-bold text-[#123]">Invalid invite</h1>
          <p className="mt-2 text-sm text-[#5b6b7a]">This invite link is missing a token.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b2f44] px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00aeef]">Admin invite</p>
        <h1 className="mt-2 text-2xl font-bold text-[#123]">Set your password</h1>
        <p className="mt-1 text-sm text-[#5b6b7a]">Create your admin account to access the dashboard.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className={adminLabelClassName}>
              Name
            </label>
            <input id="name" name="name" type="text" className={adminInputClassName} />
          </div>
          <div>
            <label htmlFor="password" className={adminLabelClassName}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className={adminInputClassName}
            />
          </div>

          {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}

          <button type="submit" disabled={submitting} className={adminPrimaryButtonClassName}>
            {submitting ? "Creating account..." : "Accept invite"}
          </button>
        </form>
      </div>
    </div>
  );
}
