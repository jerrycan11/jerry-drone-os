#!/usr/bin/env node

/**
 * Drone OS Health Report Generator
 * 
 * Parses test results and coverage data to generate a comprehensive
 * system health report for CI/CD and deployment verification.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m'
};

// Configuration
const CONFIG = {
  resultsPath: path.join(__dirname, '..', 'test-results', 'results.json'),
  coveragePath: path.join(__dirname, '..', 'coverage', 'coverage-summary.json'),
  coverageThreshold: 70,
  criticalModules: [
    'os/src/core/EventLoop',
    'os/src/core/FailsafeMonitor',
    'os/src/core/WatchdogMonitor',
    'os/src/security/PacketValidator',
    'os/src/security/SecureBoot',
    'os/src/comm/CommManager'
  ]
};

/**
 * Load JSON file safely
 */
function loadJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Parse Vitest JSON results
 */
function parseTestResults(results) {
  if (!results) {
    return {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      suites: []
    };
  }

  const summary = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: results.duration || 0,
    suites: []
  };

  // Handle different Vitest result formats
  const testResults = results.testResults || results.files || [];
  
  for (const file of testResults) {
    const suite = {
      name: file.name || file.file || 'Unknown',
      tests: [],
      passed: 0,
      failed: 0
    };

    const assertions = file.assertionResults || file.tests || [];
    for (const test of assertions) {
      const status = test.status || test.state;
      suite.tests.push({
        name: test.title || test.name || 'Unknown Test',
        status: status
      });
      
      summary.total++;
      if (status === 'passed') {
        summary.passed++;
        suite.passed++;
      } else if (status === 'failed') {
        summary.failed++;
        suite.failed++;
      } else {
        summary.skipped++;
      }
    }
    
    summary.suites.push(suite);
  }

  return summary;
}

/**
 * Parse coverage summary
 */
function parseCoverage(coverage) {
  if (!coverage || !coverage.total) {
    return null;
  }

  return {
    lines: coverage.total.lines?.pct || 0,
    statements: coverage.total.statements?.pct || 0,
    functions: coverage.total.functions?.pct || 0,
    branches: coverage.total.branches?.pct || 0
  };
}

/**
 * Categorize tests into unit, integration, e2e, perf
 */
function categorizeTests(suites) {
  const categories = {
    unit: { passed: 0, failed: 0, total: 0 },
    integration: { passed: 0, failed: 0, total: 0 },
    e2e: { passed: 0, failed: 0, total: 0 },
    perf: { passed: 0, failed: 0, total: 0 }
  };

  for (const suite of suites) {
    let category = 'unit';
    
    if (suite.name.includes('__integration__')) {
      category = 'integration';
    } else if (suite.name.includes('__e2e__')) {
      category = 'e2e';
    } else if (suite.name.includes('__perf__')) {
      category = 'perf';
    }

    categories[category].passed += suite.passed;
    categories[category].failed += suite.failed;
    categories[category].total += suite.passed + suite.failed;
  }

  return categories;
}

/**
 * Generate the health report
 */
function generateReport() {
  console.log('\n');
  
  // Load data
  const testResults = loadJSON(CONFIG.resultsPath);
  const coverageData = loadJSON(CONFIG.coveragePath);
  
  const parsed = parseTestResults(testResults);
  const coverage = parseCoverage(coverageData);
  const categories = categorizeTests(parsed.suites);
  
  // Determine overall health
  const allPassed = parsed.failed === 0;
  const coverageMet = coverage ? coverage.lines >= CONFIG.coverageThreshold : true;
  const isHealthy = allPassed && coverageMet;
  
  // Print header
  const headerColor = isHealthy ? colors.bgGreen : colors.bgRed;
  const headerText = isHealthy ? ' DRONE OS HEALTH REPORT ' : ' DRONE OS HEALTH REPORT ';
  
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log(`║${colors.bright}${headerColor}${colors.white}${headerText.padStart(40).padEnd(64)}${colors.reset}║`);
  console.log('╠══════════════════════════════════════════════════════════════╣');
  
  // Test results by category
  const printCategory = (name, data) => {
    if (data.total === 0) return;
    const status = data.failed === 0 ? `${colors.green}✅` : `${colors.red}❌`;
    const line = `${status} ${name.padEnd(18)}: ${data.passed}/${data.total} PASS${colors.reset}`;
    console.log(`║ ${line.padEnd(74)}║`);
  };
  
  printCategory('Unit Tests', categories.unit);
  printCategory('Integration Tests', categories.integration);
  printCategory('E2E Tests', categories.e2e);
  printCategory('Performance Tests', categories.perf);
  
  // Coverage
  if (coverage) {
    console.log('╠══════════════════════════════════════════════════════════════╣');
    const covStatus = coverage.lines >= CONFIG.coverageThreshold ? `${colors.green}✅` : `${colors.yellow}⚠️`;
    const covLine = `${covStatus} Coverage: ${coverage.lines.toFixed(1)}% (Target: ${CONFIG.coverageThreshold}%)${colors.reset}`;
    console.log(`║ ${covLine.padEnd(74)}║`);
    console.log(`║   Lines: ${coverage.lines.toFixed(1)}% | Branches: ${coverage.branches.toFixed(1)}% | Functions: ${coverage.functions.toFixed(1)}%`.padEnd(65) + '║');
  }
  
  // Failed tests detail
  if (parsed.failed > 0) {
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log(`║ ${colors.red}${colors.bright}Failed Tests:${colors.reset}`.padEnd(75) + '║');
    
    for (const suite of parsed.suites) {
      for (const test of suite.tests) {
        if (test.status === 'failed') {
          const shortSuite = suite.name.split('/').slice(-2).join('/');
          const failLine = `   ❌ ${shortSuite}: ${test.name}`.substring(0, 62);
          console.log(`║ ${failLine.padEnd(63)}║`);
        }
      }
    }
  }
  
  // Overall status
  console.log('╠══════════════════════════════════════════════════════════════╣');
  
  let statusLine;
  let statusColor;
  
  if (isHealthy) {
    statusLine = 'STATUS: ✅ SYSTEM HEALTHY - READY FOR DEPLOYMENT';
    statusColor = colors.green;
  } else if (allPassed) {
    statusLine = 'STATUS: ⚠️  TESTS PASS - COVERAGE BELOW THRESHOLD';
    statusColor = colors.yellow;
  } else {
    statusLine = 'STATUS: ❌ SYSTEM UNHEALTHY - TESTS FAILING';
    statusColor = colors.red;
  }
  
  console.log(`║ ${statusColor}${colors.bright}${statusLine}${colors.reset}`.padEnd(75) + '║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('\n');
  
  // Generate markdown report for CI
  const markdownReport = generateMarkdownReport(parsed, coverage, categories, isHealthy);
  const reportPath = path.join(__dirname, '..', 'test-results', 'health-report.md');
  
  try {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, markdownReport);
    console.log(`📄 Markdown report written to: ${reportPath}`);
  } catch (error) {
    console.error('Failed to write markdown report:', error.message);
  }
  
  // Exit with appropriate code
  process.exit(isHealthy ? 0 : 1);
}

/**
 * Generate markdown report for CI artifacts
 */
function generateMarkdownReport(parsed, coverage, categories, isHealthy) {
  const status = isHealthy ? '✅ HEALTHY' : '❌ UNHEALTHY';
  const timestamp = new Date().toISOString();
  
  let md = `# Drone OS Health Report

**Generated:** ${timestamp}  
**Status:** ${status}

## Test Results Summary

| Category | Passed | Failed | Total |
|----------|--------|--------|-------|
| Unit Tests | ${categories.unit.passed} | ${categories.unit.failed} | ${categories.unit.total} |
| Integration Tests | ${categories.integration.passed} | ${categories.integration.failed} | ${categories.integration.total} |
| E2E Tests | ${categories.e2e.passed} | ${categories.e2e.failed} | ${categories.e2e.total} |
| Performance Tests | ${categories.perf.passed} | ${categories.perf.failed} | ${categories.perf.total} |
| **Total** | **${parsed.passed}** | **${parsed.failed}** | **${parsed.total}** |

`;

  if (coverage) {
    md += `## Coverage

| Metric | Value | Threshold |
|--------|-------|-----------|
| Lines | ${coverage.lines.toFixed(1)}% | ${CONFIG.coverageThreshold}% |
| Branches | ${coverage.branches.toFixed(1)}% | - |
| Functions | ${coverage.functions.toFixed(1)}% | - |
| Statements | ${coverage.statements.toFixed(1)}% | - |

`;
  }

  if (parsed.failed > 0) {
    md += `## Failed Tests

`;
    for (const suite of parsed.suites) {
      for (const test of suite.tests) {
        if (test.status === 'failed') {
          md += `- ❌ **${suite.name}**: ${test.name}\n`;
        }
      }
    }
  }

  md += `
---
*Report generated by Drone OS Health Check System*
`;

  return md;
}

// Run the report generator
generateReport();
