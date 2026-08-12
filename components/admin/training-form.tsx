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

type TrainingFormProps = {
  initial?: {
    id?: string;
    title?: string;
    slug?: string;
    dateLabel?: string;
    meta?: string;
    location?: string;
    description?: string;
    image?: string;
    featured?: boolean;
    status?: "DRAFT" | "PUBLISHED";
  };
};

export function TrainingForm({ initial }: TrainingFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(initial?.id);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") || ""),
      slug: String(formData.get("slug") || "") || undefined,
      dateLabel: String(formData.get("dateLabel") || "") || null,
      meta: String(formData.get("meta") || "") || null,
      location: String(formData.get("location") || "") || null,
      description: String(formData.get("description") || "") || null,
      image: String(formData.get("image") || "") || null,
      featured: formData.get("featured") === "on",
      status: String(formData.get("status") || "DRAFT"),
    };

    const response = await fetch(
      isEdit ? `/api/admin/trainings/${initial?.id}` : "/api/admin/trainings",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const result = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setError(typeof result.error === "string" ? result.error : "Unable to save training.");
      return;
    }

    router.push("/admin/trainings");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id || !confirm("Delete this training?")) {
      return;
    }

    setSubmitting(true);
    const response = await fetch(`/api/admin/trainings/${initial.id}`, { method: "DELETE" });
    setSubmitting(false);

    if (!response.ok) {
      setError("Unable to delete training.");
      return;
    }

    router.push("/admin/trainings");
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
          <label className={adminLabelClassName} htmlFor="meta">
            Meta
          </label>
          <input id="meta" name="meta" defaultValue={initial?.meta} className={adminInputClassName} />
        </div>
      </div>
      <div>
        <label className={adminLabelClassName} htmlFor="location">
          Location
        </label>
        <input id="location" name="location" defaultValue={initial?.location} className={adminInputClassName} />
      </div>
      <div>
        <label className={adminLabelClassName} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={initial?.description}
          className={adminInputClassName}
        />
      </div>
      <ImageUploadField
        id="image"
        name="image"
        label="Image"
        defaultValue={initial?.image}
        folder="trainings"
      />
      <div>
        <label className={adminLabelClassName} htmlFor="status">
          Status
        </label>
        <select id="status" name="status" defaultValue={initial?.status ?? "DRAFT"} className={adminInputClassName}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-[#334]">
        <input type="checkbox" name="featured" defaultChecked={initial?.featured} />
        Featured on home updates
      </label>

      {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={submitting} className={adminPrimaryButtonClassName}>
          {submitting ? "Saving..." : isEdit ? "Update training" : "Create training"}
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
