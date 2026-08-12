import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPage() {
  return (
    <div>
      <AdminPageHeader
        title="New blog post"
        description="Write a new article."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Blogs", href: "/admin/blogs" },
          { label: "New" },
        ]}
      />
      <BlogForm />
    </div>
  );
}
