import crypto from "crypto";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export function cloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME && API_KEY && API_SECRET);
}

export function getCloudinaryConfig() {
  if (!cloudinaryConfigured()) {
    throw new Error("Cloudinary credentials missing");
  }
  return { cloudName: CLOUD_NAME!, apiKey: API_KEY!, apiSecret: API_SECRET! };
}

// We use signed uploads — the browser hits Cloudinary directly with a
// short-lived signature we mint here. The API secret never leaves the server.
export interface UploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
}

export function buildUploadSignature(opts: {
  folder?: string;
}): UploadSignature {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = opts.folder ?? "bullonipizza";
  // Cloudinary requires params sorted alphabetically when building the
  // string to sign.
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");
  return { cloudName, apiKey, timestamp, signature, folder };
}
