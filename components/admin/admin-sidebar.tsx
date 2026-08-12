"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

type AdminNavItem = {
  href: string;
  label: string;
  superAdminOnly?: boolean;
};

const NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/trainings", label: "Trainings" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/admins", label: "Admins", superAdminOnly: true },
];

type AdminSidebarProps = {
  role: string;
  email: string;
};

export function AdminSidebar({ role, email }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[#d9e4ee] bg-[#0b2f44] text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-xs uppercase tracking-[0.16em] text-[#7fd7f5]">Folifod Admin</p>
        <p className="mt-2 truncate text-sm text-white/80">{email}</p>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-white/50">{role.replace("_", " ")}</p>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.filter((item) => !item.superAdminOnly || role === "SUPER_ADMIN").map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "bg-[#00aeef] text-white" : "text-white/80 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full rounded-md border border-white/20 px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
