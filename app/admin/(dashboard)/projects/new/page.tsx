import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <AdminPageHeader
        title="New project"
        description="Add a project case study."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Projects", href: "/admin/projects" },
          { label: "New" },
        ]}
      />
      <ProjectForm />
    </div>
  );
}
