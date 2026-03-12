#!/usr/bin/env node

/**
 * Coverage Delta Check
 * 
 * Compares current coverage with coverage from the previous commit.
 * Fails if any coverage metric (statements/branches/functions/lines) decreased.
 * 
 * Usage:
 *   node coverage-delta.js              # Check against HEAD~1
 *   node coverage-delta.js --base=HEAD~5 # Check against specific commit
 *   node coverage-delta.js --grace       # First run - no baseline, pass
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COVERAGE_FILE = 'coverage/coverage-summary.json';
const EXIT_SUCCESS = 0;
const EXIT_FAILURE = 1;

class CoverageDelta {
  constructor(options = {}) {
    this.baseCommit = options.base || 'HEAD~1';
    this.graceMode = options.grace || false;
    this.currentCoverage = null;
    this.baseCoverage = null;
    this.deltas = [];
  }

  async run() {
    console.log('\n📊 Coverage Delta Check\n');
    console.log('='.repeat(60));

    // Load current coverage
    if (!this.loadCurrentCoverage()) {
      console.error('\n❌ No current coverage data found.');
      console.log('Run: npm run test:coverage first');
      return EXIT_FAILURE;
    }

    // Try to load base coverage
    const hasBaseCoverage = this.loadBaseCoverage();
    
    if (!hasBaseCoverage) {
      if (this.graceMode) {
        console.log('\n⚠️  No baseline coverage found (grace mode).');
        console.log('This is the first run - accepting current coverage as baseline.\n');
        return EXIT_SUCCESS;
      }
      console.warn('\n⚠️  Could not load base coverage from', this.baseCommit);
      console.log('Use --grace flag for first run, or check git history.\n');
      return EXIT_FAILURE;
    }

    // Compare coverage
    const hasRegressions = this.compareCoverage();
    
    // Print report
    this.printReport();

    if (hasRegressions) {
      console.log('\n' + '='.repeat(60));
      console.error('\n❌ Coverage regressions detected!\n');
      console.log('Fix the regressions or adjust tests accordingly.\n');
      return EXIT_FAILURE;
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ No coverage regressions. All metrics maintained or improved.\n');
    return EXIT_SUCCESS;
  }

  loadCurrentCoverage() {
    try {
      if (!fs.existsSync(COVERAGE_FILE)) {
        return false;
      }
      const content = fs.readFileSync(COVERAGE_FILE, 'utf-8');
      this.currentCoverage = JSON.parse(content);
      return true;
    } catch (error) {
      console.error('Error loading current coverage:', error.message);
      return false;
    }
  }

  loadBaseCoverage() {
    try {
      // Try to get coverage from base commit
      const baseContent = execSync(
        `git show ${this.baseCommit}:${COVERAGE_FILE}`,
        { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
      );
      this.baseCoverage = JSON.parse(baseContent);
      return true;
    } catch (error) {
      // File might not exist in base commit
      return false;
    }
  }

  compareCoverage() {
    this.deltas = [];
    let hasRegressions = false;

    // Metrics to compare
    const metrics = ['statements', 'branches', 'functions', 'lines'];
    
    // Get all files from both coverages
    const allFiles = new Set([
      ...Object.keys(this.currentCoverage),
      ...Object.keys(this.baseCoverage)
    ]);

    // Remove 'total' for now, handle separately
    allFiles.delete('total');

    for (const file of allFiles) {
      const current = this.currentCoverage[file];
      const base = this.baseCoverage[file];

      // Skip if file doesn't exist in either coverage
      if (!current || !base) {
        continue;
      }

      for (const metric of metrics) {
        const currentPct = current[metric]?.pct || 0;
        const basePct = base[metric]?.pct || 0;
        const delta = currentPct - basePct;

        if (delta < 0) {
          hasRegressions = true;
          this.deltas.push({
            file,
            metric,
            base: basePct,
            current: currentPct,
            delta,
            isRegression: true
          });
        } else if (delta > 0) {
          this.deltas.push({
            file,
            metric,
            base: basePct,
            current: currentPct,
            delta,
            isRegression: false
          });
        }
      }
    }

    // Also check total
    if (this.currentCoverage.total && this.baseCoverage.total) {
      for (const metric of metrics) {
        const currentPct = this.currentCoverage.total[metric]?.pct || 0;
        const basePct = this.baseCoverage.total[metric]?.pct || 0;
        const delta = currentPct - basePct;

        if (delta < 0) {
          hasRegressions = true;
          this.deltas.unshift({
            file: 'TOTAL',
            metric,
            base: basePct,
            current: currentPct,
            delta,
            isRegression: true,
            isTotal: true
          });
        }
      }
    }

    return hasRegressions;
  }

  printReport() {
    console.log('\n📈 Coverage Changes:\n');

    if (this.deltas.length === 0) {
      console.log('  No changes in coverage metrics.\n');
      return;
    }

    // Group by file
    const regressions = this.deltas.filter(d => d.isRegression);
    const improvements = this.deltas.filter(d => !d.isRegression);

    if (regressions.length > 0) {
      console.log('  🔴 Regressions:\n');
      for (const delta of regressions) {
        const file = delta.isTotal ? '\x1b[1mTOTAL\x1b[0m' : delta.file;
        console.log(`    ${file}`);
        console.log(`      ${delta.metric}: ${delta.base}% → ${delta.current}% (${delta.delta.toFixed(2)}%)`);
      }
      console.log();
    }

    if (improvements.length > 0) {
      console.log('  🟢 Improvements:\n');
      // Show only first 5 improvements to avoid clutter
      for (const delta of improvements.slice(0, 5)) {
        console.log(`    ${delta.file}`);
        console.log(`      ${delta.metric}: ${delta.base}% → ${delta.current}% (+${delta.delta.toFixed(2)}%)`);
      }
      if (improvements.length > 5) {
        console.log(`    ... and ${improvements.length - 5} more improvements`);
      }
      console.log();
    }
  }
}

// CLI handling
function main() {
  const args = process.argv.slice(2);
  const options = {
    base: null,
    grace: false
  };

  for (const arg of args) {
    if (arg.startsWith('--base=')) {
      options.base = arg.substring(7);
    } else if (arg === '--grace') {
      options.grace = true;
    } else if (arg === '--help') {
      console.log(`
📊 Coverage Delta Check

Compares current coverage with a baseline commit.
Fails if any coverage metric decreased.

Usage:
  node coverage-delta.js [--base=<commit>] [--grace]

Options:
  --base=<commit>  Base commit to compare against (default: HEAD~1)
  --grace          Grace mode - pass if no baseline exists (first run)
  --help           Show this help

Examples:
  node coverage-delta.js                    # Compare with HEAD~1
  node coverage-delta.js --base=main        # Compare with main branch
  node coverage-delta.js --grace            # First run, accept current
      `);
      process.exit(EXIT_SUCCESS);
    }
  }

  const checker = new CoverageDelta(options);
  checker.run().then(code => process.exit(code));
}

if (require.main === module) {
  main();
}

module.exports = { CoverageDelta };
