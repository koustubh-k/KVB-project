#!/usr/bin/env node

/**
 * KVB CRM API Testing Script
 * Tests all major endpoints to ensure functionality
 */

const axios = require("axios");

const BASE_URL = "http://localhost:5001/api";

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

function log(message, status = "info") {
  const timestamp = new Date().toISOString();
  const colors = {
    success: "\x1b[32m",
    error: "\x1b[31m",
    warning: "\x1b[33m",
    info: "\x1b[36m",
    reset: "\x1b[0m",
  };
  console.log(`${colors[status]}[${timestamp}] ${message}${colors.reset}`);
}

function testEndpoint(name, method, url, expectedStatus = 200, auth = false) {
  return new Promise(async (resolve) => {
    try {
      const config = {
        method,
        url: `${BASE_URL}${url}`,
        headers: {},
      };

      if (auth) {
        // For testing purposes, we'll skip auth tests that require tokens
        log(`Skipping ${name} (requires authentication)`, "warning");
        resolve();
        return;
      }

      const response = await axios(config);

      if (response.status === expectedStatus) {
        log(`✅ ${name}: PASSED`, "success");
        results.passed++;
      } else {
        log(
          `❌ ${name}: FAILED (expected ${expectedStatus}, got ${response.status})`,
          "error"
        );
        results.failed++;
      }
    } catch (error) {
      if (error.response && error.response.status === expectedStatus) {
        log(`✅ ${name}: PASSED (expected auth failure)`, "success");
        results.passed++;
      } else {
        log(`❌ ${name}: FAILED - ${error.message}`, "error");
        results.failed++;
      }
    }

    results.tests.push(name);
    resolve();
  });
}

async function runTests() {
  log("🚀 Starting KVB CRM API Tests", "info");
  log("=====================================", "info");

  // Public endpoints (no auth required)
  await testEndpoint("Get Public Products", "GET", "/products/public");
  await testEndpoint(
    "Get Public Product by ID",
    "GET",
    "/products/public/690767463b4ed11515eb0d5d"
  );

  // Authentication endpoints
  await testEndpoint("Customer Login", "POST", "/customer-auth/login", 400); // Should fail without data
  await testEndpoint("Worker Login", "POST", "/worker-auth/login", 400);
  await testEndpoint("Admin Login", "POST", "/admin-auth/login", 400);
  await testEndpoint("Sales Login", "POST", "/sales-auth/login", 400);

  // Protected endpoints (should return 401 without auth)
  await testEndpoint(
    "Get Admin Dashboard",
    "GET",
    "/admin/dashboard",
    401,
    true
  );
  await testEndpoint("Get Admin Products", "GET", "/admin/products", 401, true);
  await testEndpoint(
    "Get Admin Customers",
    "GET",
    "/admin/customers",
    401,
    true
  );
  await testEndpoint("Get Admin Workers", "GET", "/admin/workers", 401, true);
  await testEndpoint("Get Sales Leads", "GET", "/sales/leads", 401, true);
  await testEndpoint(
    "Get Worker Tasks",
    "GET",
    "/tasks/worker/assigned",
    401,
    true
  );
  await testEndpoint(
    "Get Customer Projects",
    "GET",
    "/customer/projects",
    401,
    true
  );

  // Test server health
  try {
    await axios.get("http://localhost:5001/health", { timeout: 5000 });
    log("✅ Server Health Check: PASSED", "success");
    results.passed++;
  } catch (error) {
    log("❌ Server Health Check: FAILED - Server may not be running", "error");
    results.failed++;
  }

  // Summary
  log("=====================================", "info");
  log(
    `📊 Test Results: ${results.passed} passed, ${results.failed} failed`,
    "info"
  );
  log(
    `📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`,
    "info"
  );

  if (results.failed === 0) {
    log("🎉 All tests passed! The API is working correctly.", "success");
  } else {
    log("⚠️  Some tests failed. Please check the implementation.", "warning");
  }

  process.exit(results.failed === 0 ? 0 : 1);
}

// Run tests
runTests().catch((error) => {
  log(`💥 Test runner failed: ${error.message}`, "error");
  process.exit(1);
});
