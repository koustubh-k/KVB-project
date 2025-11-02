import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Nodemailer transporter for Gmail SMTP
const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

// Default sender configuration
const sender = {
  email: process.env.GMAIL_USER || "koustubh2809@gmail.com",
  name: "KVB Green Energies",
};

// Send email using Gmail SMTP
export const sendEmail = async (to, subject, text, html) => {
  try {
    // For testing purposes, always send to koustubh2809@gmail.com
    const testRecipient = "koustubh2809@gmail.com";

    const mailOptions = {
      from: `"${sender.name}" <${sender.email}>`,
      to: testRecipient, // Always send to test email for now
      subject: `[TEST] ${subject} (Originally to: ${to})`, // Add TEST prefix and original recipient
      text,
      html: `
        <div style="border: 2px solid #ff6b6b; padding: 10px; margin-bottom: 20px; background: #ffeaa7;">
          <strong>🧪 TEST EMAIL</strong><br>
          Original recipient: ${to}<br>
          This email was redirected for testing purposes.
        </div>
        ${html}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent via Gmail SMTP:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email via Gmail SMTP:", error);
    throw error;
  }
};

// Email templates
export const emailTemplates = {
  enquiryConfirmation: (customerName, productName) => ({
    subject: "Enquiry Received - KVB Green Energies",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d5a27;">Thank you for your enquiry, ${customerName}!</h2>
        <p>We have received your enquiry for <strong>${productName}</strong>.</p>
        <p>Our sales team will review your enquiry and get back to you within 24 hours.</p>
        <p>If you have any urgent questions, please contact us at:</p>
        <ul>
          <li>Email: sales@kvbenergies.com</li>
          <li>Phone: +91-XXXXXXXXXX</li>
        </ul>
        <br>
        <p>Best regards,<br>KVB Green Energies Team</p>
      </div>
    `,
  }),

  quotationSent: (customerName, quotationId, productName) => ({
    subject: "Quotation Sent - KVB Green Energies",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d5a27;">Quotation Ready for ${productName}</h2>
        <p>Dear ${customerName},</p>
        <p>We have prepared a quotation for your enquiry. Please review the details and let us know if you have any questions.</p>
        <p><strong>Quotation ID:</strong> ${quotationId}</p>
        <p>You can view and accept/reject this quotation in your customer dashboard.</p>
        <br>
        <p>Best regards,<br>KVB Green Energies Sales Team</p>
      </div>
    `,
  }),

  quotationAccepted: (customerName, quotationId, productName) => ({
    subject: "Quotation Accepted - Installation Scheduled",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d5a27;">Great News! Your Quotation is Accepted</h2>
        <p>Dear ${customerName},</p>
        <p>Thank you for accepting our quotation for <strong>${productName}</strong> (ID: ${quotationId}).</p>
        <p>Our installation team will contact you within 48 hours to schedule the installation.</p>
        <p>You can track the progress of your installation in your customer dashboard.</p>
        <br>
        <p>Best regards,<br>KVB Green Energies Team</p>
      </div>
    `,
  }),

  taskAssigned: (workerName, taskTitle, customerName, location) => ({
    subject: "New Task Assigned - KVB Green Energies",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d5a27;">New Task Assigned</h2>
        <p>Dear ${workerName},</p>
        <p>You have been assigned a new task:</p>
        <ul>
          <li><strong>Task:</strong> ${taskTitle}</li>
          <li><strong>Customer:</strong> ${customerName}</li>
          <li><strong>Location:</strong> ${location}</li>
        </ul>
        <p>Please check your dashboard for complete task details and update the status as you progress.</p>
        <br>
        <p>Best regards,<br>KVB Green Energies Management</p>
      </div>
    `,
  }),

  taskCompleted: (customerName, taskTitle) => ({
    subject: "Installation Completed - KVB Green Energies",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d5a27;">Installation Completed Successfully!</h2>
        <p>Dear ${customerName},</p>
        <p>Great news! Your installation for <strong>${taskTitle}</strong> has been completed successfully.</p>
        <p>Our team has finished the installation and everything is working as expected.</p>
        <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
        <br>
        <p>Best regards,<br>KVB Green Energies Team</p>
      </div>
    `,
  }),

  followUp: (customerName, productName) => ({
    subject: "Follow-up on Your Enquiry - KVB Green Energies",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d5a27;">Following up on your enquiry</h2>
        <p>Dear ${customerName},</p>
        <p>We hope this email finds you well. We're following up on your enquiry about <strong>${productName}</strong>.</p>
        <p>We're interested in learning more about your requirements and discussing how our solar solutions can benefit you.</p>
        <p>Please let us know if you'd like to schedule a call or have any questions.</p>
        <br>
        <p>Best regards,<br>KVB Green Energies Sales Team</p>
      </div>
    `,
  }),
};

// Automated email triggers
export const sendEnquiryConfirmation = async (
  customerEmail,
  customerName,
  productName
) => {
  const template = emailTemplates.enquiryConfirmation(
    customerName,
    productName
  );
  return await sendEmail(customerEmail, template.subject, "", template.html);
};

export const sendQuotationNotification = async (
  customerEmail,
  customerName,
  quotationId,
  productName
) => {
  const template = emailTemplates.quotationSent(
    customerName,
    quotationId,
    productName
  );
  return await sendEmail(customerEmail, template.subject, "", template.html);
};

export const sendQuotationAcceptedNotification = async (
  customerEmail,
  customerName,
  quotationId,
  productName
) => {
  const template = emailTemplates.quotationAccepted(
    customerName,
    quotationId,
    productName
  );
  return await sendEmail(customerEmail, template.subject, "", template.html);
};

export const sendTaskAssignedNotification = async (
  workerEmail,
  workerName,
  taskTitle,
  customerName,
  location
) => {
  const template = emailTemplates.taskAssigned(
    workerName,
    taskTitle,
    customerName,
    location
  );
  return await sendEmail(workerEmail, template.subject, "", template.html);
};

export const sendTaskCompletedNotification = async (
  customerEmail,
  customerName,
  taskTitle
) => {
  const template = emailTemplates.taskCompleted(customerName, taskTitle);
  return await sendEmail(customerEmail, template.subject, "", template.html);
};

export const sendFollowUpEmail = async (
  customerEmail,
  customerName,
  productName
) => {
  const template = emailTemplates.followUp(customerName, productName);
  return await sendEmail(customerEmail, template.subject, "", template.html);
};
