module.exports = {
  // Use v8 coverage provider for accurate coverage
  coverageProvider: 'v8',
  
  // Coverage output directory
  coverageDirectory: 'coverage',
  
  // Coverage reporters
  coverageReporters: ['text', 'text-summary', 'json', 'lcov', 'html'],
  
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
  
  // Coverage excludes - will be extended by config
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/tests/'
  ]
};
