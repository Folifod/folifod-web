import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader
        title="Edit project"
        description={project.title}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Projects", href: "/admin/projects" },
          { label: "Edit" },
        ]}
      />
      <ProjectForm
        initial={{
          id: project.id,
          title: project.title,
          slug: project.slug,
          dateLabel: project.dateLabel ?? "",
          client: project.client ?? "",
          location: project.location ?? "",
          excerpt: project.excerpt ?? "",
          heroImage: project.heroImage ?? "",
          introImage: project.introImage ?? "",
          galleryImages: project.galleryImages.join("\n"),
          sectionsJson: JSON.stringify(project.sections, null, 2),
          featured: project.featured,
          status: project.status,
        }}
      />
    </div>
  );
}
