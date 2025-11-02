import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  Admin,
  Worker,
  Customer,
  Product,
  Task,
  Sales,
  Lead,
  Quotation,
} from "../models/index.js";
import bcrypt from "bcryptjs";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const seedData = async () => {
  try {
    // Hash the default password
    console.log("Hashing passwords...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Clear existing data
    await Admin.deleteMany({});
    await Worker.deleteMany({});
    await Customer.deleteMany({});
    await Product.deleteMany({});
    await Task.deleteMany({});
    await Sales.deleteMany({});
    await Lead.deleteMany({});
    await Quotation.deleteMany({});

    // Create admins
    console.log("Creating admins...");
    const admins = await Admin.create([
      {
        email: "admin1@kvb.com",
        fullName: "John Admin",
        password: hashedPassword,
      },
      {
        email: "admin2@kvb.com",
        fullName: "Sarah Admin",
        password: hashedPassword,
      },
    ]);
    console.log("Admins created:", admins.length);

    // Create workers
    console.log("Creating workers...");
    const workers = await Worker.create([
      {
        email: "worker1@kvb.com",
        fullName: "Ravi Kumar",
        password: hashedPassword,
        specialization: "Solar Installation",
      },
      {
        email: "worker2@kvb.com",
        fullName: "Priya Sharma",
        password: hashedPassword,
        specialization: "Dish Manufacturing",
      },
      {
        email: "worker3@kvb.com",
        fullName: "Amit Patel",
        password: hashedPassword,
        specialization: "Automation & Control Systems",
      },
      {
        email: "worker4@kvb.com",
        fullName: "Sneha Reddy",
        password: hashedPassword,
        specialization: "Fabrication & Welding",
      },
      {
        email: "worker5@kvb.com",
        fullName: "Vikram Singh",
        password: hashedPassword,
        specialization: "Project Management",
      },
      {
        email: "worker6@kvb.com",
        fullName: "Arun Joshi",
        password: hashedPassword,
        specialization: "Solar Tracking Systems",
      },
      {
        email: "worker7@kvb.com",
        fullName: "Kavita Nair",
        password: hashedPassword,
        specialization: "Data Logging",
      },
    ]);
    console.log("Workers created:", workers.length);

    // Create customers
    console.log("Creating customers...");

    // Create customers
    const customers = await Customer.create([
      {
        email: "customer1@mail.com",
        fullName: "University of Agricultural Sciences - Raichur",
        password: hashedPassword,
        phone: "9988776655",
        address: "Raichur, Karnataka",
      },
      {
        email: "customer2@mail.com",
        fullName: "Dayalbagh Educational Institute",
        password: hashedPassword,
        phone: "8877665544",
        address: "Dayalbagh, Agra, Uttar Pradesh",
      },
      {
        email: "customer3@mail.com",
        fullName: "GEDA - Gujarat Energy Development Agency",
        password: hashedPassword,
        phone: "7766554433",
        address: "Gandhinagar, Gujarat",
      },
      {
        email: "customer4@mail.com",
        fullName: "Zilla Panchayat - Pune",
        password: hashedPassword,
        phone: "6655443322",
        address: "Pune, Maharashtra",
      },
      {
        email: "customer5@mail.com",
        fullName: "Sri Raghavendra Swami Math",
        password: hashedPassword,
        phone: "5544332211",
        address: "Manalurpalya, Karnataka",
      },
      {
        email: "customer6@mail.com",
        fullName: "IIT Delhi - Hostel Kitchen",
        password: hashedPassword,
        phone: "9812345678",
        address: "New Delhi, Delhi",
      },
      {
        email: "customer7@mail.com",
        fullName: "IISc Bangalore - Research Lab",
        password: hashedPassword,
        phone: "9876543210",
        address: "Bangalore, Karnataka",
      },
      {
        email: "customer8@mail.com",
        fullName: "NGO - Rural Development",
        password: hashedPassword,
        phone: "8765432109",
        address: "Jaipur, Rajasthan",
      },
      {
        email: "customer9@mail.com",
        fullName: "Hotel Chain - Green Valley",
        password: hashedPassword,
        phone: "7654321098",
        address: "Mumbai, Maharashtra",
      },
      {
        email: "customer10@mail.com",
        fullName: "Government School - Solar Initiative",
        password: hashedPassword,
        phone: "6543210987",
        address: "Chennai, Tamil Nadu",
      },
    ]);

    // Create products
    const products = await Product.create([
      {
        name: "Solar Steam Cooking System",
        description:
          "Scheffler dish-based solar steam cooking system for institutional kitchens. Includes parabolic dish, stand, and steam generation unit.",
        price: 250000.0,
        category: "Solar Cooking",
        stock: 5,
        images: ["/images/dish 1.jpg"],
        specifications: new Map([
          ["Dish Diameter", "457mm"],
          ["Material", "Carbon Steel IS2062 E250"],
          ["Thickness", "8mm"],
          ["Depth", "105mm"],
          ["Automation", "Microcontroller-based tracking"],
          ["Capacity", "100-200 meals per day"],
        ]),
      },
      {
        name: "Solar Tunnel Dryer",
        description:
          "Walk-in solar tunnel dryer for agricultural produce. Features automated temperature and humidity control with IoT monitoring.",
        price: 150000.0,
        category: "Solar Drying",
        stock: 3,
        images: ["/images/dish 2.jpg", "/images/dryer 1.jpg"],
        specifications: new Map([
          ["Length", "10m"],
          ["Width", "2m"],
          ["Height", "2.5m"],
          ["Capacity", "500kg batch"],
          ["Sensors", "Temperature, Humidity"],
          ["Automation", "PLC-controlled fans and exhaust"],
        ]),
      },
      {
        name: "Parabolic Dish Assembly",
        description:
          "Individual parabolic dish for solar concentrator systems. Manufactured with precision welding and coating.",
        price: 15000.0,
        category: "Solar Components",
        stock: 20,
        images: ["/images/dish 3.webp"],
        specifications: new Map([
          ["Outer Diameter", "457mm"],
          ["Thickness", "8mm"],
          ["Material", "MS Sheet"],
          ["Coating", "Reflective aluminum"],
          ["Weight", "25kg"],
          ["Focal Length", "180mm"],
        ]),
      },
      {
        name: "Solar Dryer Control Unit",
        description:
          "Automated control system for solar dryers with sensor integration, data logging, and remote monitoring dashboard.",
        price: 75000.0,
        category: "Automation",
        stock: 8,
        images: ["/images/dish 4.png"],
        specifications: new Map([
          ["Sensors", "Temperature, Humidity, Ambient Weather"],
          ["Connectivity", "Wi-Fi, GSM"],
          ["Display", "LCD Touchscreen"],
          ["Alerts", "SMS/WhatsApp notifications"],
          ["Data Logging", "Daily/weekly reports"],
          ["Power", "Solar powered with battery backup"],
        ]),
      },
      {
        name: "Header Tank Assembly",
        description:
          "Seamless pipe header tank for steam distribution in solar cooking systems. Includes flanges and insulation.",
        price: 35000.0,
        category: "Solar Components",
        stock: 12,
        images: ["/images/dish 5.jpg"],
        specifications: new Map([
          ["Pipe OD", "275mm"],
          ["Pipe ID", "255mm"],
          ["Thickness", "10mm"],
          ["Material", "Seamless Pipe ISI marked"],
          ["Length", "Variable based on dish count"],
          ["Flanges", "MS 280mm ID, 20mm thickness"],
        ]),
      },
    ]);

    // Create sales
    const sales = await Sales.create([
      {
        email: "sales1@kvb.com",
        fullName: "Rajesh Kumar",
        password: hashedPassword,
        region: "Central",
      },
      {
        email: "sales2@kvb.com",
        fullName: "Priya Singh",
        password: hashedPassword,
        region: "Central",
      },
      {
        email: "sales3@kvb.com",
        fullName: "Amit Sharma",
        password: hashedPassword,
        region: "Central",
      },
      {
        email: "sales4@kvb.com",
        fullName: "Sneha Patel",
        password: hashedPassword,
        region: "Central",
      },
      {
        email: "sales5@kvb.com",
        fullName: "Vikram Reddy",
        password: hashedPassword,
        region: "Central",
      },
      {
        email: "sales6@kvb.com",
        fullName: "Karan Gupta",
        password: hashedPassword,
        region: "North",
      },
      {
        email: "sales7@kvb.com",
        fullName: "Meera Iyer",
        password: hashedPassword,
        region: "South",
      },
      {
        email: "sales8@kvb.com",
        fullName: "Ramesh Jain",
        password: hashedPassword,
        region: "East",
      },
    ]);

    // Create leads
    const leads = await Lead.create([
      {
        name: "Dr. Suresh Gupta",
        email: "suresh.gupta@iitd.ac.in",
        phone: "9812345678",
        region: "North",
        status: "new",
        source: "website",
        assignedTo: sales[0]._id,
        notes: [
          {
            message: "Interested in solar cooking system for hostel kitchen",
            addedBy: sales[0]._id,
          },
        ],
      },
      {
        name: "Prof. Meera Iyer",
        email: "meera.iyer@iisc.ac.in",
        phone: "9876543210",
        region: "South",
        status: "contacted",
        source: "conference",
        assignedTo: sales[1]._id,
        notes: [
          {
            message: "Follow-up scheduled for next week",
            addedBy: sales[1]._id,
          },
        ],
      },
      {
        name: "Mr. Ramesh Jain",
        email: "ramesh.jain@gov.in",
        phone: "8765432109",
        region: "East",
        status: "follow-up pending",
        source: "referral",
        assignedTo: sales[2]._id,
        notes: [
          {
            message: "Government tender for solar dryers",
            addedBy: sales[2]._id,
          },
        ],
      },
      {
        name: "Dr. Anita Desai",
        email: "anita.desai@ngo.org",
        phone: "7654321098",
        region: "West",
        status: "closed",
        source: "social media",
        assignedTo: sales[3]._id,
        notes: [
          {
            message: "Project completed successfully",
            addedBy: sales[3]._id,
          },
        ],
      },
      {
        name: "Mr. Karan Singh",
        email: "karan.singh@hotel.com",
        phone: "6543210987",
        region: "Central",
        status: "new",
        source: "direct inquiry",
        assignedTo: sales[4]._id,
        notes: [
          {
            message: "Hotel chain interested in bulk solar cooking systems",
            addedBy: sales[4]._id,
          },
        ],
      },
      {
        name: "Dr. Rajesh Verma",
        email: "rajesh.verma@college.edu",
        phone: "9123456789",
        region: "North",
        status: "closed",
        source: "email campaign",
        assignedTo: sales[5]._id,
        notes: [
          {
            message:
              "College interested in solar tunnel dryer for food processing",
            addedBy: sales[5]._id,
          },
        ],
      },
      {
        name: "Ms. Sunita Rao",
        email: "sunita.rao@restaurant.com",
        phone: "8234567890",
        region: "South",
        status: "new",
        source: "trade show",
        assignedTo: sales[6]._id,
        notes: [
          {
            message:
              "Restaurant chain looking for energy-efficient cooking solutions",
            addedBy: sales[6]._id,
          },
        ],
      },
      {
        name: "Mr. Vijay Kumar",
        email: "vijay.kumar@farm.coop",
        phone: "7345678901",
        region: "East",
        status: "contacted",
        source: "cold call",
        assignedTo: sales[7]._id,
        notes: [
          {
            message:
              "Farmers cooperative interested in solar drying technology",
            addedBy: sales[7]._id,
          },
        ],
      },
      {
        name: "Dr. Priya Menon",
        email: "priya.menon@research.org",
        phone: "6456789012",
        region: "West",
        status: "follow-up pending",
        source: "partnership",
        assignedTo: sales[3]._id,
        notes: [
          {
            message:
              "Research institute needs solar steam system for experiments",
            addedBy: sales[3]._id,
          },
        ],
      },
      {
        name: "Mr. Arjun Patel",
        email: "arjun.patel@hotelgroup.com",
        phone: "5567890123",
        region: "Central",
        status: "closed",
        source: "website",
        assignedTo: sales[0]._id,
        notes: [
          {
            message: "Hotel group wants to implement green cooking initiatives",
            addedBy: sales[0]._id,
          },
        ],
      },
      {
        name: "Dr. Kavita Singh",
        email: "kavita.singh@university.edu",
        phone: "4678901234",
        region: "North",
        status: "new",
        source: "conference",
        assignedTo: sales[5]._id,
        notes: [
          {
            message:
              "University cafeteria interested in solar cooking demonstration",
            addedBy: sales[5]._id,
          },
        ],
      },
      {
        name: "Mr. Ramesh Babu",
        email: "ramesh.babu@govt.in",
        phone: "3789012345",
        region: "South",
        status: "contacted",
        source: "government tender",
        assignedTo: sales[6]._id,
        notes: [
          {
            message:
              "Government project for solar cooking in public institutions",
            addedBy: sales[6]._id,
          },
        ],
      },
      {
        name: "Ms. Anjali Gupta",
        email: "anjali.gupta@ngo.org",
        phone: "2890123456",
        region: "East",
        status: "follow-up pending",
        source: "social media",
        assignedTo: sales[7]._id,
        notes: [
          {
            message: "NGO working on rural solar adoption programs",
            addedBy: sales[7]._id,
          },
        ],
      },
      {
        name: "Dr. Manoj Tiwari",
        email: "manoj.tiwari@iitb.ac.in",
        phone: "1901234567",
        region: "West",
        status: "closed",
        source: "referral",
        assignedTo: sales[3]._id,
        notes: [
          {
            message: "IIT Bombay research team needs solar concentrator system",
            addedBy: sales[3]._id,
          },
        ],
      },
      {
        name: "Mr. Sanjay Sharma",
        email: "sanjay.sharma@resort.com",
        phone: "1012345678",
        region: "Central",
        status: "new",
        source: "direct inquiry",
        assignedTo: sales[1]._id,
        notes: [
          {
            message:
              "Luxury resort interested in solar-powered kitchen equipment",
            addedBy: sales[1]._id,
          },
        ],
      },
      {
        name: "Dr. Neha Agarwal",
        email: "neha.agarwal@medical.org",
        phone: "1123456789",
        region: "North",
        status: "contacted",
        source: "partnership",
        assignedTo: sales[5]._id,
        notes: [
          {
            message: "Medical college wants solar steam sterilization system",
            addedBy: sales[5]._id,
          },
        ],
      },
    ]);

    // Create quotations
    const quotations = await Quotation.create([
      {
        customerId: customers[0]._id,
        productId: products[0]._id,
        details: "Complete solar steam cooking system for 500 students",
        status: "quotation sent",
        createdBy: sales[0]._id,
        createdByModel: "Sales",
        price: 250000,
        region: "South",
      },
      {
        customerId: customers[1]._id,
        productId: products[1]._id,
        details: "Solar tunnel dryer for agricultural produce",
        status: "converted",
        createdBy: admins[0]._id,
        createdByModel: "Admin",
        price: 150000,
        region: "North",
      },
      {
        customerId: customers[2]._id,
        productId: products[3]._id,
        details: "IoT monitoring system for existing solar dryers",
        status: "follow-up pending",
        createdBy: sales[1]._id,
        createdByModel: "Sales",
        price: 75000,
        region: "West",
      },
      {
        customerId: customers[3]._id,
        productId: products[4]._id,
        details: "Header tank assembly for steam distribution",
        status: "new",
        createdBy: sales[2]._id,
        createdByModel: "Sales",
        price: 35000,
        region: "West",
      },
      {
        customerId: customers[4]._id,
        productId: products[0]._id,
        details: "Solar cooking system for temple kitchen",
        status: "contacted",
        createdBy: admins[1]._id,
        createdByModel: "Admin",
        price: 200000,
        region: "South",
      },
      {
        customerId: customers[5]._id,
        productId: products[0]._id,
        details:
          "Solar steam cooking system for hostel kitchen serving 200 students",
        status: "quotation sent",
        createdBy: sales[5]._id,
        createdByModel: "Sales",
        price: 180000,
        region: "North",
      },
      {
        customerId: customers[6]._id,
        productId: products[2]._id,
        details: "Parabolic dish assembly for research experiments",
        status: "converted",
        createdBy: admins[0]._id,
        createdByModel: "Admin",
        price: 15000,
        region: "South",
      },
      {
        customerId: customers[7]._id,
        productId: products[1]._id,
        details: "Solar tunnel dryer for rural development project",
        status: "follow-up pending",
        createdBy: sales[6]._id,
        createdByModel: "Sales",
        price: 120000,
        region: "West",
      },
      {
        customerId: customers[8]._id,
        productId: products[0]._id,
        details: "Bulk solar cooking systems for hotel chain",
        status: "new",
        createdBy: sales[0]._id,
        createdByModel: "Sales",
        price: 500000,
        region: "Central",
      },
      {
        customerId: customers[9]._id,
        productId: products[3]._id,
        details: "Solar dryer control unit for school solar initiative",
        status: "contacted",
        createdBy: sales[7]._id,
        createdByModel: "Sales",
        price: 60000,
        region: "South",
      },
    ]);

    // Create tasks
    const tasks = await Task.create([
      {
        title: "Solar Steam Cooking System Installation",
        description:
          "Complete installation of Scheffler dish system at University of Agricultural Sciences - Raichur",
        priority: "high",
        dueDate: new Date("2025-09-10"),
        assignedTo: [workers[0]._id, workers[3]._id],
        assignedBy: admins[0]._id,
        customer: customers[0]._id,
        product: products[0]._id,
        status: "pending",
        location: "Raichur, Karnataka",
      },
      {
        title: "Dish Manufacturing for Dayalbagh Institute",
        description:
          "Manufacture and prepare parabolic dishes for solar cooking system",
        priority: "medium",
        dueDate: new Date("2025-09-12"),
        assignedTo: [workers[1]._id, workers[3]._id],
        assignedBy: admins[1]._id,
        customer: customers[1]._id,
        product: products[2]._id,
        status: "in-progress",
        location: "Agra, Uttar Pradesh",
      },
      {
        title: "Automation Setup for GEDA Project",
        description:
          "Install and configure IoT monitoring system for solar tunnel dryer",
        priority: "high",
        dueDate: new Date("2025-09-15"),
        assignedTo: [workers[2]._id],
        assignedBy: admins[0]._id,
        customer: customers[2]._id,
        product: products[3]._id,
        status: "pending",
        location: "Gandhinagar, Gujarat",
      },
      {
        title: "Header Tank Fabrication",
        description:
          "Fabricate and test header tank assembly for Pune Zilla Panchayat project",
        priority: "medium",
        dueDate: new Date("2025-09-11"),
        assignedTo: [workers[3]._id],
        assignedBy: admins[1]._id,
        customer: customers[3]._id,
        product: products[4]._id,
        status: "pending",
        location: "Pune, Maharashtra",
      },
      {
        title: "Project Planning for Sri Raghavendra Swami Math",
        description:
          "Complete DPR and project planning for solar steam cooking installation",
        priority: "low",
        dueDate: new Date("2025-09-20"),
        assignedTo: [workers[4]._id],
        assignedBy: admins[0]._id,
        customer: customers[4]._id,
        product: products[0]._id,
        status: "pending",
      },
      {
        title: "IIT Delhi Hostel Kitchen Installation",
        description:
          "Install solar steam cooking system for 200 students in hostel kitchen",
        priority: "high",
        dueDate: new Date("2025-09-25"),
        assignedTo: [workers[0]._id, workers[5]._id],
        assignedBy: admins[1]._id,
        customer: customers[5]._id,
        product: products[0]._id,
        status: "pending",
      },
      {
        title: "IISc Research Lab Dish Assembly",
        description:
          "Assemble and install parabolic dish for research experiments",
        priority: "medium",
        dueDate: new Date("2025-09-18"),
        assignedTo: [workers[1]._id],
        assignedBy: admins[0]._id,
        customer: customers[6]._id,
        product: products[2]._id,
        status: "in-progress",
      },
      {
        title: "Rural Development NGO Dryer Setup",
        description: "Set up solar tunnel dryer for rural development project",
        priority: "high",
        dueDate: new Date("2025-09-22"),
        assignedTo: [workers[2]._id, workers[6]._id],
        assignedBy: admins[1]._id,
        customer: customers[7]._id,
        product: products[1]._id,
        status: "pending",
      },
      {
        title: "Hotel Chain Bulk Installation",
        description:
          "Install multiple solar cooking systems across hotel chain locations",
        priority: "high",
        dueDate: new Date("2025-10-05"),
        assignedTo: [workers[0]._id, workers[3]._id, workers[5]._id],
        assignedBy: admins[0]._id,
        customer: customers[8]._id,
        product: products[0]._id,
        status: "pending",
      },
      {
        title: "Government School Control Unit Setup",
        description:
          "Install and configure solar dryer control unit for school project",
        priority: "medium",
        dueDate: new Date("2025-09-28"),
        assignedTo: [workers[2]._id, workers[6]._id],
        assignedBy: admins[1]._id,
        customer: customers[9]._id,
        product: products[3]._id,
        status: "pending",
      },
      {
        title: "College Food Processing Dryer",
        description:
          "Install solar tunnel dryer for college food processing facility",
        priority: "medium",
        dueDate: new Date("2025-09-30"),
        assignedTo: [workers[1]._id, workers[3]._id],
        assignedBy: admins[0]._id,
        customer: customers[0]._id,
        product: products[1]._id,
        status: "pending",
      },
      {
        title: "Restaurant Chain Energy Audit",
        description:
          "Conduct energy audit and plan solar cooking implementation",
        priority: "low",
        dueDate: new Date("2025-10-10"),
        assignedTo: [workers[4]._id],
        assignedBy: admins[1]._id,
        customer: customers[1]._id,
        product: products[0]._id,
        status: "pending",
      },
      {
        title: "Farmers Cooperative Training",
        description:
          "Train farmers on solar drying technology operation and maintenance",
        priority: "medium",
        dueDate: new Date("2025-10-15"),
        assignedTo: [workers[4]._id, workers[6]._id],
        assignedBy: admins[0]._id,
        customer: customers[2]._id,
        product: products[1]._id,
        status: "pending",
      },
      {
        title: "Research Institute System Testing",
        description:
          "Test and validate solar steam system for research applications",
        priority: "high",
        dueDate: new Date("2025-10-08"),
        assignedTo: [workers[2]._id],
        assignedBy: admins[1]._id,
        customer: customers[3]._id,
        product: products[0]._id,
        status: "pending",
      },
      {
        title: "Hotel Group Green Initiative",
        description:
          "Implement solar cooking solutions for hotel group's green initiative",
        priority: "high",
        dueDate: new Date("2025-10-20"),
        assignedTo: [workers[0]._id, workers[5]._id],
        assignedBy: admins[0]._id,
        customer: customers[4]._id,
        product: products[0]._id,
        status: "pending",
      },
      {
        title: "University Cafeteria Demo Setup",
        description:
          "Set up demonstration solar cooking system in university cafeteria",
        priority: "medium",
        dueDate: new Date("2025-10-12"),
        assignedTo: [workers[1]._id, workers[3]._id],
        assignedBy: admins[1]._id,
        customer: customers[5]._id,
        product: products[0]._id,
        status: "pending",
      },
      {
        title: "Government Solar Cooking Project",
        description:
          "Implement solar cooking systems in government institutions",
        priority: "high",
        dueDate: new Date("2025-10-25"),
        assignedTo: [workers[0]._id, workers[3]._id, workers[5]._id],
        assignedBy: admins[0]._id,
        customer: customers[6]._id,
        product: products[0]._id,
        status: "pending",
      },
      {
        title: "NGO Rural Solar Adoption",
        description:
          "Support NGO in implementing solar solutions for rural communities",
        priority: "medium",
        dueDate: new Date("2025-10-18"),
        assignedTo: [workers[4]._id, workers[6]._id],
        assignedBy: admins[1]._id,
        customer: customers[7]._id,
        product: products[1]._id,
        status: "pending",
      },
      {
        title: "IIT Bombay Research System",
        description:
          "Install solar concentrator system for IIT Bombay research team",
        priority: "high",
        dueDate: new Date("2025-10-30"),
        assignedTo: [workers[2]._id, workers[5]._id],
        assignedBy: admins[0]._id,
        customer: customers[8]._id,
        product: products[2]._id,
        status: "pending",
      },
      {
        title: "Luxury Resort Solar Kitchen",
        description:
          "Design and implement solar-powered kitchen for luxury resort",
        priority: "high",
        dueDate: new Date("2025-11-05"),
        assignedTo: [workers[0]._id, workers[2]._id],
        assignedBy: admins[1]._id,
        customer: customers[9]._id,
        product: products[0]._id,
        status: "pending",
      },
      {
        title: "Medical College Sterilization",
        description:
          "Install solar steam sterilization system for medical college",
        priority: "high",
        dueDate: new Date("2025-11-10"),
        assignedTo: [workers[3]._id, workers[6]._id],
        assignedBy: admins[0]._id,
        customer: customers[0]._id,
        product: products[0]._id,
        status: "pending",
      },
      {
        title: "Solar Tracking System Maintenance",
        description:
          "Perform maintenance on solar tracking systems across installations",
        priority: "low",
        dueDate: new Date("2025-11-15"),
        assignedTo: [workers[5]._id],
        assignedBy: admins[1]._id,
        customer: customers[1]._id,
        product: products[0]._id,
        status: "pending",
      },
      {
        title: "Data Logging System Upgrade",
        description:
          "Upgrade data logging systems for existing solar installations",
        priority: "medium",
        dueDate: new Date("2025-11-20"),
        assignedTo: [workers[6]._id],
        assignedBy: admins[0]._id,
        customer: customers[2]._id,
        product: products[3]._id,
        status: "pending",
      },
      {
        title: "Quality Control Inspection",
        description:
          "Conduct quality control inspection for manufactured components",
        priority: "medium",
        dueDate: new Date("2025-11-25"),
        assignedTo: [workers[1]._id],
        assignedBy: admins[1]._id,
        customer: customers[3]._id,
        product: products[2]._id,
        status: "pending",
      },
      {
        title: "Customer Training Program",
        description:
          "Conduct training programs for customers on system operation",
        priority: "low",
        dueDate: new Date("2025-12-01"),
        assignedTo: [workers[4]._id, workers[6]._id],
        assignedBy: admins[0]._id,
        customer: customers[4]._id,
        product: products[0]._id,
        status: "pending",
      },
      {
        title: "Performance Monitoring Setup",
        description:
          "Set up performance monitoring systems for solar installations",
        priority: "medium",
        dueDate: new Date("2025-12-05"),
        assignedTo: [workers[2]._id, workers[6]._id],
        assignedBy: admins[1]._id,
        customer: customers[5]._id,
        product: products[3]._id,
        status: "pending",
      },
      {
        title: "Technical Documentation",
        description: "Create technical documentation for installed systems",
        priority: "low",
        dueDate: new Date("2025-12-10"),
        assignedTo: [workers[4]._id],
        assignedBy: admins[0]._id,
        customer: customers[6]._id,
        product: products[0]._id,
        status: "pending",
      },
      {
        title: "System Optimization",
        description: "Optimize solar system performance based on data analysis",
        priority: "medium",
        dueDate: new Date("2025-12-15"),
        assignedTo: [workers[2]._id, workers[5]._id],
        assignedBy: admins[1]._id,
        customer: customers[7]._id,
        product: products[1]._id,
        status: "pending",
      },
      {
        title: "Preventive Maintenance Schedule",
        description:
          "Create preventive maintenance schedules for all installations",
        priority: "low",
        dueDate: new Date("2025-12-20"),
        assignedTo: [workers[4]._id, workers[5]._id],
        assignedBy: admins[0]._id,
        customer: customers[8]._id,
        product: products[0]._id,
        status: "pending",
      },
    ]);

    console.log("Seed data created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
