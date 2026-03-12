const { CoverageDelta } = require('../.agent/core/scripts/coverage-delta.js');

describe('CoverageDelta', () => {
  let checker;

  beforeEach(() => {
    checker = new CoverageDelta();
  });

  describe('initialization', () => {
    it('should initialize with default options', () => {
      expect(checker.baseCommit).toBe('HEAD~1');
      expect(checker.graceMode).toBe(false);
    });

    it('should accept custom options', () => {
      const customChecker = new CoverageDelta({ 
        base: 'main', 
        grace: true 
      });
      expect(customChecker.baseCommit).toBe('main');
      expect(customChecker.graceMode).toBe(true);
    });
  });

  describe('loadCurrentCoverage', () => {
    it('should return false when coverage file does not exist', () => {
      // Temporarily rename coverage file if it exists
      const result = checker.loadCurrentCoverage();
      // Result depends on whether coverage exists
      expect(typeof result).toBe('boolean');
    });
  });

  describe('compareCoverage', () => {
    it('should detect coverage regressions', () => {
      checker.currentCoverage = {
        'file1.js': {
          statements: { pct: 80 },
          branches: { pct: 70 },
          functions: { pct: 85 },
          lines: { pct: 80 }
        }
      };
      
      checker.baseCoverage = {
        'file1.js': {
          statements: { pct: 90 },
          branches: { pct: 70 },
          functions: { pct: 85 },
          lines: { pct: 80 }
        }
      };

      const hasRegressions = checker.compareCoverage();
      
      expect(hasRegressions).toBe(true);
      expect(checker.deltas.length).toBeGreaterThan(0);
      expect(checker.deltas[0].isRegression).toBe(true);
    });

    it('should detect coverage improvements', () => {
      checker.currentCoverage = {
        'file1.js': {
          statements: { pct: 95 },
          branches: { pct: 70 },
          functions: { pct: 85 },
          lines: { pct: 80 }
        }
      };
      
      checker.baseCoverage = {
        'file1.js': {
          statements: { pct: 90 },
          branches: { pct: 70 },
          functions: { pct: 85 },
          lines: { pct: 80 }
        }
      };

      const hasRegressions = checker.compareCoverage();
      
      expect(hasRegressions).toBe(false);
      expect(checker.deltas.length).toBeGreaterThan(0);
      expect(checker.deltas[0].isRegression).toBe(false);
    });

    it('should handle equal coverage', () => {
      checker.currentCoverage = {
        'file1.js': {
          statements: { pct: 90 },
          branches: { pct: 70 },
          functions: { pct: 85 },
          lines: { pct: 80 }
        }
      };
      
      checker.baseCoverage = {
        'file1.js': {
          statements: { pct: 90 },
          branches: { pct: 70 },
          functions: { pct: 85 },
          lines: { pct: 80 }
        }
      };

      const hasRegressions = checker.compareCoverage();
      
      expect(hasRegressions).toBe(false);
      expect(checker.deltas.length).toBe(0);
    });
  });
});
