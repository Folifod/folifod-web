import { NextResponse } from "next/server";
import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const trainings = await prisma.training.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });
  return NextResponse.json({ trainings });
}
