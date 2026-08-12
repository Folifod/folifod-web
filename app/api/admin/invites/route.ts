import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { createInviteToken, hashToken } from "@/lib/crypto";
import { sendAdminInviteEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { inviteInputSchema } from "@/lib/validations";

export async function GET() {
  const authResult = await requireSuperAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const invites = await prisma.adminInvite.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      invitedBy: { select: { email: true, name: true } },
    },
  });

  const admins = await prisma.user.findMany({
    where: { role: { in: [Role.ADMIN, Role.SUPER_ADMIN] } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ invites, admins });
}

export async function POST(request: Request) {
  const authResult = await requireSuperAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const body = await request.json();
  const parsed = inviteInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
  }

  const token = createInviteToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);

  await prisma.adminInvite.updateMany({
    where: { email, acceptedAt: null },
    data: { expiresAt: new Date() },
  });

  const invite = await prisma.adminInvite.create({
    data: {
      email,
      tokenHash,
      role: Role.ADMIN,
      expiresAt,
      invitedById: authResult.session.user.id,
    },
  });

  const baseUrl = process.env.AUTH_URL ?? "http://localhost:3000";
  const inviteUrl = `${baseUrl}/admin/accept-invite?token=${token}`;

  try {
    await sendAdminInviteEmail({ to: email, inviteUrl });
  } catch (error) {
    await prisma.adminInvite.delete({ where: { id: invite.id } });
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send invite email",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    invite: {
      id: invite.id,
      email: invite.email,
      expiresAt: invite.expiresAt,
    },
    // Returned only when email provider is not configured (logged to console too).
    inviteUrl: process.env.RESEND_API_KEY ? undefined : inviteUrl,
  });
}
