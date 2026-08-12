import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/constants/site";
import { SiteShell } from "@/components/layouts/site-shell";
import { Container } from "@/components/shared/container";
import { getPublishedBlogBySlug, getPublishedBlogs } from "@/lib/content";
import { sanitizeBlogHtml } from "@/lib/sanitize-html";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const blogs = await getPublishedBlogs();
    return blogs.map((blog) => ({ slug: blog.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blog = await getPublishedBlogBySlug(slug);
    if (!blog) {
      return { title: `Blog | ${SITE.title}` };
    }
    return {
      title: `${blog.title} | ${SITE.title}`,
      description: blog.excerpt ?? blog.title,
    };
  } catch {
    return { title: `Blog | ${SITE.title}` };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug).catch(() => null);

  if (!blog) {
    notFound();
  }

  const html = sanitizeBlogHtml(blog.content);
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(blog.content);

  return (
    <SiteShell>
      <article>
        <section className="bg-[#0b2f44] py-14 text-white">
          <Container>
            <Link href="/blog" className="text-sm text-[#7fd7f5] hover:underline">
              ← Back to blog
            </Link>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold sm:text-4xl">{blog.title}</h1>
            <p className="mt-3 text-sm text-white/70">
              {[blog.authorName, blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </Container>
        </section>

        {blog.coverImage ? (
          <div className="relative h-[280px] w-full sm:h-[380px]">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        ) : null}

        <section className="bg-white py-12 sm:py-16">
          <Container>
            {looksLikeHtml ? (
              <div
                className="blog-content mx-auto max-w-3xl text-[15px] leading-7 text-[#4e4e4e]"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <div className="mx-auto max-w-3xl whitespace-pre-wrap text-[15px] leading-7 text-[#4e4e4e]">
                {blog.content}
              </div>
            )}
          </Container>
        </section>
      </article>
    </SiteShell>
  );
}
