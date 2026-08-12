import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BlogForm } from "@/components/admin/blog-form";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params;
  const blog = await prisma.blogPost.findUnique({ where: { id } });
  if (!blog) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader
        title="Edit blog post"
        description={blog.title}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Blogs", href: "/admin/blogs" },
          { label: "Edit" },
        ]}
      />
      <BlogForm
        initial={{
          id: blog.id,
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt ?? "",
          content: blog.content,
          coverImage: blog.coverImage ?? "",
          authorName: blog.authorName ?? "",
          status: blog.status,
        }}
      />
    </div>
  );
}
