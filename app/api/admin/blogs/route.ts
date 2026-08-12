import { NextResponse } from "next/server";
import { publishedAtForStatus, requireSession } from "@/lib/admin-auth";
import { slugify } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { blogInputSchema } from "@/lib/validations";

export async function GET() {
  const authResult = await requireSession();
  if ("error" in authResult) {
    return authResult.error;
  }

  const blogs = await prisma.blogPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });

  return NextResponse.json({ blogs });
}

export async function POST(request: Request) {
  const authResult = await requireSession();
  if ("error" in authResult) {
    return authResult.error;
  }

  const body = await request.json();
  const parsed = blogInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.slug?.trim() || slugify(data.title);
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
  }

  const blog = await prisma.blogPost.create({
    data: {
      slug,
      title: data.title,
      excerpt: data.excerpt ?? null,
      content: data.content,
      coverImage: data.coverImage ?? null,
      authorName: data.authorName ?? null,
      status: data.status,
      publishedAt: publishedAtForStatus(data.status),
    },
  });

  return NextResponse.json({ blog }, { status: 201 });
}
