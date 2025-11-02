import Lead from "../models/lead.model.js";
import Quotation from "../models/quotation.model.js";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";
import Task from "../models/task.model.js";
import {
  sendEmail,
  sendQuotationNotification,
  sendQuotationAcceptedNotification,
} from "../utils/emailService.js";

// @desc    Get all leads
// @route   GET /api/sales/leads
// @access  Private (Sales, Admin)
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("assignedTo", "fullName")
      .populate("notes.addedBy", "fullName email");
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new lead
// @route   POST /api/sales/leads
// @access  Private (Sales, Admin)
export const createLead = async (req, res) => {
  try {
    const { name, email, phone, region, source, notes, message } = req.body;
    const lead = new Lead({
      name,
      email,
      phone,
      region,
      source,
      notes,
      message, // Add message field
      assignedTo: req.user._id,
    });
    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lead status
// @route   PUT /api/sales/leads/:id
// @access  Private (Sales, Admin)
export const updateLead = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    );
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add note to lead
// @route   POST /api/sales/leads/:id/notes
// @access  Private (Sales, Admin)
export const addLeadNote = async (req, res) => {
  try {
    const { message, addedBy } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Note message is required" });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Add the new note to the notes array
    const newNote = {
      message: message.trim(),
      addedBy: addedBy || req.user._id,
      addedAt: new Date(),
    };

    lead.notes.push(newNote);
    await lead.save();

    // Populate the addedBy field for the response
    await lead.populate("notes.addedBy", "fullName email");

    res.status(201).json({
      message: "Note added successfully",
      lead: lead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send follow-up email
// @route   POST /api/sales/send-email
// @access  Private (Sales, Admin)
export const sendFollowUpEmail = async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    await sendEmail(to, subject, text, html);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all quotations
// @route   GET /api/sales/quotations
// @access  Private (Sales, Admin, Customer)
export const getQuotations = async (req, res) => {
  try {
    let quotations;
    if (req.user.role === "customer") {
      quotations = await Quotation.find({ customerId: req.user._id }).populate(
        "productId"
      );
    } else {
      quotations = await Quotation.find().populate("customerId productId");
    }
    res.status(200).json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new quotation
// @route   POST /api/sales/quotations
// @access  Private (Customer, Sales, Admin)
export const createQuotation = async (req, res) => {
  try {
    const { productId, details, price } = req.body;
    const quotation = new Quotation({
      customerId: req.user._id,
      productId,
      details,
      price,
      createdBy: req.user._id,
      createdByModel: req.user.role === "sales" ? "Sales" : "Admin",
    });
    await quotation.save();
    res.status(201).json(quotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update quotation status
// @route   PUT /api/sales/quotations/:id
// @access  Private (Sales, Admin)
export const updateQuotation = async (req, res) => {
  try {
    const { status, price } = req.body;
    const oldQuotation = await Quotation.findById(req.params.id).populate(
      "customerId productId"
    );

    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      { status, price },
      { new: true }
    ).populate("customerId productId");

    // Send email notifications based on status change
    if (status && oldQuotation.status !== status) {
      try {
        if (status === "quotation sent") {
          // Send quotation notification to customer
          await sendQuotationNotification(
            quotation.customerId.email,
            quotation.customerId.fullName,
            quotation._id,
            quotation.productId.name
          );
        } else if (status === "accepted") {
          // Send acceptance notification
          await sendQuotationAcceptedNotification(
            quotation.customerId.email,
            quotation.customerId.fullName,
            quotation._id,
            quotation.productId.name
          );

          // Create installation task automatically
          const task = new Task({
            title: `Installation for ${quotation.productId.name}`,
            description: `Installation task created from accepted quotation ${quotation._id}`,
            priority: "medium",
            status: "pending",
            location: quotation.customerId.address || "To be confirmed",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            assignedTo: [], // To be assigned by admin
            assignedBy: req.user._id,
            customer: quotation.customerId._id,
            product: quotation.productId._id,
          });

          await task.save();
        }
      } catch (emailError) {
        console.error("Failed to send quotation email:", emailError);
        // Don't fail the update if email fails
      }
    }

    res.status(200).json(quotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
