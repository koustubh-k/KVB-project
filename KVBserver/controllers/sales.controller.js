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

    // Send welcome email to the lead
    try {
      const subject = `Thank you for your interest - KVB Green Energies`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5a27;">Welcome ${name}!</h2>
          <p>Thank you for your interest in KVB Green Energies. We have received your enquiry and our sales team will contact you shortly.</p>
          <p><strong>Your Details:</strong></p>
          <ul>
            <li>Name: ${name}</li>
            <li>Email: ${email}</li>
            <li>Phone: ${phone}</li>
            <li>Region: ${region}</li>
            ${message ? `<li>Message: ${message}</li>` : ""}
          </ul>
          <p>If you have any urgent questions, please contact us at:</p>
          <ul>
            <li>Email: sales@kvbenergies.com</li>
            <li>Phone: +91-XXXXXXXXXX</li>
          </ul>
          <br>
          <p>Best regards,<br>KVB Green Energies Sales Team</p>
        </div>
      `;

      await sendEmail(email, subject, "", html);
    } catch (emailError) {
      console.error("Failed to send lead welcome email:", emailError);
      // Don't fail lead creation if email fails
    }

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get lead by ID
// @route   GET /api/sales/leads/:id
// @access  Private (Sales, Admin)
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignedTo", "fullName email")
      .populate("notes.addedBy", "fullName email");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lead
// @route   PUT /api/sales/leads/:id
// @access  Private (Sales, Admin)
export const updateLead = async (req, res) => {
  try {
    const { name, email, phone, region, status, source, message } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, region, status, source, message },
      { new: true }
    ).populate("assignedTo", "fullName email");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete lead
// @route   DELETE /api/sales/leads/:id
// @access  Private (Sales, Admin)
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await Lead.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send email to lead
// @route   POST /api/sales/leads/:id/email
// @access  Private (Sales, Admin)
export const sendLeadEmail = async (req, res) => {
  try {
    const { subject, text, html } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await sendEmail(lead.email, subject, text, html);
    res.status(200).json({ message: "Email sent successfully to lead" });
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
    const { productId, details, price, leadId } = req.body;

    let customerId = req.user._id;

    // If leadId is provided, convert lead to customer
    if (leadId && req.user.role !== "customer") {
      const lead = await Lead.findById(leadId);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      // Check if customer already exists with this email
      let customer = await Customer.findOne({ email: lead.email });

      if (!customer) {
        // Create new customer from lead
        customer = new Customer({
          fullName: lead.name,
          email: lead.email,
          phone: lead.phone,
          address: lead.region, // Use region as address for now
        });
        await customer.save();
      }

      customerId = customer._id;

      // Update lead status to converted and link to customer
      await Lead.findByIdAndUpdate(leadId, {
        status: "converted",
        customerId: customer._id,
      });
    }

    const quotation = new Quotation({
      customerId,
      productId,
      details,
      price,
      createdBy: req.user._id,
      createdByModel: req.user.role === "sales" ? "Sales" : "Admin",
    });
    await quotation.save();

    // Populate the response
    await quotation.populate([
      { path: "customerId", select: "fullName email phone address" },
      { path: "productId" },
      { path: "createdBy", select: "fullName email" },
    ]);

    res.status(201).json(quotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quotation by ID
// @route   GET /api/sales/quotations/:id
// @access  Private (Customer, Sales, Admin)
export const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate("customerId", "fullName email phone address")
      .populate("productId")
      .populate("createdBy", "fullName email");

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    // Check if user has access to this quotation
    if (
      req.user.role === "customer" &&
      quotation.customerId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(quotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update quotation
// @route   PUT /api/sales/quotations/:id
// @access  Private (Sales, Admin)
export const updateQuotation = async (req, res) => {
  try {
    const { productId, details, status, price } = req.body;
    const oldQuotation = await Quotation.findById(req.params.id).populate(
      "customerId productId"
    );

    if (!oldQuotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      { productId, details, status, price },
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

// @desc    Delete quotation
// @route   DELETE /api/sales/quotations/:id
// @access  Private (Sales, Admin)
export const deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    await Quotation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Quotation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send email about quotation
// @route   POST /api/sales/quotations/:id/email
// @access  Private (Sales, Admin)
export const sendQuotationEmail = async (req, res) => {
  try {
    const { subject, text, html } = req.body;
    const quotation = await Quotation.findById(req.params.id).populate(
      "customerId"
    );

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    await sendEmail(quotation.customerId.email, subject, text, html);
    res
      .status(200)
      .json({ message: "Email sent successfully about quotation" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
