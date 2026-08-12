"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminInputClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
} from "@/components/admin/admin-form-styles";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

type BlogFormProps = {
  initial?: {
    id?: string;
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    authorName?: string;
    status?: "DRAFT" | "PUBLISHED";
  };
};

function isEmptyHtml(html: string) {
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return text.length === 0;
}

export function BlogForm({ initial }: BlogFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState(initial?.content ?? "");
  const isEdit = Boolean(initial?.id);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    if (isEmptyHtml(content)) {
      setSubmitting(false);
      setError("Content is required.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") || ""),
      slug: String(formData.get("slug") || "") || undefined,
      excerpt: String(formData.get("excerpt") || "") || null,
      content,
      coverImage: String(formData.get("coverImage") || "") || null,
      authorName: String(formData.get("authorName") || "") || null,
      status: String(formData.get("status") || "DRAFT"),
    };

    const response = await fetch(isEdit ? `/api/admin/blogs/${initial?.id}` : "/api/admin/blogs", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setError(typeof result.error === "string" ? result.error : "Unable to save blog post.");
      return;
    }

    router.push("/admin/blogs");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id || !confirm("Delete this blog post?")) {
      return;
    }

    setSubmitting(true);
    const response = await fetch(`/api/admin/blogs/${initial.id}`, { method: "DELETE" });
    setSubmitting(false);

    if (!response.ok) {
      setError("Unable to delete blog post.");
      return;
    }

    router.push("/admin/blogs");
    router.refresh();
  }

  return (
    <form className="max-w-3xl space-y-4 rounded-lg border border-[#d9e4ee] bg-white p-6" onSubmit={handleSubmit}>
      <div>
        <label className={adminLabelClassName} htmlFor="title">
          Title
        </label>
        <input id="title" name="title" required defaultValue={initial?.title} className={adminInputClassName} />
      </div>
      <div>
        <label className={adminLabelClassName} htmlFor="slug">
          Slug
        </label>
        <input id="slug" name="slug" defaultValue={initial?.slug} className={adminInputClassName} />
      </div>
      <div>
        <label className={adminLabelClassName} htmlFor="excerpt">
          Excerpt
        </label>
        <textarea id="excerpt" name="excerpt" rows={3} defaultValue={initial?.excerpt} className={adminInputClassName} />
      </div>
      <div>
        <label className={adminLabelClassName}>Content</label>
        <div className="mt-1">
          <RichTextEditor value={content} onChange={setContent} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ImageUploadField
          id="coverImage"
          name="coverImage"
          label="Cover image"
          defaultValue={initial?.coverImage}
          folder="blogs"
        />
        <div>
          <label className={adminLabelClassName} htmlFor="authorName">
            Author
          </label>
          <input id="authorName" name="authorName" defaultValue={initial?.authorName} className={adminInputClassName} />
        </div>
      </div>
      <div>
        <label className={adminLabelClassName} htmlFor="status">
          Status
        </label>
        <select id="status" name="status" defaultValue={initial?.status ?? "DRAFT"} className={adminInputClassName}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={submitting} className={adminPrimaryButtonClassName}>
          {submitting ? "Saving..." : isEdit ? "Update post" : "Create post"}
        </button>
        {isEdit ? (
          <button type="button" disabled={submitting} onClick={handleDelete} className={adminSecondaryButtonClassName}>
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
