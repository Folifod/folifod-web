import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/constants/site";
import type { ProjectDetailSection } from "@/constants/project-details";
import { SiteShell } from "@/components/layouts/site-shell";
import { ProjectDetailHero } from "@/components/sections/projects-detail/project-detail-hero";
import { ProjectDetailIntroSection } from "@/components/sections/projects-detail/project-detail-intro-section";
import { ProjectDetailGallerySection } from "@/components/sections/projects-detail/project-detail-gallery-section";
import { ProjectsPageCallbackMapSection } from "@/components/sections/projects-page/projects-page-callback-map-section";
import { BuildCtaSection } from "@/components/sections/build-cta/build-cta-section";
import { getPublishedProjectBySlug, getPublishedProjects } from "@/lib/content";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return { title: `Project | ${SITE.title}` };
  }

  return {
    title: `${project.title} | ${SITE.title}`,
    description: project.excerpt ?? `Project details for ${project.title}.`,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const dbProject = await getPublishedProjectBySlug(slug);

  if (!dbProject) {
    notFound();
  }

  const project = {
    title: dbProject.title,
    date: dbProject.dateLabel ? `Date: ${dbProject.dateLabel}` : "",
    client: dbProject.client ?? "",
    location: dbProject.location ?? "",
    sections: dbProject.sections as ProjectDetailSection[],
    heroImage: dbProject.heroImage || "/project-details-hero.jpg",
    introImage: dbProject.introImage || dbProject.heroImage || "/project-1-main.png",
    galleryImages: dbProject.galleryImages,
  };

  return (
    <SiteShell>
      <ProjectDetailHero title={project.title} image={project.heroImage} />
      <ProjectDetailIntroSection
        date={project.date}
        title={project.title}
        client={project.client}
        location={project.location}
        sections={project.sections}
        introImage={project.introImage}
      />
      <ProjectDetailGallerySection title={project.title} images={project.galleryImages} />
      <ProjectsPageCallbackMapSection />
      <BuildCtaSection />
    </SiteShell>
  );
}
