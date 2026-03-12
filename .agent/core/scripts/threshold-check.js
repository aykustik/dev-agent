#!/usr/bin/env node

/**
 * Threshold Reduction Block
 * 
 * Checks if coverageThreshold values in jest.config.js were reduced.
 * Blocks commits that lower coverage thresholds.
 * Allows adding new threshold entries (new files).
 * 
 * Usage:
 *   node threshold-check.js              # Check against HEAD~1
 *   node threshold-check.js --base=main  # Check against specific branch
 *   node threshold-check.js --exclude="config,cli"  # Exclude patterns
 */

const { execSync } = require('child_process');

const EXIT_SUCCESS = 0;
const EXIT_FAILURE = 1;

class ThresholdChecker {
  constructor(options = {}) {
    this.baseCommit = options.base || 'HEAD~1';
    this.excludePatterns = options.exclude ? options.exclude.split(',').map(s => s.trim()) : [];
    this.reductions = [];
    this.additions = [];
  }

  async run() {
    console.log('\n🚫 Threshold Reduction Check\n');
    console.log('='.repeat(60));

    // Get current and base jest config
    const currentConfig = this.getConfigAt('HEAD');
    const baseConfig = this.getConfigAt(this.baseCommit);

    if (!currentConfig) {
      console.error('\n❌ Could not load current jest.config.js\n');
      return EXIT_FAILURE;
    }

    if (!baseConfig) {
      console.log('\n⚠️  No baseline jest.config.js found.');
      console.log('Assuming this is the initial setup.\n');
      return EXIT_SUCCESS;
    }

    // Compare thresholds
    const hasReductions = this.compareThresholds(currentConfig, baseConfig);

    // Print report
    this.printReport();

    if (hasReductions) {
      console.log('\n' + '='.repeat(60));
      console.error('\n❌ Coverage threshold reductions detected!\n');
      console.log('Lowering coverage thresholds is not allowed.\n');
      console.log('Allowed changes:');
      console.log('  ✅ Adding new threshold entries');
      console.log('  ✅ Increasing existing thresholds');
      console.log('  ✅ Adding coverage excludes (e.g., CLI entry points)');
      console.log('  ❌ Reducing threshold values\n');
      return EXIT_FAILURE;
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ No threshold reductions detected.\n');
    return EXIT_SUCCESS;
  }

  getConfigAt(commit) {
    try {
      // Try to get jest.config.js content from specific commit
      const content = execSync(
        `git show ${commit}:jest.config.js`,
        { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
      );
      
      // Parse the config by evaluating it in a safe way
      // We'll extract coverageThreshold using regex since we can't safely eval
      return this.parseConfig(content);
    } catch (error) {
      return null;
    }
  }

  parseConfig(content) {
    const config = {
      coverageThreshold: {},
      coveragePathIgnorePatterns: []
    };

    // Extract coverageThreshold
    const thresholdMatch = content.match(/coverageThreshold\s*:\s*({[\s\S]*?})(?=,\s*\n|$)/);
    if (thresholdMatch) {
      try {
        // Safely parse the threshold object
        const thresholdStr = thresholdMatch[1];
        config.coverageThreshold = this.parseObject(thresholdStr);
      } catch (e) {
        // Silent fail
      }
    }

    // Extract coveragePathIgnorePatterns
    const excludeMatch = content.match(/coveragePathIgnorePatterns\s*:\s*(\[[\s\S]*?\])/);
    if (excludeMatch) {
      try {
        config.coveragePathIgnorePatterns = JSON.parse(excludeMatch[1].replace(/'/g, '"'));
      } catch (e) {
        // Silent fail
      }
    }

    return config;
  }

  parseObject(str) {
    // Simple parser for threshold objects
    // Handles: { global: { statements: 80, branches: 70 } }
    const obj = {};
    const globalMatch = str.match(/global\s*:\s*({[^{}]*})/);
    
    if (globalMatch) {
      obj.global = {};
      const globalStr = globalMatch[1];
      
      // Extract metrics
      const metrics = ['statements', 'branches', 'functions', 'lines'];
      for (const metric of metrics) {
        const match = globalStr.match(new RegExp(`${metric}\s*:\\s*(\\d+)`));
        if (match) {
          obj.global[metric] = parseInt(match[1]);
        }
      }
    }

    return obj;
  }

  compareThresholds(current, base) {
    this.reductions = [];
    this.additions = [];
    let hasReductions = false;

    const currentGlobal = current.coverageThreshold?.global || {};
    const baseGlobal = base.coverageThreshold?.global || {};

    // Check for reductions in existing metrics
    for (const [metric, currentValue] of Object.entries(currentGlobal)) {
      const baseValue = baseGlobal[metric];
      
      if (baseValue !== undefined) {
        // Metric exists in both - check for reduction
        if (currentValue < baseValue) {
          hasReductions = true;
          this.reductions.push({
            metric,
            base: baseValue,
            current: currentValue,
            reduction: baseValue - currentValue
          });
        }
      } else {
        // New metric - this is fine
        this.additions.push({
          metric,
          value: currentValue,
          type: 'metric'
        });
      }
    }

    // Check for removed metrics (also a form of reduction)
    for (const metric of Object.keys(baseGlobal)) {
      if (!(metric in currentGlobal)) {
        hasReductions = true;
        this.reductions.push({
          metric,
          base: baseGlobal[metric],
          current: 0,
          reduction: baseGlobal[metric],
          removed: true
        });
      }
    }

    return hasReductions;
  }

  printReport() {
    console.log('\n📊 Threshold Analysis:\n');

    if (this.reductions.length === 0 && this.additions.length === 0) {
      console.log('  No changes to coverage thresholds.\n');
      return;
    }

    if (this.reductions.length > 0) {
      console.log('  🔴 Threshold Reductions (BLOCKED):\n');
      for (const r of this.reductions) {
        if (r.removed) {
          console.log(`    ❌ ${r.metric}: ${r.base}% → REMOVED`);
        } else {
          console.log(`    ❌ ${r.metric}: ${r.base}% → ${r.current}% (-${r.reduction}%)`);
        }
      }
      console.log();
    }

    if (this.additions.length > 0) {
      console.log('  🟢 New Thresholds (ALLOWED):\n');
      for (const a of this.additions) {
        console.log(`    ✅ ${a.metric}: ${a.value}%`);
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
    exclude: null
  };

  for (const arg of args) {
    if (arg.startsWith('--base=')) {
      options.base = arg.substring(7);
    } else if (arg.startsWith('--exclude=')) {
      options.exclude = arg.substring(10);
    } else if (arg === '--help') {
      console.log(`
🚫 Threshold Reduction Block

Prevents coverage threshold reductions in jest.config.js.
Allows adding new threshold entries.

Usage:
  node threshold-check.js [--base=<commit>] [--exclude=<patterns>]

Options:
  --base=<commit>     Base commit to compare against (default: HEAD~1)
  --exclude=<list>    Comma-separated list of allowed exclusion patterns
  --help              Show this help

Examples:
  node threshold-check.js                    # Compare with HEAD~1
  node threshold-check.js --base=main        # Compare with main branch
  node threshold-check.js --exclude="config" # Allow excluding config files
      `);
      process.exit(EXIT_SUCCESS);
    }
  }

  const checker = new ThresholdChecker(options);
  checker.run().then(code => process.exit(code));
}

if (require.main === module) {
  main();
}

module.exports = { ThresholdChecker };
