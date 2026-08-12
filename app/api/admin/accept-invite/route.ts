import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { hashToken } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { acceptInviteSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = acceptInviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const tokenHash = hashToken(parsed.data.token);
  const invite = await prisma.adminInvite.findUnique({ where: { tokenHash } });

  if (!invite || invite.acceptedAt || invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invite is invalid or expired." }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email: invite.email } });
  if (existingUser) {
    return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        email: invite.email,
        name: parsed.data.name ?? null,
        passwordHash,
        role: invite.role,
      },
    });

    await tx.adminInvite.update({
      where: { id: invite.id },
      data: { acceptedAt: new Date() },
    });

    return created;
  });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}
