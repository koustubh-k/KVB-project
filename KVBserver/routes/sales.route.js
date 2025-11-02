import express from "express";
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
  sendLeadEmail,
  sendFollowUpEmail,
  getQuotations,
  createQuotation,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  sendQuotationEmail,
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
router.get("/leads/:id", authorizeRole("sales", "admin"), getLeadById);
router.put("/leads/:id", authorizeRole("sales", "admin"), updateLead);
router.delete("/leads/:id", authorizeRole("sales", "admin"), deleteLead);
router.post("/leads/:id/email", authorizeRole("sales", "admin"), sendLeadEmail);
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
router.get(
  "/quotations/:id",
  authorizeRole("customer", "sales", "admin"),
  getQuotationById
);
router.put("/quotations/:id", authorizeRole("sales", "admin"), updateQuotation);
router.delete(
  "/quotations/:id",
  authorizeRole("sales", "admin"),
  deleteQuotation
);
router.post(
  "/quotations/:id/email",
  authorizeRole("sales", "admin"),
  sendQuotationEmail
);

export default router;
