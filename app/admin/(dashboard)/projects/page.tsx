import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { prisma } from "@/lib/prisma";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Create and publish project case studies."
        actionHref="/admin/projects/new"
        actionLabel="New project"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Projects" },
        ]}
      />

      <div className="overflow-hidden rounded-lg border border-[#d9e4ee] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#f7fafc] text-xs uppercase tracking-wide text-[#5b6b7a]">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Featured</th>
              <th className="px-4 py-3 font-semibold">Updated</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-[#e8eef4]">
                <td className="px-4 py-3 font-medium text-[#123]">{project.title}</td>
                <td className="px-4 py-3">
                  <AdminStatusBadge status={project.status} />
                </td>
                <td className="px-4 py-3 text-[#5b6b7a]">{project.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-[#5b6b7a]">
                  {project.updatedAt.toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/projects/${project.id}`} className="font-semibold text-[#00aeef]">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#5b6b7a]">
                  No projects yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
