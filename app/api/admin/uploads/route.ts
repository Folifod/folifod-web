import { NextResponse } from "next/server";
import { requireSession } from "@/lib/admin-auth";
import { isCloudinaryConfigured, uploadImageBuffer } from "@/lib/cloudinary";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function sanitizeFolder(value: FormDataEntryValue | null) {
  const folder = String(value ?? "uploads")
    .trim()
    .replace(/[^a-zA-Z0-9/_-]/g, "")
    .slice(0, 80);

  return folder || "uploads";
}

export async function POST(request: Request) {
  const authResult = await requireSession();
  if ("error" in authResult) {
    return authResult.error;
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Add CLOUDINARY_* variables to your environment." },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image file provided." }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, WEBP, and GIF images are allowed." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "Image must be 5MB or smaller." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = sanitizeFolder(formData.get("folder"));
    const result = await uploadImageBuffer(buffer, { folder });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return NextResponse.json({ error: "Unable to upload image." }, { status: 500 });
  }
}
