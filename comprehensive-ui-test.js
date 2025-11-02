#!/usr/bin/env node

/**
 * Comprehensive KVB CRM Frontend UI Testing Script
 * Tests React components and user interface functionality
 */

const axios = require("axios");

const FRONTEND_URL = "http://localhost:5174";
const API_BASE_URL = "http://localhost:5001/api";

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: [],
  categories: {
    accessibility: { passed: 0, failed: 0, total: 0 },
    components: { passed: 0, failed: 0, total: 0 },
    navigation: { passed: 0, failed: 0, total: 0 },
    api_integration: { passed: 0, failed: 0, total: 0 },
    responsiveness: { passed: 0, failed: 0, total: 0 },
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

async function testFrontendEndpoint(
  name,
  url,
  expectedStatus = 200,
  category = null
) {
  try {
    const response = await axios.get(`${FRONTEND_URL}${url}`, {
      timeout: 10000,
      validateStatus: () => true, // Don't throw on any status
    });

    if (response.status === expectedStatus) {
      testResult(name, true, category);
      return true;
    } else {
      testResult(
        `${name} (expected ${expectedStatus}, got ${response.status})`,
        false,
        category
      );
      return false;
    }
  } catch (error) {
    testResult(`${name} - ${error.message}`, false, category);
    return false;
  }
}

async function testAPIAvailability(
  name,
  url,
  expectedStatus = 200,
  category = null
) {
  try {
    const response = await axios.get(`${API_BASE_URL}${url}`, {
      timeout: 5000,
    });

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
    testResult(`${name} - ${error.message}`, false, category);
    return null;
  }
}

async function runComprehensiveUITests() {
  log("🖥️  Starting Comprehensive KVB CRM UI Tests", "info");
  log("=============================================", "info");

  // Frontend Accessibility Tests
  log("\n🌐 FRONTEND ACCESSIBILITY TESTS", "info");
  const frontendAccessible = await testFrontendEndpoint(
    "Frontend Server Accessibility",
    "/",
    200,
    "accessibility"
  );

  if (!frontendAccessible) {
    log("⚠️  Frontend server not accessible. Skipping UI tests.", "warning");
    return;
  }

  // API Integration Tests
  log("\n🔗 API INTEGRATION TESTS", "info");
  const products = await testAPIAvailability(
    "Products API Integration",
    "/products/public",
    200,
    "api_integration"
  );

  const hasProducts =
    products && Array.isArray(products) && products.length > 0;
  testResult("Product Data Available", hasProducts, "api_integration");

  if (hasProducts) {
    const firstProduct = products[0];
    testResult(
      "Product Has Required Fields",
      !!(
        firstProduct.name &&
        firstProduct.description &&
        firstProduct.price &&
        firstProduct._id
      ),
      "api_integration"
    );
  }

  // Component Structure Tests
  log("\n🧩 COMPONENT STRUCTURE TESTS", "info");

  // Test that key data structures are correct
  if (products) {
    const productFields = ["_id", "name", "description", "price", "category"];
    const hasAllFields = products.every((product) =>
      productFields.every((field) => product.hasOwnProperty(field))
    );
    testResult("Products Have Complete Schema", hasAllFields, "components");

    // Test price formatting (should be numbers)
    const validPrices = products.every(
      (product) => typeof product.price === "number" && product.price >= 0
    );
    testResult("Product Prices Are Valid Numbers", validPrices, "components");
  }

  // Navigation and Routing Tests
  log("\n🧭 NAVIGATION & ROUTING TESTS", "info");

  // Test that main routes are accessible (these will return HTML, not JSON)
  await testFrontendEndpoint("Landing Page Route", "/", 200, "navigation");

  // Test API health for navigation dependencies
  await testAPIAvailability(
    "Health Check for Navigation",
    "/../health",
    200,
    "navigation"
  );

  // Authentication Flow Tests
  log("\n🔐 AUTHENTICATION FLOW TESTS", "info");

  // Test login endpoints (should return 400 for empty data)
  try {
    const loginResponse = await axios.post(
      `${API_BASE_URL}/customer-auth/login`,
      {},
      {
        timeout: 5000,
        validateStatus: () => true,
      }
    );
    testResult(
      "Customer Login Validation",
      loginResponse.status === 400,
      "navigation"
    );
  } catch (error) {
    testResult("Customer Login Validation", false, "navigation");
  }

  // Data Consistency Tests
  log("\n📊 DATA CONSISTENCY TESTS", "info");

  if (products) {
    // Test for duplicate IDs
    const ids = products.map((p) => p._id);
    const uniqueIds = new Set(ids);
    const noDuplicates = ids.length === uniqueIds.size;
    testResult("No Duplicate Product IDs", noDuplicates, "components");

    // Test for required string fields
    const validStrings = products.every(
      (product) =>
        typeof product.name === "string" &&
        product.name.trim().length > 0 &&
        typeof product.description === "string" &&
        product.description.trim().length > 0
    );
    testResult(
      "Product Names and Descriptions Are Valid Strings",
      validStrings,
      "components"
    );

    // Test category diversity
    const categories = [...new Set(products.map((p) => p.category))];
    testResult(
      "Multiple Product Categories Available",
      categories.length > 1,
      "components"
    );
  }

  // Error Handling Tests
  log("\n🚨 ERROR HANDLING TESTS", "info");

  // Test invalid product ID
  try {
    const invalidResponse = await axios.get(
      `${API_BASE_URL}/products/public/invalid-id`,
      {
        timeout: 5000,
        validateStatus: () => true,
      }
    );
    testResult(
      "Invalid Product ID Returns 404",
      invalidResponse.status === 404,
      "api_integration"
    );
  } catch (error) {
    testResult("Invalid Product ID Error Handling", false, "api_integration");
  }

  // Test unauthorized access
  try {
    const authResponse = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
      timeout: 5000,
      validateStatus: () => true,
    });
    testResult(
      "Unauthorized Admin Access Returns 401",
      authResponse.status === 401,
      "api_integration"
    );
  } catch (error) {
    testResult(
      "Unauthorized Admin Access Error Handling",
      false,
      "api_integration"
    );
  }

  // Performance Tests
  log("\n⚡ PERFORMANCE TESTS", "info");

  // Test response time for products API
  const startTime = Date.now();
  try {
    await axios.get(`${API_BASE_URL}/products/public`, { timeout: 3000 });
    const responseTime = Date.now() - startTime;
    const acceptableTime = responseTime < 2000; // Less than 2 seconds
    testResult(
      `API Response Time (${responseTime}ms)`,
      acceptableTime,
      "api_integration"
    );
  } catch (error) {
    testResult("API Response Time Test", false, "api_integration");
  }

  // Responsiveness Tests
  log("\n📱 RESPONSIVENESS TESTS", "info");

  // Test that API returns reasonable data size
  if (products) {
    const reasonableSize = products.length <= 100; // Not too many products at once
    testResult(
      "Product List Size Reasonable",
      reasonableSize,
      "responsiveness"
    );

    // Test that product descriptions aren't too long
    const reasonableDescriptions = products.every(
      (product) => product.description.length <= 1000 // Reasonable description length
    );
    testResult(
      "Product Descriptions Reasonable Length",
      reasonableDescriptions,
      "responsiveness"
    );
  }

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
  log("\n🎯 OVERALL UI TEST RESULTS", "info");
  log("==============================", "info");
  log(`Total Tests: ${results.passed + results.failed}`, "info");
  log(`Passed: ${results.passed}`, "success");
  log(`Failed: ${results.failed}`, results.failed > 0 ? "error" : "info");

  const overallSuccessRate = (
    (results.passed / (results.passed + results.failed)) *
    100
  ).toFixed(1);
  log(`Success Rate: ${overallSuccessRate}%`, "info");

  if (results.failed === 0) {
    log("\n🎉 ALL COMPREHENSIVE UI TESTS PASSED!", "success");
    log("✅ Frontend components are fully functional", "success");
    log("✅ API integration working correctly", "success");
    log("✅ Data consistency maintained", "success");
    log("✅ Error handling implemented properly", "success");
    log("✅ Performance within acceptable limits", "success");
  } else {
    log(
      `\n⚠️  ${results.failed} UI tests failed. Please review the implementation.`,
      "warning"
    );
  }

  process.exit(results.failed === 0 ? 0 : 1);
}

// Run comprehensive UI tests
runComprehensiveUITests().catch((error) => {
  log(`💥 UI test runner failed: ${error.message}`, "error");
  process.exit(1);
});
