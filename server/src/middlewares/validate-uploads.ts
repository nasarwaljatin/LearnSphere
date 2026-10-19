import type { NextFunction, Request, Response } from "express";
import type { UploadedFile } from "express-fileupload";

const MB = 1024 * 1024;

// Upper bound for any single upload (Cloudinary's free plan caps videos at 100 MB)
export const MAX_UPLOAD_BYTES = 100 * MB;

type UploadRule = {
  extensions: string[];
  mimeTypes: string[];
  maxBytes: number;
  label: string;
};

const IMAGE: UploadRule = {
  extensions: ["jpg", "jpeg", "png", "webp", "gif"],
  mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  maxBytes: 5 * MB,
  label: "an image (jpg, png, webp, gif)",
};

const LECTURE: UploadRule = {
  extensions: ["mp4", "pdf"],
  mimeTypes: ["video/mp4", "application/pdf"],
  maxBytes: MAX_UPLOAD_BYTES,
  label: "an MP4 video or a PDF",
};

// Rules per multipart field name used by the frontend
const RULES: Record<string, UploadRule> = {
  thumbnailImage: IMAGE,
  displayPicture: { ...IMAGE, maxBytes: 1 * MB },
  video: LECTURE,
  pdf: { ...LECTURE, extensions: ["pdf"], mimeTypes: ["application/pdf"], label: "a PDF" },
};

const formatSize = (bytes: number) => `${Math.round(bytes / MB)} MB`;

// Rejects uploads with an unexpected field, type, or size before any of them
// reach Cloudinary / Google Drive, so bad files never cost an upload.
export const validateUploads = (req: Request, res: Response, next: NextFunction) => {
  if (!req.files) return next();

  for (const [field, value] of Object.entries(req.files)) {
    const rule = RULES[field];
    if (!rule) {
      return res.status(400).json({
        success: false,
        message: `Unexpected file field "${field}".`,
      });
    }

    const files = Array.isArray(value) ? value : [value as UploadedFile];
    if (files.length > 1) {
      return res.status(400).json({
        success: false,
        message: `Only one file is allowed for "${field}".`,
      });
    }

    for (const file of files) {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!rule.extensions.includes(extension) || !rule.mimeTypes.includes(file.mimetype)) {
        return res.status(415).json({
          success: false,
          message: `"${file.name}" must be ${rule.label}.`,
        });
      }
      if (file.size > rule.maxBytes) {
        return res.status(413).json({
          success: false,
          message: `"${file.name}" is too large. Maximum size is ${formatSize(rule.maxBytes)}.`,
        });
      }
    }
  }

  next();
};
