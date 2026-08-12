import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const authResult = await requireSuperAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await context.params;
  const invite = await prisma.adminInvite.findUnique({ where: { id } });
  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  if (invite.acceptedAt) {
    return NextResponse.json({ error: "Accepted invites cannot be revoked." }, { status: 400 });
  }

  await prisma.adminInvite.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
