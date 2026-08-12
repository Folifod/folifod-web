import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/constants/site";
import { SiteShell } from "@/components/layouts/site-shell";
import { TrainingDetailHero } from "@/components/sections/trainings-detail/training-detail-hero";
import { TrainingDetailContent } from "@/components/sections/trainings-detail/training-detail-content";
import { BuildCtaSection } from "@/components/sections/build-cta/build-cta-section";
import { getPublishedTrainingBySlug, getPublishedTrainings } from "@/lib/content";

type TrainingDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const trainings = await getPublishedTrainings();
  return trainings.map((training) => ({ slug: training.slug }));
}

export async function generateMetadata({ params }: TrainingDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const training = await getPublishedTrainingBySlug(slug);

  if (!training) {
    return { title: `Training | ${SITE.title}` };
  }

  return {
    title: `${training.title} | ${SITE.title}`,
    description: training.description ?? `Training details for ${training.title}.`,
  };
}

export default async function TrainingDetailPage({ params }: TrainingDetailPageProps) {
  const { slug } = await params;
  const training = await getPublishedTrainingBySlug(slug);

  if (!training) {
    notFound();
  }

  return (
    <SiteShell>
      <TrainingDetailHero title={training.title} image={training.image || "/training-1.png"} />
      <TrainingDetailContent
        title={training.title}
        dateLabel={training.dateLabel ?? ""}
        meta={training.meta ?? ""}
        location={training.location ?? ""}
        description={training.description ?? ""}
        image={training.image || "/training-1.png"}
      />
      <BuildCtaSection />
    </SiteShell>
  );
}
