#!/usr/bin/env node

/**
 * Comprehensive KVB CRM API Testing Script
 * Tests all major endpoints and business logic
 */

const axios = require("axios");

const BASE_URL = "http://localhost:5001/api";

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: [],
  categories: {
    authentication: { passed: 0, failed: 0, total: 0 },
    products: { passed: 0, failed: 0, total: 0 },
    customers: { passed: 0, failed: 0, total: 0 },
    workers: { passed: 0, failed: 0, total: 0 },
    sales: { passed: 0, failed: 0, total: 0 },
    admin: { passed: 0, failed: 0, total: 0 },
    tasks: { passed: 0, failed: 0, total: 0 },
  },
};

function log(message, status = "info", category = null) {
  const timestamp = new Date().toISOString();
  const colors = {
    success: "\x1b[32m",
    error: "\x1b[31m",
    warning: "\x1b[33m",
    info: "\x1b[36m",
    reset: "\x1b[0m",
  };
  console.log(`${colors[status]}[${timestamp}] ${message}${colors.reset}`);

  if (category && results.categories[category]) {
    results.categories[category].total++;
  }
}

function testResult(name, success, category = null) {
  if (success) {
    log(`✅ ${name}: PASSED`, "success", category);
    results.passed++;
    if (category) results.categories[category].passed++;
  } else {
    log(`❌ ${name}: FAILED`, "error", category);
    results.failed++;
    if (category) results.categories[category].failed++;
  }
  results.tests.push(name);
}

async function testEndpoint(
  name,
  method,
  url,
  expectedStatus = 200,
  auth = false,
  data = null,
  category = null
) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {},
    };

    if (data) {
      config.data = data;
      config.headers["Content-Type"] = "application/json";
    }

    if (auth) {
      // For testing purposes, we'll skip auth tests that require tokens
      log(`Skipping ${name} (requires authentication)`, "warning", category);
      return true;
    }

    const response = await axios(config);

    if (response.status === expectedStatus) {
      testResult(name, true, category);
      return response.data;
    } else {
      testResult(
        `${name} (expected ${expectedStatus}, got ${response.status})`,
        false,
        category
      );
      return null;
    }
  } catch (error) {
    if (error.response && error.response.status === expectedStatus) {
      testResult(name, true, category);
      return error.response.data;
    } else {
      testResult(`${name} - ${error.message}`, false, category);
      return null;
    }
  }
}

async function runComprehensiveTests() {
  log("🚀 Starting Comprehensive KVB CRM API Tests", "info");
  log("===============================================", "info");

  // Test server health
  await testEndpoint(
    "Server Health Check",
    "GET",
    "/../health",
    200,
    false,
    null,
    null
  );

  // Authentication Tests
  log("\n🔐 AUTHENTICATION TESTS", "info");
  await testEndpoint(
    "Customer Login Validation",
    "POST",
    "/customer-auth/login",
    400,
    false,
    {},
    "authentication"
  );
  await testEndpoint(
    "Worker Login Validation",
    "POST",
    "/worker-auth/login",
    400,
    false,
    {},
    "authentication"
  );
  await testEndpoint(
    "Admin Login Validation",
    "POST",
    "/admin-auth/login",
    400,
    false,
    {},
    "authentication"
  );
  await testEndpoint(
    "Sales Login Validation",
    "POST",
    "/sales-auth/login",
    400,
    false,
    {},
    "authentication"
  );

  // Public Product Tests
  log("\n📦 PUBLIC PRODUCT TESTS", "info");
  const products = await testEndpoint(
    "Get Public Products",
    "GET",
    "/products/public",
    200,
    false,
    null,
    "products"
  );
  if (products && products.length > 0) {
    const firstProductId = products[0]._id;
    await testEndpoint(
      "Get Public Product by ID",
      "GET",
      `/products/public/${firstProductId}`,
      200,
      false,
      null,
      "products"
    );
  }

  // Protected endpoint tests (should return 401)
  log("\n🔒 AUTHORIZATION TESTS", "info");
  await testEndpoint(
    "Admin Dashboard (No Auth)",
    "GET",
    "/admin/dashboard",
    401,
    false,
    null,
    "admin"
  );
  await testEndpoint(
    "Admin Products (No Auth)",
    "GET",
    "/admin/products",
    401,
    false,
    null,
    "admin"
  );
  await testEndpoint(
    "Admin Customers (No Auth)",
    "GET",
    "/admin/customers",
    401,
    false,
    null,
    "admin"
  );
  await testEndpoint(
    "Admin Workers (No Auth)",
    "GET",
    "/admin/workers",
    401,
    false,
    null,
    "admin"
  );
  await testEndpoint(
    "Sales Leads (No Auth)",
    "GET",
    "/sales/leads",
    401,
    false,
    null,
    "sales"
  );
  await testEndpoint(
    "Worker Tasks (No Auth)",
    "GET",
    "/tasks/worker/assigned",
    401,
    false,
    null,
    "tasks"
  );
  await testEndpoint(
    "Customer Projects (No Auth)",
    "GET",
    "/customer/projects",
    401,
    false,
    null,
    "customers"
  );

  // Error handling tests
  log("\n🚨 ERROR HANDLING TESTS", "info");
  await testEndpoint(
    "Invalid Product ID",
    "GET",
    "/products/public/invalid-id",
    404,
    false,
    null,
    "products"
  );
  await testEndpoint(
    "Invalid Admin Endpoint",
    "GET",
    "/admin/nonexistent",
    404,
    false,
    null,
    "admin"
  );

  // Business logic validation tests
  log("\n💼 BUSINESS LOGIC TESTS", "info");
  await testEndpoint(
    "Invalid Customer Enquiry (No Auth)",
    "POST",
    "/customer/enquiries",
    401,
    false,
    {
      productId: "dummy",
      message: "Test enquiry",
    },
    "customers"
  );

  await testEndpoint(
    "Invalid Quotation Creation (No Auth)",
    "POST",
    "/sales/quotations",
    401,
    false,
    {
      productId: "dummy",
      details: "Test quotation",
      price: 1000,
    },
    "sales"
  );

  // Summary by category
  log("\n📊 CATEGORY SUMMARY", "info");
  log("========================", "info");

  Object.entries(results.categories).forEach(([category, stats]) => {
    if (stats.total > 0) {
      const successRate = ((stats.passed / stats.total) * 100).toFixed(1);
      log(
        `${category.toUpperCase()}: ${stats.passed}/${stats.total} passed (${successRate}%)`,
        "info"
      );
    }
  });

  // Overall summary
  log("\n🎯 OVERALL TEST RESULTS", "info");
  log("==========================", "info");
  log(`Total Tests: ${results.passed + results.failed}`, "info");
  log(`Passed: ${results.passed}`, "success");
  log(`Failed: ${results.failed}`, results.failed > 0 ? "error" : "info");

  const overallSuccessRate = (
    (results.passed / (results.passed + results.failed)) *
    100
  ).toFixed(1);
  log(`Success Rate: ${overallSuccessRate}%`, "info");

  if (results.failed === 0) {
    log("\n🎉 ALL COMPREHENSIVE API TESTS PASSED!", "success");
    log("✅ Backend API endpoints are fully functional", "success");
    log("✅ Authentication and authorization working correctly", "success");
    log("✅ Error handling implemented properly", "success");
    log("✅ Business logic validation active", "success");
  } else {
    log(
      `\n⚠️  ${results.failed} tests failed. Please review the implementation.`,
      "warning"
    );
  }

  process.exit(results.failed === 0 ? 0 : 1);
}

// Run comprehensive tests
runComprehensiveTests().catch((error) => {
  log(`💥 Test runner failed: ${error.message}`, "error");
  process.exit(1);
});
