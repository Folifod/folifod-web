"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminInputClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
} from "@/components/admin/admin-form-styles";

type InviteRow = {
  id: string;
  email: string;
  expiresAt: string;
  acceptedAt: string | null;
  invitedBy: { email: string; name: string | null };
};

type AdminRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
};

export function AdminsManager({
  initialInvites,
  initialAdmins,
}: {
  initialInvites: InviteRow[];
  initialAdmins: AdminRow[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: String(formData.get("email") || "") }),
    });

    const result = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setError(typeof result.error === "string" ? result.error : "Unable to send invite.");
      return;
    }

    if (result.inviteUrl) {
      setMessage(`Invite created. Email provider not configured. Share this link: ${result.inviteUrl}`);
    } else {
      setMessage("Invite email sent.");
    }

    event.currentTarget.reset();
    router.refresh();
  }

  async function revokeInvite(id: string) {
    if (!confirm("Revoke this invite?")) {
      return;
    }

    const response = await fetch(`/api/admin/invites/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Unable to revoke invite.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleInvite}
        className="max-w-xl space-y-4 rounded-lg border border-[#d9e4ee] bg-white p-6"
      >
        <div>
          <label htmlFor="email" className={adminLabelClassName}>
            Invite admin by email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="new.admin@company.com"
            className={adminInputClassName}
          />
        </div>
        {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}
        {message ? <p className="break-all text-sm text-[#176b3b]">{message}</p> : null}
        <button type="submit" disabled={submitting} className={adminPrimaryButtonClassName}>
          {submitting ? "Sending..." : "Send invite"}
        </button>
      </form>

      <section>
        <h2 className="mb-3 text-lg font-bold text-[#123]">Pending invites</h2>
        <div className="overflow-hidden rounded-lg border border-[#d9e4ee] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f7fafc] text-xs uppercase tracking-wide text-[#5b6b7a]">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3">Invited by</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {initialInvites
                .filter((invite) => !invite.acceptedAt)
                .map((invite) => (
                  <tr key={invite.id} className="border-t border-[#e8eef4]">
                    <td className="px-4 py-3">{invite.email}</td>
                    <td className="px-4 py-3">{new Date(invite.expiresAt).toLocaleString()}</td>
                    <td className="px-4 py-3">{invite.invitedBy.email}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => revokeInvite(invite.id)}
                        className={adminSecondaryButtonClassName}
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              {initialInvites.filter((invite) => !invite.acceptedAt).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-[#5b6b7a]">
                    No pending invites.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-[#123]">Admins</h2>
        <div className="overflow-hidden rounded-lg border border-[#d9e4ee] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f7fafc] text-xs uppercase tracking-wide text-[#5b6b7a]">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {initialAdmins.map((admin) => (
                <tr key={admin.id} className="border-t border-[#e8eef4]">
                  <td className="px-4 py-3">{admin.name || "—"}</td>
                  <td className="px-4 py-3">{admin.email}</td>
                  <td className="px-4 py-3">{admin.role.replace("_", " ")}</td>
                  <td className="px-4 py-3">{new Date(admin.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
