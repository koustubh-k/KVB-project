import express from "express";
import {
  getLeads,
  createLead,
  updateLead,
  sendFollowUpEmail,
  getQuotations,
  createQuotation,
  updateQuotation,
  addLeadNote,
} from "../controllers/sales.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All sales routes require authentication
router.use(protectRoute);

// Leads routes - Sales and Admin only
router.get("/leads", authorizeRole("sales", "admin"), getLeads);
router.post("/leads", authorizeRole("sales", "admin"), createLead);
router.put("/leads/:id", authorizeRole("sales", "admin"), updateLead);
router.post("/leads/:id/notes", authorizeRole("sales", "admin"), addLeadNote);

// Email follow-up - Sales and Admin only
router.post("/send-email", authorizeRole("sales", "admin"), sendFollowUpEmail);

// Quotations routes - Customer, Sales, Admin
router.get(
  "/quotations",
  authorizeRole("customer", "sales", "admin"),
  getQuotations
);
router.post(
  "/quotations",
  authorizeRole("customer", "sales", "admin"),
  createQuotation
);
router.put("/quotations/:id", authorizeRole("sales", "admin"), updateQuotation);

export default router;
