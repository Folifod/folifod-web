import { NextResponse } from "next/server";
import { publishedAtForStatus, requireSession } from "@/lib/admin-auth";
import { slugify } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { projectInputSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const authResult = await requireSession();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await context.params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PUT(request: Request, context: RouteContext) {
  const authResult = await requireSession();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await context.params;
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = projectInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.slug?.trim() || slugify(data.title);
  const slugConflict = await prisma.project.findFirst({
    where: { slug, NOT: { id } },
  });
  if (slugConflict) {
    return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      slug,
      title: data.title,
      dateLabel: data.dateLabel ?? null,
      client: data.client ?? null,
      location: data.location ?? null,
      excerpt: data.excerpt ?? null,
      sections: data.sections,
      heroImage: data.heroImage ?? null,
      introImage: data.introImage ?? null,
      galleryImages: data.galleryImages,
      featured: data.featured,
      status: data.status,
      publishedAt: publishedAtForStatus(data.status, existing.publishedAt),
    },
  });

  return NextResponse.json({ project });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authResult = await requireSession();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await context.params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
