"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { SITE } from "@/constants/site";
import {
  adminInputClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
} from "@/components/admin/admin-form-styles";
import { EyeIcon, EyeOffIcon } from "@/components/shared/icons";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      redirect: false,
    });

    setSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b2f44] px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="flex justify-center">
          <Image
            src={SITE.logos.colored}
            alt={SITE.title}
            width={220}
            height={60}
            priority
            className="h-12 w-auto"
          />
        </div>
        <p className="mt-5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#00aeef]">
          Admin
        </p>
        <h1 className="mt-2 text-center text-2xl font-bold text-[#123]">Sign in</h1>
        <p className="mt-1 text-center text-sm text-[#5b6b7a]">
          Access the Folifod content dashboard.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className={adminLabelClassName}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={adminInputClassName}
              placeholder="admin@folifod.com"
            />
          </div>
          <div>
            <label htmlFor="password" className={adminLabelClassName}>
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className={cn(adminInputClassName, "mt-0 pr-10")}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#5b6b7a] transition-colors hover:text-[#123]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}

          <button type="submit" disabled={submitting} className={adminPrimaryButtonClassName}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
