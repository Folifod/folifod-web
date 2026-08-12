import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { prisma } from "@/lib/prisma";

export default async function AdminTrainingsPage() {
  const trainings = await prisma.training.findMany({ orderBy: [{ updatedAt: "desc" }] });

  return (
    <div>
      <AdminPageHeader
        title="Trainings"
        description="Manage training programs shown on the site."
        actionHref="/admin/trainings/new"
        actionLabel="New training"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Trainings" },
        ]}
      />

      <div className="overflow-hidden rounded-lg border border-[#d9e4ee] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#f7fafc] text-xs uppercase tracking-wide text-[#5b6b7a]">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Featured</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {trainings.map((training) => (
              <tr key={training.id} className="border-t border-[#e8eef4]">
                <td className="px-4 py-3 font-medium text-[#123]">{training.title}</td>
                <td className="px-4 py-3">
                  <AdminStatusBadge status={training.status} />
                </td>
                <td className="px-4 py-3 text-[#5b6b7a]">{training.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/trainings/${training.id}`} className="font-semibold text-[#00aeef]">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {trainings.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[#5b6b7a]">
                  No trainings yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
