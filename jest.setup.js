// Set up environment variables for testing
process.env.NODE_ENV = "test";
process.env.PORT = 5001;
process.env.MONGODB_URI = "mongodb://localhost:27017/kvb-test";

// Set up global test timeouts
jest.setTimeout(30000);

// Add custom matchers or global test setup here if needed
