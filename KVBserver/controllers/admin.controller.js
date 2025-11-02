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
    const leads = await Lead.find().populate("assignedTo", "fullName");
    res.status(200).json(leads);
  } catch (error) {
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

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      specifications,
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

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        stock,
        specifications,
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

      const task = {
        title: row.getCell(1).value,
        description: row.getCell(2).value,
        priority: row.getCell(3).value || "medium",
        status: row.getCell(4).value || "pending",
        location: row.getCell(5).value,
        dueDate: new Date(row.getCell(6).value),
        assignedTo: row.getCell(7).value, // Worker ID
        customer: row.getCell(8).value, // Customer ID
        product: row.getCell(9).value, // Product ID
        assignedBy: req.admin._id,
      };

      if (task.title && task.location) {
        tasks.push(task);
      }
    });

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
