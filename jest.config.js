const testsDirectory = '<rootDir>/tests';

module.exports = {
  globalSetup: `${testsDirectory}/setup.ts`,

  globalTeardown: `${testsDirectory}/teardown.ts`,

  setupFiles: [
    `${testsDirectory}/helpers.ts`
  ],

  testMatch: [
    `${testsDirectory}/**/*spec.ts`
  ],

  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  },

  coverageReporters: [
    'html',
    'lcov',
    'text'
  ],

  watchPathIgnorePatterns: [
    '/node_modules/',
    '/lib/'
  ]
};
