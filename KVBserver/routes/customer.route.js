import express from "express";
import { protectCustomer } from "../middleware/customerAuthMiddleware.js";
import { upload } from "../middleware/multer.js";
import {
  submitEnquiry,
  getCustomerEnquiries,
  getCustomerProjects,
} from "../controllers/customer.controller.js";

const router = express.Router();

// All customer routes require authentication
router.use(protectCustomer);

// Enquiry routes
router.post("/enquiries", upload.array("attachments", 5), submitEnquiry);
router.get("/enquiries", getCustomerEnquiries);

// Project tracking routes
router.get("/projects", getCustomerProjects);

export default router;
