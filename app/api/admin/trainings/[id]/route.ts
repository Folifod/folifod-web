import { NextResponse } from "next/server";
import { publishedAtForStatus, requireSession } from "@/lib/admin-auth";
import { slugify } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { trainingInputSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const authResult = await requireSession();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await context.params;
  const training = await prisma.training.findUnique({ where: { id } });
  if (!training) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ training });
}

export async function PUT(request: Request, context: RouteContext) {
  const authResult = await requireSession();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await context.params;
  const existing = await prisma.training.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = trainingInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.slug?.trim() || slugify(data.title);
  const slugConflict = await prisma.training.findFirst({
    where: { slug, NOT: { id } },
  });
  if (slugConflict) {
    return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
  }

  const training = await prisma.training.update({
    where: { id },
    data: {
      slug,
      title: data.title,
      dateLabel: data.dateLabel ?? null,
      meta: data.meta ?? null,
      location: data.location ?? null,
      description: data.description ?? null,
      image: data.image ?? null,
      featured: data.featured,
      status: data.status,
      publishedAt: publishedAtForStatus(data.status, existing.publishedAt),
    },
  });

  return NextResponse.json({ training });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authResult = await requireSession();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await context.params;
  await prisma.training.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
