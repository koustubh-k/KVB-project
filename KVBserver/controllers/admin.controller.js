import Customer from "../models/customer.model.js";
import Worker from "../models/worker.model.js";
import Sales from "../models/sales.model.js";
import Product from "../models/product.model.js";
import Task from "../models/task.model.js";
import Lead from "../models/lead.model.js";
import Quotation from "../models/quotation.model.js";
import Enquiry from "../models/enquiry.model.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";
import { sendTaskAssignedNotification } from "../utils/emailService.js";
import ExcelJS from "exceljs";

const getDataUri = (file) => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  let dataURI = "data:" + file.mimetype + ";base64," + b64;
  return dataURI;
};

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private (Admin)
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({}).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get customer by ID
// @route   GET /api/admin/customers/:id
// @access  Private (Admin)
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select("-password");
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a new customer
// @route   POST /api/admin/customers
// @access  Private (Admin)
export const createCustomer = async (req, res) => {
  try {
    const { fullName, email, password, phone, address } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res
        .status(400)
        .json({ error: "Customer with this email already exists" });
    }

    // Hash password
    const bcrypt = await import("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = await Customer.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    const customerResponse = customer.toObject();
    delete customerResponse.password;

    res.status(201).json(customerResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update a customer
// @route   PUT /api/admin/customers/:id
// @access  Private (Admin)
export const updateCustomer = async (req, res) => {
  try {
    const { fullName, email, phone, address } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { fullName, email, phone, address },
      { new: true, runValidators: true }
    ).select("-password");

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/admin/customers/:id
// @access  Private (Admin)
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json({ message: "Customer removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all workers
// @route   GET /api/admin/workers
// @access  Private (Admin)
export const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find({}).select("-password");
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get worker by ID
// @route   GET /api/admin/workers/:id
// @access  Private (Admin)
export const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).select("-password");
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }
    res.status(200).json(worker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a new worker
// @route   POST /api/admin/workers
// @access  Private (Admin)
export const createWorker = async (req, res) => {
  try {
    const { fullName, email, password, specialization } = req.body;

    // Check if worker already exists
    const existingWorker = await Worker.findOne({ email });
    if (existingWorker) {
      return res
        .status(400)
        .json({ error: "Worker with this email already exists" });
    }

    // Hash password
    const bcrypt = await import("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const worker = await Worker.create({
      fullName,
      email,
      password: hashedPassword,
      specialization,
    });

    const workerResponse = worker.toObject();
    delete workerResponse.password;

    res.status(201).json(workerResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update a worker
// @route   PUT /api/admin/workers/:id
// @access  Private (Admin)
export const updateWorker = async (req, res) => {
  try {
    const { fullName, email, specialization } = req.body;

    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { fullName, email, specialization },
      { new: true, runValidators: true }
    ).select("-password");

    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    res.status(200).json(worker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete a worker
// @route   DELETE /api/admin/workers/:id
// @access  Private (Admin)
export const deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }
    res.status(200).json({ message: "Worker removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all sales
// @route   GET /api/admin/sales
// @access  Private (Admin)
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sales.find({}).select("-password");
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all leads
// @route   GET /api/admin/leads
// @access  Private (Admin)
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("assignedTo", "fullName")
      .populate("notes.addedBy", "fullName email");
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get lead by ID
// @route   GET /api/admin/leads/:id
// @access  Private (Admin)
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignedTo", "fullName email")
      .populate("customerId", "fullName email phone")
      .populate("notes.addedBy", "fullName email");

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update lead
// @route   PUT /api/admin/leads/:id
// @access  Private (Admin)
export const updateLead = async (req, res) => {
  try {
    const { name, email, phone, region, source, status, assignedTo } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        region,
        source,
        status,
        assignedTo,
      },
      { new: true, runValidators: true }
    )
      .populate("assignedTo", "fullName email")
      .populate("customerId", "fullName email phone")
      .populate("notes.addedBy", "fullName email");

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Send email to lead
// @route   POST /api/admin/leads/:id/email
// @access  Private (Admin)
export const sendLeadEmail = async (req, res) => {
  try {
    const { subject, message, html } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    // Import sendEmail function
    const { sendEmail } = await import("../utils/emailService.js");

    await sendEmail(lead.email, subject, message, html);

    res.status(200).json({ message: "Email sent successfully to lead" });
  } catch (error) {
    console.error("Error sending email to lead:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all quotations
// @route   GET /api/admin/quotations
// @access  Private (Admin)
export const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find()
      .populate("customerId", "fullName email")
      .populate("productId", "name")
      .populate("createdBy", "fullName");
    res.status(200).json(quotations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get quotation by ID
// @route   GET /api/admin/quotations/:id
// @access  Private (Admin)
export const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate("customerId", "fullName email phone address")
      .populate("productId", "name description price images")
      .populate("createdBy", "fullName email");

    if (!quotation) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    res.status(200).json(quotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update quotation
// @route   PUT /api/admin/quotations/:id
// @access  Private (Admin)
export const updateQuotation = async (req, res) => {
  try {
    const { details, status, price } = req.body;

    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      {
        details,
        status,
        price,
      },
      { new: true, runValidators: true }
    )
      .populate("customerId", "fullName email phone address")
      .populate("productId", "name description price images")
      .populate("createdBy", "fullName email");

    if (!quotation) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    res.status(200).json(quotation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Send email about quotation
// @route   POST /api/admin/quotations/:id/email
// @access  Private (Admin)
export const sendQuotationEmail = async (req, res) => {
  try {
    const { subject, message, html } = req.body;

    const quotation = await Quotation.findById(req.params.id)
      .populate("customerId", "fullName email")
      .populate("productId", "name");

    if (!quotation) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    // Import sendEmail function
    const { sendEmail } = await import("../utils/emailService.js");

    await sendEmail(quotation.customerId.email, subject, message, html);

    res
      .status(200)
      .json({ message: "Email sent successfully about quotation" });
  } catch (error) {
    console.error("Error sending quotation email:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private (Admin)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/admin/products
// @access  Private (Admin)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, specifications } =
      req.body;
    const images = [];

    if (req.file) {
      const dataUri = getDataUri(req.file);
      const result = await uploadToCloudinary(dataUri, {
        folder: "products",
      });
      images.push(result.secure_url);
    }

    // Parse specifications if it's a string
    let parsedSpecifications = specifications;
    if (typeof specifications === "string") {
      try {
        parsedSpecifications = JSON.parse(specifications);
      } catch (e) {
        parsedSpecifications = {};
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      specifications: parsedSpecifications,
      images,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, specifications } =
      req.body;
    const images = [];

    if (req.file) {
      const dataUri = getDataUri(req.file);
      const result = await uploadToCloudinary(dataUri, {
        folder: "products",
      });
      images.push(result.secure_url);
    }

    // Parse specifications if it's a string
    let parsedSpecifications = specifications;
    if (typeof specifications === "string") {
      try {
        parsedSpecifications = JSON.parse(specifications);
      } catch (e) {
        parsedSpecifications = {};
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        stock,
        specifications: parsedSpecifications,
        ...(images.length > 0 && { images }),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all tasks
// @route   GET /api/admin/tasks
// @access  Private (Admin)
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "fullName email")
      .populate("customer", "fullName email")
      .populate("product", "name");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/admin/tasks
// @access  Private (Admin)
export const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, assignedBy: req.admin._id });
    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "fullName email")
      .populate("customer", "fullName email")
      .populate("product", "name");

    // Send email notification to assigned worker(s)
    if (populatedTask.assignedTo && populatedTask.assignedTo.length > 0) {
      try {
        for (const worker of populatedTask.assignedTo) {
          if (worker.email) {
            await sendTaskAssignedNotification(
              worker.email,
              worker.fullName,
              populatedTask.title,
              populatedTask.customer?.fullName || "Customer",
              populatedTask.location
            );
          }
        }
      } catch (emailError) {
        console.error("Failed to send task assignment email:", emailError);
        // Don't fail the task creation if email fails
      }
    }

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/admin/tasks/:id
// @access  Private (Admin)
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "fullName email")
      .populate("customer", "fullName email")
      .populate("product", "name");
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/admin/tasks/:id
// @access  Private (Admin)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json({ message: "Task removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Bulk import products from Excel
// @route   POST /api/admin/bulk-import/products
// @access  Private (Admin)
export const bulkImportProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.worksheets[0];

    const products = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const product = {
        name: row.getCell(1).value,
        description: row.getCell(2).value,
        price: parseFloat(row.getCell(3).value) || 0,
        category: row.getCell(4).value,
        stock: parseInt(row.getCell(5).value) || 0,
        specifications: row.getCell(6).value,
      };

      if (product.name) {
        products.push(product);
      }
    });

    const createdProducts = await Product.insertMany(products);
    res.status(201).json({
      message: `${createdProducts.length} products imported successfully`,
      products: createdProducts,
    });
  } catch (error) {
    console.error("Error importing products:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Bulk import tasks from Excel
// @route   POST /api/admin/bulk-import/tasks
// @access  Private (Admin)
const parseCellText = (cell) => {
  if (!cell || cell.value === null || cell.value === undefined) return "";
  // ExcelJS cell.value can be string, number, Date, or object (rich text/formula)
  if (cell.text) return String(cell.text).trim();         // preferred: cell.text gives user-visible value
  if (cell.value instanceof Date) return cell.value;      // return Date as-is
  if (typeof cell.value === "object") {
    // try common object shapes
    if (cell.value.result) return String(cell.value.result).trim();
    if (cell.value.richText) return cell.value.richText.map(rt => rt.text).join("").trim();
    if (cell.value.text) return String(cell.value.text).trim();
    return String(cell.value).trim();
  }
  return String(cell.value).trim();
};

const parseObjectIdSingle = (raw) => {
  if (!raw) return undefined;
  const s = String(raw).replace(/[\s'"\[\]]+/g, "").trim(); // remove brackets/quotes/spaces
  return mongoose.isValidObjectId(s) ? s : undefined;
};

const parseObjectIdList = (raw) => {
  if (!raw) return undefined;
  // accept comma separated like "id1, id2" or single id
  const cleaned = String(raw).trim().replace(/^\[|\]$/g, ""); // remove surrounding []
  const parts = cleaned.split(",").map(p => p.replace(/['"\s]+/g, "").trim()).filter(Boolean);
  const valid = parts.filter(p => mongoose.isValidObjectId(p));
  return valid.length ? valid : undefined;
};

// controller
export const bulkImportTasks = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.worksheets[0];

    const tasks = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const title = parseCellText(row.getCell(1));
      const description = parseCellText(row.getCell(2));
      const priority = parseCellText(row.getCell(3)) || "medium";
      const status = parseCellText(row.getCell(4)) || "pending";
      const location = parseCellText(row.getCell(5));

      // due date: Excel may store real Date or string
      let dueDateCell = row.getCell(6);
      let dueDateValue = null;
      if (dueDateCell && dueDateCell.value) {
        if (dueDateCell.value instanceof Date) {
          dueDateValue = dueDateCell.value;
        } else {
          const maybe = parseCellText(dueDateCell);
          const parsed = new Date(maybe);
          if (!isNaN(parsed)) dueDateValue = parsed;
        }
      }

      // IDs: normalize and validate (don't include invalid/empty ones)
      const assignedToRaw = parseCellText(row.getCell(7));
      const assignedTo = parseObjectIdList(assignedToRaw); // returns array or undefined

      const customerRaw = parseCellText(row.getCell(8));
      const customer = parseObjectIdSingle(customerRaw);

      const productRaw = parseCellText(row.getCell(9));
      const product = parseObjectIdSingle(productRaw);

      // Build task object, only include fields that are present/valid
      const task = {
        title,
        description,
        priority,
        status,
        location,
        assignedBy: req.admin._id,
      };

      if (dueDateValue) task.dueDate = dueDateValue;
      if (assignedTo) task.assignedTo = assignedTo;
      if (customer) task.customer = customer;
      if (product) task.product = product;

      // only push when minimal required fields exist (you used title & location earlier)
      if (task.title && task.location) {
        tasks.push(task);
      }
    });

    if (!tasks.length) {
      return res.status(400).json({ error: "No valid tasks found in file" });
    }

    const createdTasks = await Task.insertMany(tasks);
    res.status(201).json({
      message: `${createdTasks.length} tasks imported successfully`,
      tasks: createdTasks,
    });
  } catch (error) {
    console.error("Error importing tasks:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Bulk import customers from Excel
// @route   POST /api/admin/bulk-import/customers
// @access  Private (Admin)
export const bulkImportCustomers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.worksheets[0];

    const customers = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const customer = {
        fullName: row.getCell(1).value,
        email: row.getCell(2).value,
        phone: row.getCell(3).value,
        company: row.getCell(4).value,
        region: row.getCell(5).value || "Central",
        address: row.getCell(6).value,
      };

      if (customer.fullName && customer.email) {
        customers.push(customer);
      }
    });

    const createdCustomers = await Customer.insertMany(customers);
    res.status(201).json({
      message: `${createdCustomers.length} customers imported successfully`,
      customers: createdCustomers,
    });
  } catch (error) {
    console.error("Error importing customers:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Export data to Excel
// @route   GET /api/admin/export/:type
// @access  Private (Admin)
export const exportData = async (req, res) => {
  try {
    const { type } = req.params;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(type);

    let data = [];
    let headers = [];

    switch (type) {
      case "customers":
        headers = ["Name", "Email", "Phone", "Company", "Region", "Address"];
        data = await Customer.find({}).select(
          "fullName email phone company region address"
        );
        worksheet.columns = headers.map((header) => ({
          header,
          key: header.toLowerCase(),
        }));
        data.forEach((customer) => {
          worksheet.addRow({
            name: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            company: customer.company,
            region: customer.region,
            address: customer.address,
          });
        });
        break;

      case "tasks":
        headers = [
          "Title",
          "Description",
          "Priority",
          "Status",
          "Location",
          "Due Date",
          "Assigned To",
          "Customer",
        ];
        data = await Task.find()
          .populate("assignedTo", "fullName")
          .populate("customer", "fullName");
        worksheet.columns = headers.map((header) => ({
          header,
          key: header.toLowerCase().replace(" ", ""),
        }));
        data.forEach((task) => {
          worksheet.addRow({
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            location: task.location,
            duedate: task.dueDate,
            assignedto: task.assignedTo?.fullName,
            customer: task.customer?.fullName,
          });
        });
        break;

      case "products":
        headers = ["Name", "Description", "Price", "Category", "Stock"];
        data = await Product.find({});
        worksheet.columns = headers.map((header) => ({
          header,
          key: header.toLowerCase(),
        }));
        data.forEach((product) => {
          worksheet.addRow({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
          });
        });
        break;

      case "sales":
        headers = ["Name", "Email", "Region", "Status"];
        data = await Sales.find({}).select("fullName email region status");
        worksheet.columns = headers.map((header) => ({
          header,
          key: header.toLowerCase(),
        }));
        data.forEach((sale) => {
          worksheet.addRow({
            name: sale.fullName,
            email: sale.email,
            region: sale.region,
            status: sale.status,
          });
        });
        break;

      default:
        return res.status(400).json({ error: "Invalid export type" });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${type}-export.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalCustomers,
      totalWorkers,
      totalSales,
      totalProducts,
      totalTasks,
      totalLeads,
      totalQuotations,
      taskStats,
      leadStats,
      quotationStats,
    ] = await Promise.all([
      Customer.countDocuments(),
      Worker.countDocuments(),
      Sales.countDocuments(),
      Product.countDocuments(),
      Task.countDocuments(),
      Lead.countDocuments(),
      Quotation.countDocuments(),
      Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Quotation.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

    res.json({
      overview: {
        totalCustomers,
        totalWorkers,
        totalSales,
        totalProducts,
        totalTasks,
        totalLeads,
        totalQuotations,
      },
      taskStats,
      leadStats,
      quotationStats,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: error.message });
  }
};
