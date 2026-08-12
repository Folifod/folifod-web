import bcrypt from "bcryptjs";
import { PrismaClient, PublishStatus, Role } from "@prisma/client";
import { PROJECT_SEEDS } from "./data/projects";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_SUPER_ADMIN_EMAIL ?? "admin@folifod.com";
  const password = process.env.SEED_SUPER_ADMIN_PASSWORD ?? "ChangeMe123!";
  const name = process.env.SEED_SUPER_ADMIN_NAME ?? "Folifod Super Admin";

  const passwordHash = await bcrypt.hash(password, 12);

  const superAdmin = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
    create: {
      email,
      name,
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });

  for (const project of PROJECT_SEEDS) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  await prisma.training.upsert({
    where: { slug: "quality-assurance-control-fundamentals" },
    update: {},
    create: {
      slug: "quality-assurance-control-fundamentals",
      title: "Quality Assurance & Control Fundamentals",
      dateLabel: "November 2025",
      meta: "3-Day Workshop",
      image: "/training-1.png",
      featured: false,
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date("2025-11-01"),
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "welcome-to-folifod-insights" },
    update: {},
    create: {
      slug: "welcome-to-folifod-insights",
      title: "Welcome to Folifod Insights",
      excerpt: "News, training highlights, and project stories from our team.",
      content:
        "Welcome to the Folifod blog. Here we share project milestones, training updates, and industry insights from our engineering and integrity teams.",
      coverImage: "/Service Image 3.png",
      authorName: "Folifod Team",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  console.log(`Seeded SUPER_ADMIN: ${superAdmin.email}`);
  console.log(`Seeded ${PROJECT_SEEDS.length} projects, sample training, and blog content.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
