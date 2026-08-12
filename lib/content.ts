import { PublishStatus, type Prisma } from "@prisma/client";
import type { ProjectDetailSection } from "@/constants/project-details";
import { prisma } from "@/lib/prisma";

export type HomeUpdateItem = {
  id: string;
  kind: "PROJECT" | "TRAINING";
  category: "PROJECTS" | "TRAINING";
  title: string;
  date: string;
  meta: string;
  location?: string;
  image: string;
  href: string;
  featured: boolean;
};

function asSections(value: Prisma.JsonValue): ProjectDetailSection[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value as ProjectDetailSection[];
}

export async function getPublishedProjects() {
  return prisma.project.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });
}

export async function getPublishedProjectBySlug(slug: string) {
  const project = await prisma.project.findFirst({
    where: { slug, status: PublishStatus.PUBLISHED },
  });

  if (!project) {
    return null;
  }

  return {
    ...project,
    sections: asSections(project.sections),
  };
}

export async function getPublishedTrainings() {
  return prisma.training.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });
}

export async function getPublishedTrainingBySlug(slug: string) {
  return prisma.training.findFirst({
    where: { slug, status: PublishStatus.PUBLISHED },
  });
}

export async function getPublishedBlogs() {
  return prisma.blogPost.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: [{ publishedAt: "desc" }],
  });
}

export async function getPublishedBlogBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, status: PublishStatus.PUBLISHED },
  });
}

export async function getHomeUpdates(): Promise<{
  featured: HomeUpdateItem | null;
  standard: HomeUpdateItem[];
}> {
  const [projects, trainings] = await Promise.all([
    getPublishedProjects(),
    getPublishedTrainings(),
  ]);

  const projectItems: HomeUpdateItem[] = projects.map((project) => ({
    id: project.id,
    kind: "PROJECT",
    category: "PROJECTS",
    title: project.title,
    date: project.dateLabel ?? "",
    meta: project.excerpt ?? project.client ?? "",
    location: project.location?.replace(/^Location:\s*/i, "") || undefined,
    image: project.introImage || project.heroImage || "/Service Image 3.png",
    href: `/projects/${project.slug}`,
    featured: project.featured,
  }));

  const trainingItems: HomeUpdateItem[] = trainings.map((training) => ({
    id: training.id,
    kind: "TRAINING",
    category: "TRAINING",
    title: training.title,
    date: training.dateLabel ?? "",
    meta: training.meta ?? "",
    location: training.location || undefined,
    image: training.image || "/training-1.png",
    href: `/trainings/${training.slug}`,
    featured: training.featured,
  }));

  const all = [...projectItems, ...trainingItems].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return 0;
  });

  const featured = all.find((item) => item.featured) ?? all[0] ?? null;
  const standard = all.filter((item) => item.id !== featured?.id).slice(0, 2);

  return { featured, standard };
}

export async function getAdminDashboardCounts() {
  const [
    projectsTotal,
    projectsPublished,
    trainingsTotal,
    trainingsPublished,
    blogsTotal,
    blogsPublished,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: PublishStatus.PUBLISHED } }),
    prisma.training.count(),
    prisma.training.count({ where: { status: PublishStatus.PUBLISHED } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: PublishStatus.PUBLISHED } }),
  ]);

  return {
    projects: { total: projectsTotal, published: projectsPublished },
    trainings: { total: trainingsTotal, published: trainingsPublished },
    blogs: { total: blogsTotal, published: blogsPublished },
  };
}
