import { NextResponse } from "next/server";
import { publishedAtForStatus, requireSession } from "@/lib/admin-auth";
import { slugify } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { trainingInputSchema } from "@/lib/validations";

export async function GET() {
  const authResult = await requireSession();
  if ("error" in authResult) {
    return authResult.error;
  }

  const trainings = await prisma.training.findMany({
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });

  return NextResponse.json({ trainings });
}

export async function POST(request: Request) {
  const authResult = await requireSession();
  if ("error" in authResult) {
    return authResult.error;
  }

  const body = await request.json();
  const parsed = trainingInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.slug?.trim() || slugify(data.title);
  const existing = await prisma.training.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
  }

  const training = await prisma.training.create({
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
      publishedAt: publishedAtForStatus(data.status),
    },
  });

  return NextResponse.json({ training }, { status: 201 });
}
