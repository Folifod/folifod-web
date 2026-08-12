import { NextResponse } from "next/server";
import { publishedAtForStatus, requireSession } from "@/lib/admin-auth";
import { slugify } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { blogInputSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const authResult = await requireSession();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await context.params;
  const blog = await prisma.blogPost.findUnique({ where: { id } });
  if (!blog) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ blog });
}

export async function PUT(request: Request, context: RouteContext) {
  const authResult = await requireSession();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await context.params;
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = blogInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.slug?.trim() || slugify(data.title);
  const slugConflict = await prisma.blogPost.findFirst({
    where: { slug, NOT: { id } },
  });
  if (slugConflict) {
    return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
  }

  const blog = await prisma.blogPost.update({
    where: { id },
    data: {
      slug,
      title: data.title,
      excerpt: data.excerpt ?? null,
      content: data.content,
      coverImage: data.coverImage ?? null,
      authorName: data.authorName ?? null,
      status: data.status,
      publishedAt: publishedAtForStatus(data.status, existing.publishedAt),
    },
  });

  return NextResponse.json({ blog });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authResult = await requireSession();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { id } = await context.params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
