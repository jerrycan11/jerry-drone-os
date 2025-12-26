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
      '**/dist/**'
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
        global: {
          statements: 70,
          branches: 60,
          functions: 70,
          lines: 70
        }
      }
    },
    
    // Reporter configuration
    reporters: ['verbose', 'json'],
    outputFile: {
      json: './test-results/results.json'
    },
    
    // Workspace configuration for monorepo
    workspace: [
      {
        extends: true,
        test: {
          name: 'os',
          root: './os',
          include: ['src/**/*.test.ts']
        }
      },
      {
        extends: true,
        test: {
          name: 'mock',
          root: './mock',
          include: ['src/**/*.test.ts']
        }
      },
      {
        extends: true,
        test: {
          name: 'shared',
          root: './shared',
          include: ['src/**/*.test.ts']
        }
      }
    ],
    
    // Pool configuration for better isolation
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true
      }
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
