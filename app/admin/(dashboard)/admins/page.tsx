import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminsManager } from "@/components/admin/admins-manager";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminAdminsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.SUPER_ADMIN) {
    redirect("/admin");
  }

  const [invites, admins] = await Promise.all([
    prisma.adminInvite.findMany({
      orderBy: { createdAt: "desc" },
      include: { invitedBy: { select: { email: true, name: true } } },
    }),
    prisma.user.findMany({
      where: { role: { in: [Role.ADMIN, Role.SUPER_ADMIN] } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Admins"
        description="Invite new admins by email. Only super admins can manage this page."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Admins" },
        ]}
      />
      <AdminsManager
        initialInvites={invites.map((invite) => ({
          id: invite.id,
          email: invite.email,
          expiresAt: invite.expiresAt.toISOString(),
          acceptedAt: invite.acceptedAt?.toISOString() ?? null,
          invitedBy: invite.invitedBy,
        }))}
        initialAdmins={admins.map((admin) => ({
          ...admin,
          createdAt: admin.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
