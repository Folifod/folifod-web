import { NextResponse } from "next/server";
import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const blogs = await prisma.blogPost.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: [{ publishedAt: "desc" }],
  });
  return NextResponse.json({ blogs });
}
