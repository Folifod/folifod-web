import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE } from "@/constants/site";
import { SiteShell } from "@/components/layouts/site-shell";
import { UpdatesPageHero } from "@/components/sections/updates/updates-page-hero";
import { UpdatesPageTabs } from "@/components/sections/updates/updates-page-tabs";
import { BuildCtaSection } from "@/components/sections/build-cta/build-cta-section";
import { getPublishedProjects, getPublishedTrainings } from "@/lib/content";

export const metadata: Metadata = {
  title: `Updates | ${SITE.title}`,
  description: "Browse Folifod projects and training programmes.",
};

type UpdatesPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function UpdatesPage({ searchParams }: UpdatesPageProps) {
  const { tab } = await searchParams;
  const initialTab = tab === "trainings" ? "trainings" : "projects";

  const [projects, trainings] = await Promise.all([getPublishedProjects(), getPublishedTrainings()]);

  const projectRows = projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    dateLabel: project.dateLabel ?? "",
    client: project.client,
    location: project.location,
    excerpt: project.excerpt,
  }));

  const trainingRows = trainings.map((training) => ({
    slug: training.slug,
    title: training.title,
    dateLabel: training.dateLabel ?? "",
    meta: training.meta,
    location: training.location,
    description: training.description,
  }));

  return (
    <SiteShell>
      <UpdatesPageHero />
      <Suspense fallback={<div className="bg-[#f3f3f3] py-16" />}>
        <UpdatesPageTabs projects={projectRows} trainings={trainingRows} initialTab={initialTab} />
      </Suspense>
      <BuildCtaSection />
    </SiteShell>
  );
}
