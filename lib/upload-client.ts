export async function uploadAdminImage(file: File, folder: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body: formData,
  });

  const result = (await response.json()) as { url?: string; error?: string };

  if (!response.ok || !result.url) {
    throw new Error(result.error ?? "Unable to upload image.");
  }

  return result.url;
}
