import { body, param, validationResult } from "express-validator";

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// --- Generic Validators ---

export const validateId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  handleValidationErrors,
];

export const validateTaskId = [
  param("taskId").isMongoId().withMessage("Invalid Task ID format"),
  handleValidationErrors,
];

export const validateForgotPassword = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  handleValidationErrors,
];

export const validateResetPassword = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

// --- Admin Validators ---

export const validateAdminSignup = [
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

export const validateAdminLogin = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

export const validateProduct = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  body("category").notEmpty().withMessage("Category is required"),
  body("stock")
    .isInt({ gt: -1 })
    .withMessage("Stock must be a non-negative integer"),
  handleValidationErrors,
];

export const validateTask = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("priority")
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),
  body("dueDate").isISO8601().toDate().withMessage("Invalid due date"),
  body("assignedTo")
    .optional()
    .isArray()
    .withMessage("assignedTo must be an array"),
  body("assignedTo.*")
    .if(body("assignedTo").exists())
    .isMongoId()
    .withMessage("Invalid worker ID"),
  body("customer").isMongoId().withMessage("Invalid customer ID"),
  body("product").optional().isMongoId().withMessage("Invalid product ID"),
  handleValidationErrors,
];

export const validateUpdateTask = [
  body("title").optional().notEmpty().withMessage("Title is required"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description is required"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),
  body("dueDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid due date"),
  body("assignedTo")
    .optional()
    .isArray()
    .withMessage("assignedTo must be an array"),
  body("assignedTo.*")
    .if(body("assignedTo").exists())
    .isMongoId()
    .withMessage("Invalid worker ID"),
  body("customer").optional().isMongoId().withMessage("Invalid customer ID"),
  body("product").optional().isMongoId().withMessage("Invalid product ID"),
  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed", "cancelled"])
    .withMessage("Invalid status"),
  handleValidationErrors,
];

// --- Worker Validators ---

export const validateWorkerSignup = [
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("specialization").notEmpty().withMessage("Specialization is required"),
  handleValidationErrors,
];

export const validateWorkerLogin = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

export const validateTaskStatusUpdate = [
  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed", "cancelled"])
    .withMessage("Invalid status value"),
  body("comment").optional().isString().withMessage("Comment must be a string"),
  handleValidationErrors,
];

// --- Customer Validators ---

export const validateCustomerSignup = [
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("address").notEmpty().withMessage("Address is required"),
  handleValidationErrors,
];

export const validateCustomerLogin = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// --- User (Original Auth) Validators ---

export const validateUpdateProfile = [
  body("profilePic")
    .notEmpty()
    .withMessage("Profile picture is required")
    .isString(),
  handleValidationErrors,
];
