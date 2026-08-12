import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogsPage() {
  const blogs = await prisma.blogPost.findMany({ orderBy: [{ updatedAt: "desc" }] });

  return (
    <div>
      <AdminPageHeader
        title="Blogs"
        description="Publish news and insights."
        actionHref="/admin/blogs/new"
        actionLabel="New post"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Blogs" },
        ]}
      />

      <div className="overflow-hidden rounded-lg border border-[#d9e4ee] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#f7fafc] text-xs uppercase tracking-wide text-[#5b6b7a]">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Author</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id} className="border-t border-[#e8eef4]">
                <td className="px-4 py-3 font-medium text-[#123]">{blog.title}</td>
                <td className="px-4 py-3">
                  <AdminStatusBadge status={blog.status} />
                </td>
                <td className="px-4 py-3 text-[#5b6b7a]">{blog.authorName || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/blogs/${blog.id}`} className="font-semibold text-[#00aeef]">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[#5b6b7a]">
                  No blog posts yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
