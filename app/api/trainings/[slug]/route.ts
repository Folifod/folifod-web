import { NextResponse } from "next/server";
import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const training = await prisma.training.findFirst({
    where: { slug, status: PublishStatus.PUBLISHED },
  });

  if (!training) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ training });
}
