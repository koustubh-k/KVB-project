module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js", "**/comprehensive-*.js"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["./jest.setup.js"],
  testTimeout: 30000,
};
