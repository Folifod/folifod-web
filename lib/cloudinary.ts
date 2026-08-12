import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export function isCloudinaryConfigured() {
  return Boolean(cloudName && apiKey && apiSecret);
}

function getCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured.");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

type UploadImageOptions = {
  folder: string;
  filename?: string;
};

export async function uploadImageBuffer(buffer: Buffer, options: UploadImageOptions) {
  const client = getCloudinary();

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const upload = client.uploader.upload_stream(
      {
        folder: `folifod/${options.folder}`,
        resource_type: "image",
        ...(options.filename ? { public_id: options.filename } : {}),
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed."));
          return;
        }

        resolve(result);
      },
    );

    upload.end(buffer);
  });
}
