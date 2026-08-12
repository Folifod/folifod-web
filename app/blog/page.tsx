import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/constants/site";
import { SiteShell } from "@/components/layouts/site-shell";
import { Container } from "@/components/shared/container";
import { getPublishedBlogs } from "@/lib/content";

export const metadata: Metadata = {
  title: `Blog | ${SITE.title}`,
  description: "News, training highlights, and project stories from Folifod.",
};

export default async function BlogIndexPage() {
  let blogs: Awaited<ReturnType<typeof getPublishedBlogs>> = [];

  try {
    blogs = await getPublishedBlogs();
  } catch {
    blogs = [];
  }

  return (
    <SiteShell>
      <section className="bg-[#0b2f44] py-16 text-white">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7fd7f5]">Insights</p>
          <h1 className="mt-2 text-4xl font-bold">Blog</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Updates from our engineering, integrity, and training teams.
          </p>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <Container>
          {blogs.length === 0 ? (
            <p className="text-[#5b6b7a]">No published posts yet.</p>
          ) : (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <li key={blog.id}>
                  <Link href={`/blog/${blog.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#eef4fa]">
                      {blog.coverImage ? (
                        <Image
                          src={blog.coverImage}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : null}
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#00aeef]">
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString()
                        : ""}
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-[#123] group-hover:text-[#00aeef]">
                      {blog.title}
                    </h2>
                    {blog.excerpt ? (
                      <p className="mt-2 text-sm leading-6 text-[#5b6b7a]">{blog.excerpt}</p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </SiteShell>
  );
}
