import { NextResponse } from "next/server";
import { publishedAtForStatus, requireSession } from "@/lib/admin-auth";
import { slugify } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { projectInputSchema } from "@/lib/validations";

export async function GET() {
  const authResult = await requireSession();
  if ("error" in authResult) {
    return authResult.error;
  }

  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const authResult = await requireSession();
  if ("error" in authResult) {
    return authResult.error;
  }

  const body = await request.json();
  const parsed = projectInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.slug?.trim() || slugify(data.title);
  const existing = await prisma.project.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
  }

  const project = await prisma.project.create({
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
      publishedAt: publishedAtForStatus(data.status),
    },
  });

  return NextResponse.json({ project }, { status: 201 });
}
