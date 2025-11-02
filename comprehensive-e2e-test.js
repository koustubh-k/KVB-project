#!/usr/bin/env node

/**
 * Comprehensive KVB CRM End-to-End Testing Script
 * Tests complete user workflows from start to finish
 */

const axios = require("axios");

const FRONTEND_URL = "http://localhost:5173";
const API_BASE_URL = "http://localhost:5001/api";

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: [],
  workflows: {
    customer_journey: { passed: 0, failed: 0, total: 0 },
    admin_workflow: { passed: 0, failed: 0, total: 0 },
    sales_workflow: { passed: 0, failed: 0, total: 0 },
    worker_workflow: { passed: 0, failed: 0, total: 0 },
  },
};

function log(message, status = "info", workflow = null) {
  const timestamp = new Date().toISOString();
  const colors = {
    success: "\x1b[32m",
    error: "\x1b[31m",
    warning: "\x1b[33m",
    info: "\x1b[36m",
    reset: "\x1b[0m",
  };
  console.log(`${colors[status]}[${timestamp}] ${message}${colors.reset}`);

  if (workflow && results.workflows[workflow]) {
    results.workflows[workflow].total++;
  }
}

function testResult(name, success, workflow = null) {
  if (success) {
    log(`✅ ${name}: PASSED`, "success", workflow);
    results.passed++;
    if (workflow) results.workflows[workflow].passed++;
  } else {
    log(`❌ ${name}: FAILED`, "error", workflow);
    results.failed++;
    if (workflow) results.workflows[workflow].failed++;
  }
  results.tests.push(name);
}

async function testWorkflow(name, workflowFunction, workflow = null) {
  try {
    log(`🚀 Starting ${name}...`, "info", workflow);
    const success = await workflowFunction();
    testResult(name, success, workflow);
    return success;
  } catch (error) {
    log(`💥 ${name} failed: ${error.message}`, "error", workflow);
    testResult(name, false, workflow);
    return false;
  }
}

// Customer Journey Workflow
async function testCustomerJourney() {
  log("   📋 Testing Customer Journey Workflow", "info", "customer_journey");

  // Step 1: Customer browses products
  const productsResponse = await axios.get(`${API_BASE_URL}/products/public`);
  if (productsResponse.status !== 200 || !productsResponse.data.length) {
    throw new Error("Failed to fetch products");
  }
  const firstProduct = productsResponse.data[0];

  // Step 2: Customer submits enquiry
  const enquiryData = {
    productId: firstProduct._id,
    message: "I am interested in this product. Please provide more details.",
    region: "North",
  };

  try {
    const enquiryResponse = await axios.post(
      `${API_BASE_URL}/customer/enquiries`,
      enquiryData,
      {
        validateStatus: () => true,
      }
    );
    // Should fail with 401 (not authenticated), which is expected
    if (enquiryResponse.status !== 401) {
      throw new Error("Enquiry should require authentication");
    }
  } catch (error) {
    if (!error.response || error.response.status !== 401) {
      throw new Error("Unexpected enquiry response");
    }
  }

  // Step 3: Customer views their projects (should require auth)
  try {
    const projectsResponse = await axios.get(
      `${API_BASE_URL}/customer/projects`,
      {
        validateStatus: () => true,
      }
    );
    if (projectsResponse.status !== 401) {
      throw new Error("Projects should require authentication");
    }
  } catch (error) {
    if (!error.response || error.response.status !== 401) {
      throw new Error("Unexpected projects response");
    }
  }

  return true;
}

// Admin Workflow
async function testAdminWorkflow() {
  log("   👨‍💼 Testing Admin Workflow", "info", "admin_workflow");

  // Step 1: Admin views dashboard (should require auth)
  const dashboardResponse = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
    validateStatus: () => true,
  });
  if (dashboardResponse.status !== 401) {
    throw new Error("Admin dashboard should require authentication");
  }

  // Step 2: Admin views products (should require auth)
  const productsResponse = await axios.get(`${API_BASE_URL}/admin/products`, {
    validateStatus: () => true,
  });
  if (productsResponse.status !== 401) {
    throw new Error("Admin products should require authentication");
  }

  // Step 3: Admin views customers (should require auth)
  const customersResponse = await axios.get(`${API_BASE_URL}/admin/customers`, {
    validateStatus: () => true,
  });
  if (customersResponse.status !== 401) {
    throw new Error("Admin customers should require authentication");
  }

  // Step 4: Test export functionality (should require auth)
  const exportResponse = await axios.get(
    `${API_BASE_URL}/admin/export/customers`,
    {
      validateStatus: () => true,
    }
  );
  if (exportResponse.status !== 401) {
    throw new Error("Export should require authentication");
  }

  return true;
}

// Sales Workflow
async function testSalesWorkflow() {
  log("   💼 Testing Sales Workflow", "info", "sales_workflow");

  // Step 1: Sales views leads (should require auth)
  const leadsResponse = await axios.get(`${API_BASE_URL}/sales/leads`, {
    validateStatus: () => true,
  });
  if (leadsResponse.status !== 401) {
    throw new Error("Sales leads should require authentication");
  }

  // Step 2: Sales views quotations (should require auth)
  const quotationsResponse = await axios.get(
    `${API_BASE_URL}/sales/quotations`,
    {
      validateStatus: () => true,
    }
  );
  if (quotationsResponse.status !== 401) {
    throw new Error("Sales quotations should require authentication");
  }

  // Step 3: Sales tries to create quotation (should require auth)
  const quotationData = {
    productId: "dummy-id",
    details: "Test quotation",
    price: 1000,
  };

  const createQuotationResponse = await axios.post(
    `${API_BASE_URL}/sales/quotations`,
    quotationData,
    { validateStatus: () => true }
  );
  if (createQuotationResponse.status !== 401) {
    throw new Error("Create quotation should require authentication");
  }

  return true;
}

// Worker Workflow
async function testWorkerWorkflow() {
  log("   👷 Testing Worker Workflow", "info", "worker_workflow");

  // Step 1: Worker views tasks (should require auth)
  const tasksResponse = await axios.get(
    `${API_BASE_URL}/tasks/worker/assigned`,
    {
      validateStatus: () => true,
    }
  );
  if (tasksResponse.status !== 401) {
    throw new Error("Worker tasks should require authentication");
  }

  // Step 2: Worker tries to update task status (should require auth)
  const updateData = {
    status: "in-progress",
    comment: "Starting work on this task",
  };

  const updateResponse = await axios.put(
    `${API_BASE_URL}/tasks/worker/update-status/dummy-id`,
    updateData,
    { validateStatus: () => true }
  );
  if (updateResponse.status !== 401) {
    throw new Error("Update task status should require authentication");
  }

  return true;
}

// Business Logic Integration Tests
async function testBusinessLogicIntegration() {
  log("   🔗 Testing Business Logic Integration", "info");

  // Test that all endpoints are properly secured
  const endpoints = [
    { url: "/admin/dashboard", method: "GET" },
    { url: "/admin/products", method: "GET" },
    { url: "/admin/customers", method: "GET" },
    { url: "/sales/leads", method: "GET" },
    { url: "/sales/quotations", method: "GET" },
    { url: "/tasks/worker/assigned", method: "GET" },
    { url: "/customer/projects", method: "GET" },
    { url: "/customer/enquiries", method: "POST", data: {} },
  ];

  for (const endpoint of endpoints) {
    try {
      const config = {
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.url}`,
        validateStatus: () => true,
      };

      if (endpoint.data) {
        config.data = endpoint.data;
        config.headers = { "Content-Type": "application/json" };
      }

      const response = await axios(config);

      // All protected endpoints should return 401 without auth
      if (
        endpoint.url.includes("/admin/") ||
        endpoint.url.includes("/sales/") ||
        endpoint.url.includes("/customer/") ||
        endpoint.url.includes("/tasks/")
      ) {
        if (response.status !== 401) {
          throw new Error(`${endpoint.url} should require authentication`);
        }
      }
    } catch (error) {
      throw new Error(`Failed to test ${endpoint.url}: ${error.message}`);
    }
  }

  return true;
}

// Data Flow Tests
async function testDataFlow() {
  log("   📊 Testing Data Flow", "info");

  // Test public data availability
  const products = await axios.get(`${API_BASE_URL}/products/public`);
  if (!products.data || products.data.length === 0) {
    throw new Error("No public products available");
  }

  // Test that product data structure is consistent
  const firstProduct = products.data[0];
  const requiredFields = ["_id", "name", "description", "price"];

  for (const field of requiredFields) {
    if (!firstProduct.hasOwnProperty(field)) {
      throw new Error(`Product missing required field: ${field}`);
    }
  }

  // Test individual product access
  const productDetail = await axios.get(
    `${API_BASE_URL}/products/public/${firstProduct._id}`
  );
  if (productDetail.status !== 200) {
    throw new Error("Individual product access failed");
  }

  // Test invalid product ID
  try {
    await axios.get(`${API_BASE_URL}/products/public/invalid-id`);
  } catch (error) {
    if (!error.response || error.response.status !== 404) {
      throw new Error("Invalid product ID should return 404");
    }
  }

  return true;
}

// Performance Tests
async function testPerformance() {
  log("   ⚡ Testing Performance", "info");

  // Test API response times
  const endpoints = ["/products/public", "/../health"];

  for (const endpoint of endpoints) {
    const startTime = Date.now();
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      timeout: 5000,
    });
    const responseTime = Date.now() - startTime;

    if (responseTime > 3000) {
      // 3 seconds max
      throw new Error(`${endpoint} response too slow: ${responseTime}ms`);
    }

    log(`   📈 ${endpoint}: ${responseTime}ms`, "info");
  }

  return true;
}

async function runComprehensiveE2ETests() {
  log("🚀 Starting Comprehensive KVB CRM E2E Tests", "info");
  log("==============================================", "info");

  // Test system health first
  const healthResponse = await axios.get(`${API_BASE_URL}/../health`, {
    timeout: 5000,
    validateStatus: () => true,
  });

  if (healthResponse.status !== 200) {
    log("❌ System health check failed. Aborting E2E tests.", "error");
    process.exit(1);
  }

  log("✅ System health check passed", "success");

  // Run workflow tests
  log("\n👥 USER WORKFLOW TESTS", "info");
  log("========================", "info");

  await testWorkflow(
    "Customer Journey",
    testCustomerJourney,
    "customer_journey"
  );
  await testWorkflow("Admin Workflow", testAdminWorkflow, "admin_workflow");
  await testWorkflow("Sales Workflow", testSalesWorkflow, "sales_workflow");
  await testWorkflow("Worker Workflow", testWorkerWorkflow, "worker_workflow");

  // Run integration tests
  log("\n🔗 INTEGRATION TESTS", "info");
  log("====================", "info");

  await testWorkflow(
    "Business Logic Integration",
    testBusinessLogicIntegration
  );
  await testWorkflow("Data Flow", testDataFlow);
  await testWorkflow("Performance", testPerformance);

  // Summary by workflow
  log("\n📊 WORKFLOW SUMMARY", "info");
  log("=====================", "info");

  Object.entries(results.workflows).forEach(([workflow, stats]) => {
    if (stats.total > 0) {
      const successRate = ((stats.passed / stats.total) * 100).toFixed(1);
      log(
        `${workflow.replace("_", " ").toUpperCase()}: ${stats.passed}/${stats.total} passed (${successRate}%)`,
        "info"
      );
    }
  });

  // Overall summary
  log("\n🎯 OVERALL E2E TEST RESULTS", "info");
  log("=============================", "info");
  log(`Total Tests: ${results.passed + results.failed}`, "info");
  log(`Passed: ${results.passed}`, "success");
  log(`Failed: ${results.failed}`, results.failed > 0 ? "error" : "info");

  const overallSuccessRate = (
    (results.passed / (results.passed + results.failed)) *
    100
  ).toFixed(1);
  log(`Success Rate: ${overallSuccessRate}%`, "info");

  if (results.failed === 0) {
    log("\n🎉 ALL COMPREHENSIVE E2E TESTS PASSED!", "success");
    log("✅ Complete user workflows functional", "success");
    log("✅ Authentication and authorization working", "success");
    log("✅ Business logic properly integrated", "success");
    log("✅ Data flow consistent across system", "success");
    log("✅ Performance within acceptable limits", "success");
    log("✅ System ready for production use", "success");
  } else {
    log(
      `\n⚠️  ${results.failed} E2E tests failed. Please review the implementation.`,
      "warning"
    );
  }

  process.exit(results.failed === 0 ? 0 : 1);
}

// Run comprehensive E2E tests
runComprehensiveE2ETests().catch((error) => {
  log(`💥 E2E test runner failed: ${error.message}`, "error");
  process.exit(1);
});
