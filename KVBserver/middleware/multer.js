import multer from "multer";
import path from "path";

// Memory storage for Cloudinary uploads
const memoryStorage = multer.memoryStorage();

// Disk storage for temporary files (if needed)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/temp");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
    // Archives (for bulk uploads)
    "application/zip",
    "application/x-zip-compressed",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// File size limits (in bytes)
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB for single files
  files: 10, // Maximum 10 files
};

// Create multer instances with different configurations

// For single file uploads (products, profile images)
export const singleUpload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for single files
}).single("file");

// For multiple file uploads (enquiries, task attachments)
export const upload = multer({
  storage: memoryStorage,
  fileFilter,
  limits,
});

// For Excel/CSV bulk imports
export const bulkUpload = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "application/vnd.ms-excel.sheet.macroEnabled.12", // .xlsm
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Only Excel (.xlsx, .xls) and CSV files are allowed"),
        false
      );
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for bulk uploads
}).single("file");

// For image-only uploads
export const imageUpload = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, WebP) are allowed"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for images
});

// Error handling middleware for multer
export const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large",
        message: "File size exceeds the maximum allowed limit",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        error: "Too many files",
        message: "Too many files uploaded",
      });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        error: "Unexpected file",
        message: "Unexpected file field",
      });
    }
  }

  if (error.message.includes("not allowed")) {
    return res.status(400).json({
      error: "Invalid file type",
      message: error.message,
    });
  }

  next(error);
};

// Legacy export for backward compatibility
export default singleUpload;
