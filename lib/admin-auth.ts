import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { auth } from "@/lib/auth";

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}

export async function requireSuperAdmin() {
  const result = await requireSession();
  if ("error" in result) {
    return result;
  }

  if (result.session.user.role !== Role.SUPER_ADMIN) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return result;
}

export function publishedAtForStatus(status: "DRAFT" | "PUBLISHED", current?: Date | null) {
  if (status === "PUBLISHED") {
    return current ?? new Date();
  }
  return null;
}
