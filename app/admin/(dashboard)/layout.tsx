import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#f3f7fb]">
      <AdminSidebar role={session.user.role} email={session.user.email} />
      <main className="flex-1 overflow-auto p-6 sm:p-8">{children}</main>
    </div>
  );
}
