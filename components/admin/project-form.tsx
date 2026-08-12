"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminInputClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
} from "@/components/admin/admin-form-styles";
import { GalleryImagesField, ImageUploadField } from "@/components/admin/image-upload-field";

type ProjectFormValues = {
  title: string;
  slug: string;
  dateLabel: string;
  client: string;
  location: string;
  excerpt: string;
  heroImage: string;
  introImage: string;
  galleryImages: string;
  sectionsJson: string;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED";
};

type ProjectFormProps = {
  initial?: Partial<ProjectFormValues> & { id?: string };
};

const defaultSections = `[
  {
    "type": "field",
    "label": "Project Brief",
    "value": "Describe the project brief",
    "stacked": true
  }
]`;

export function ProjectForm({ initial }: ProjectFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(initial?.id);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    let sections: unknown = [];
    try {
      sections = JSON.parse(String(formData.get("sectionsJson") || "[]"));
    } catch {
      setSubmitting(false);
      setError("Sections JSON is invalid.");
      return;
    }

    const payload = {
      title: String(formData.get("title") || ""),
      slug: String(formData.get("slug") || "") || undefined,
      dateLabel: String(formData.get("dateLabel") || "") || null,
      client: String(formData.get("client") || "") || null,
      location: String(formData.get("location") || "") || null,
      excerpt: String(formData.get("excerpt") || "") || null,
      heroImage: String(formData.get("heroImage") || "") || null,
      introImage: String(formData.get("introImage") || "") || null,
      galleryImages: String(formData.get("galleryImages") || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      sections,
      featured: formData.get("featured") === "on",
      status: String(formData.get("status") || "DRAFT"),
    };

    const response = await fetch(
      isEdit ? `/api/admin/projects/${initial?.id}` : "/api/admin/projects",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const result = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setError(typeof result.error === "string" ? result.error : "Unable to save project.");
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id || !confirm("Delete this project?")) {
      return;
    }

    setSubmitting(true);
    const response = await fetch(`/api/admin/projects/${initial.id}`, { method: "DELETE" });
    setSubmitting(false);

    if (!response.ok) {
      setError("Unable to delete project.");
      return;
    }

    router.push("/admin/projects");
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={adminLabelClassName} htmlFor="dateLabel">
            Date label
          </label>
          <input id="dateLabel" name="dateLabel" defaultValue={initial?.dateLabel} className={adminInputClassName} />
        </div>
        <div>
          <label className={adminLabelClassName} htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={initial?.status ?? "DRAFT"}
            className={adminInputClassName}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>
      <div>
        <label className={adminLabelClassName} htmlFor="client">
          Client
        </label>
        <input id="client" name="client" defaultValue={initial?.client} className={adminInputClassName} />
      </div>
      <div>
        <label className={adminLabelClassName} htmlFor="location">
          Location
        </label>
        <input id="location" name="location" defaultValue={initial?.location} className={adminInputClassName} />
      </div>
      <div>
        <label className={adminLabelClassName} htmlFor="excerpt">
          Excerpt
        </label>
        <textarea id="excerpt" name="excerpt" rows={3} defaultValue={initial?.excerpt} className={adminInputClassName} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ImageUploadField
          id="heroImage"
          name="heroImage"
          label="Hero image"
          defaultValue={initial?.heroImage}
          folder="projects/hero"
        />
        <ImageUploadField
          id="introImage"
          name="introImage"
          label="Intro image"
          defaultValue={initial?.introImage}
          folder="projects/intro"
        />
      </div>
      <GalleryImagesField
        id="galleryImages"
        name="galleryImages"
        label="Gallery images"
        defaultValue={initial?.galleryImages}
        folder="projects/gallery"
      />
      <div>
        <label className={adminLabelClassName} htmlFor="sectionsJson">
          Sections JSON
        </label>
        <textarea
          id="sectionsJson"
          name="sectionsJson"
          rows={10}
          defaultValue={initial?.sectionsJson ?? defaultSections}
          className={`${adminInputClassName} font-mono text-xs`}
        />
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-[#334]">
        <input type="checkbox" name="featured" defaultChecked={initial?.featured} />
        Featured on home updates
      </label>

      {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={submitting} className={adminPrimaryButtonClassName}>
          {submitting ? "Saving..." : isEdit ? "Update project" : "Create project"}
        </button>
        {isEdit ? (
          <button
            type="button"
            disabled={submitting}
            onClick={handleDelete}
            className={adminSecondaryButtonClassName}
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
