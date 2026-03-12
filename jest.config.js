const fs = require('fs');
const path = require('path');

// Load agent config for coverage excludes
let coverageExcludes = [
  '/node_modules/',
  '/coverage/',
  '/tests/'
];

try {
  const configPath = path.join(__dirname, '.agent', 'config.json');
  if (fs.existsSync(configPath)) {
    const agentConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (agentConfig.coverageExcludes && Array.isArray(agentConfig.coverageExcludes)) {
      coverageExcludes = agentConfig.coverageExcludes;
    }
  }
} catch (e) {
  // Fallback to defaults if config can't be loaded
  console.warn('Could not load .agent/config.json, using default coverage excludes');
}

module.exports = {
  // Use v8 coverage provider for accurate coverage
  coverageProvider: 'v8',
  
  // Coverage output directory
  coverageDirectory: 'coverage',
  
  // Coverage reporters
  coverageReporters: ['text', 'text-summary', 'json', 'json-summary', 'lcov', 'html'],
  
  // Collect coverage from these files
  collectCoverageFrom: [
    '.agent/core/scripts/**/*.js',
    '.agent/lib/**/*.js',
    '!**/node_modules/**',
    '!**/*.test.js',
    '!**/*.spec.js',
    '!.agent/skills/**'
  ],
  
  // Ignore paths during test search
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.agent/skills/'
  ],
  
  // Coverage thresholds - initially empty, will be filled by coverage-delta
  coverageThreshold: {},
  
  // Test environment
  testEnvironment: 'node',
  
  // Test match patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Coverage excludes - loaded from .agent/config.json
  coveragePathIgnorePatterns: coverageExcludes
};