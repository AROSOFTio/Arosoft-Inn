import fs from "node:fs";
import path from "node:path";
import multer from "multer";

const uploadRoot = path.resolve(process.cwd(), "uploads");
const allowedExtensions = new Set([".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".zip"]);
const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
]);

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function safeFileName(originalName: string) {
  const ext = path.extname(originalName);
  const base = path
    .basename(originalName, ext)
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

  return `${base || "upload"}-${Date.now()}${ext.toLowerCase()}`;
}

export function createUpload(folder: string) {
  const destination = path.join(uploadRoot, folder);
  ensureDir(destination);

  return multer({
    storage: multer.diskStorage({
      destination(_req, _file, cb) {
        ensureDir(destination);
        cb(null, destination);
      },
      filename(_req, file, cb) {
        cb(null, safeFileName(file.originalname));
      },
    }),
    limits: {
      fileSize: 20 * 1024 * 1024,
      files: 8,
    },
    fileFilter(_req, file, cb) {
      const extensionAllowed = allowedExtensions.has(path.extname(file.originalname).toLowerCase());
      const mimeAllowed = allowedMimeTypes.has(file.mimetype);
      cb(null, extensionAllowed && mimeAllowed);
    },
  });
}

export function fileToUrl(file?: Express.Multer.File) {
  if (!file) {
    return null;
  }

  const relative = path.relative(uploadRoot, file.path).replace(/\\/g, "/");
  return `/uploads/${relative}`;
}
