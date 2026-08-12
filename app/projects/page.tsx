import type { Metadata } from "next";
import { SITE } from "@/constants/site";
import { SiteShell } from "@/components/layouts/site-shell";
import { ProjectsPageHero } from "@/components/sections/projects-page/projects-page-hero";
import { ProjectsPageGallerySection } from "@/components/sections/projects-page/projects-page-gallery-section";
import { ProjectsPageCallbackMapSection } from "@/components/sections/projects-page/projects-page-callback-map-section";
import { BuildCtaSection } from "@/components/sections/build-cta/build-cta-section";
import { getPublishedProjects } from "@/lib/content";
import { mapProjectsToPageCards } from "@/lib/projects-display";

export const metadata: Metadata = {
  title: `Projects | ${SITE.title}`,
  description:
    "Explore Folifod Integrated Services Limited engineering, fabrication, and asset integrity projects.",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  const cards = mapProjectsToPageCards(projects);

  return (
    <SiteShell>
      <ProjectsPageHero />
      <ProjectsPageGallerySection cards={cards} />
      <ProjectsPageCallbackMapSection />
      <BuildCtaSection />
    </SiteShell>
  );
}
