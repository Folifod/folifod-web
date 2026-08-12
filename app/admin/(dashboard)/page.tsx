import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminDashboardCounts } from "@/lib/content";

export default async function AdminDashboardPage() {
  const counts = await getAdminDashboardCounts();

  const cards = [
    {
      title: "Projects",
      href: "/admin/projects",
      total: counts.projects.total,
      published: counts.projects.published,
    },
    {
      title: "Trainings",
      href: "/admin/trainings",
      total: counts.trainings.total,
      published: counts.trainings.published,
    },
    {
      title: "Blogs",
      href: "/admin/blogs",
      total: counts.blogs.total,
      published: counts.blogs.published,
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Manage Folifod projects, trainings, and blog content."
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Dashboard" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-[#d9e4ee] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-semibold text-[#5b6b7a]">{card.title}</p>
            <p className="mt-3 text-3xl font-bold text-[#123]">{card.total}</p>
            <p className="mt-1 text-sm text-[#00aeef]">{card.published} published</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
