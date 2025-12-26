import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Global test configuration
    globals: true,
    environment: 'node',
    
    // Include patterns for all test files
    include: [
      '**/src/**/*.test.ts',
      '**/src/**/*.spec.ts',
      '**/src/__integration__/**/*.test.ts',
      '**/src/__e2e__/**/*.test.ts',
      '**/src/__perf__/**/*.test.ts'
    ],
    
    // Exclude patterns
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/ui/**',
      '**/test-utils/**',
      '**/simulator/**'
    ],
    
    // Timeout for async operations (critical for real-time systems)
    testTimeout: 30000,
    hookTimeout: 10000,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'os/src/**/*.ts',
        'mock/src/**/*.ts',
        'shared/src/**/*.ts'
      ],
      exclude: [
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/index.ts',
        '**/__integration__/**',
        '**/__e2e__/**',
        '**/__perf__/**'
      ],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70
      }
    },
    
    // Reporter configuration
    reporters: ['verbose', 'json'],
    outputFile: {
      json: './test-results/results.json'
    },
    
    // Retry configuration for flaky tests
    retry: 1,
    
    // Watch mode configuration
    watch: false,
    
    // Snapshot configuration
    snapshotFormat: {
      escapeString: false,
      printBasicPrototype: false
    }
  }
});
