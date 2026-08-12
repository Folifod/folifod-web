"use client";

import Image from "next/image";
import { ChangeEvent, useId, useState } from "react";
import {
  adminInputClassName,
  adminLabelClassName,
  adminSecondaryButtonClassName,
} from "@/components/admin/admin-form-styles";
import { uploadAdminImage } from "@/lib/upload-client";

type ImageUploadFieldProps = {
  id?: string;
  name: string;
  label: string;
  defaultValue?: string;
  folder?: string;
  placeholder?: string;
};

export function ImageUploadField({
  id,
  name,
  label,
  defaultValue = "",
  folder = "uploads",
  placeholder = "/path/to/image.jpg or https://...",
}: ImageUploadFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const fileInputId = `${fieldId}-file`;
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const url = await uploadAdminImage(file, folder);
      setValue(url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div>
      <label className={adminLabelClassName} htmlFor={fieldId}>
        {label}
      </label>
      <input type="hidden" name={name} value={value} />
      <input
        id={fieldId}
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className={adminInputClassName}
      />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <label htmlFor={fileInputId} className={`${adminSecondaryButtonClassName} cursor-pointer`}>
          {uploading ? "Uploading..." : "Choose image"}
        </label>
        <input
          id={fileInputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          disabled={uploading}
          onChange={handleFileChange}
        />
        {value ? (
          <button
            type="button"
            className={adminSecondaryButtonClassName}
            onClick={() => setValue("")}
            disabled={uploading}
          >
            Clear
          </button>
        ) : null}
      </div>

      {error ? <p className="mt-2 text-xs text-[#b42318]">{error}</p> : null}

      {value ? (
        <div className="relative mt-3 h-28 w-full max-w-xs overflow-hidden rounded-md border border-[#d5dee7] bg-[#f7fafc]">
          <Image src={value} alt="" fill className="object-cover" sizes="320px" unoptimized />
        </div>
      ) : null}
    </div>
  );
}

type GalleryImagesFieldProps = {
  id?: string;
  name: string;
  label: string;
  defaultValue?: string;
  folder?: string;
};

export function GalleryImagesField({
  id,
  name,
  label,
  defaultValue = "",
  folder = "projects/gallery",
}: GalleryImagesFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const fileInputId = `${fieldId}-files`;
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const url = await uploadAdminImage(file, folder);
        uploadedUrls.push(url);
      }

      setValue((current) => {
        const existing = current
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        return [...existing, ...uploadedUrls].join("\n");
      });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload images.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div>
      <label className={adminLabelClassName} htmlFor={fieldId}>
        {label}
      </label>
      <textarea
        id={fieldId}
        name={name}
        rows={4}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="One image URL per line, or upload images from your device"
        className={adminInputClassName}
      />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <label htmlFor={fileInputId} className={`${adminSecondaryButtonClassName} cursor-pointer`}>
          {uploading ? "Uploading..." : "Choose images"}
        </label>
        <input
          id={fileInputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sr-only"
          disabled={uploading}
          onChange={handleFilesChange}
        />
      </div>

      {error ? <p className="mt-2 text-xs text-[#b42318]">{error}</p> : null}
    </div>
  );
}
