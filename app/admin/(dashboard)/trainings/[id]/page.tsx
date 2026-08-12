import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TrainingForm } from "@/components/admin/training-form";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTrainingPage({ params }: PageProps) {
  const { id } = await params;
  const training = await prisma.training.findUnique({ where: { id } });
  if (!training) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader
        title="Edit training"
        description={training.title}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Trainings", href: "/admin/trainings" },
          { label: "Edit" },
        ]}
      />
      <TrainingForm
        initial={{
          id: training.id,
          title: training.title,
          slug: training.slug,
          dateLabel: training.dateLabel ?? "",
          meta: training.meta ?? "",
          location: training.location ?? "",
          description: training.description ?? "",
          image: training.image ?? "",
          featured: training.featured,
          status: training.status,
        }}
      />
    </div>
  );
}
