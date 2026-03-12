#!/usr/bin/env node

/**
 * Handoff Automator - Automatic Handoff Generation
 * 
 * Automatically checks session criteria and generates handoff documents:
 * - Files changed > 5
 * - Session duration > 30 minutes
 * - Open TODOs or in-progress tasks
 * 
 * Usage:
 *   npm run agent:handoff          Check and create handoff if needed
 *   npm run agent:handoff --force  Create handoff regardless of criteria
 *   npm run agent:handoff --dry    Check only, no creation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AGENT_DIR = '.agent';
const HANDOFFS_DIR = path.join(AGENT_DIR, 'handoffs');
const SESSION_FILE = path.join(AGENT_DIR, '.session.json');
const TASKS_FILE = path.join(AGENT_DIR, 'tasks.md');
const TEMPLATE_FILE = path.join(HANDOFFS_DIR, 'template.md');

class HandoffAutomator {
  constructor() {
    this.sessionStart = null;
    this.stats = {
      filesChanged: 0,
      duration: 0,
      openTodos: 0,
      inProgressTasks: 0,
      shouldCreateHandoff: false
    };
  }

  async run(options = {}) {
    const { force = false, dryRun = false } = options;
    
    console.log('\n📝 Handoff Automator\n');
    console.log('='.repeat(50));

    // Load session info
    this.loadSession();
    
    // Gather stats
    this.checkGitStatus();
    this.checkDuration();
    this.checkTasks();
    
    // Evaluate criteria
    this.evaluateCriteria(force);
    
    // Report
    this.printReport();
    
    if (dryRun) {
      console.log('\n🔍 Dry run - no handoff created\n');
      return { created: false, dryRun: true, stats: this.stats };
    }
    
    if (!this.stats.shouldCreateHandoff && !force) {
      console.log('\n✅ No handoff required. Session below thresholds.\n');
      console.log('Use --force to create handoff anyway.\n');
      return { created: false, stats: this.stats };
    }
    
    // Create handoff
    const handoffPath = await this.createHandoff();
    
    if (handoffPath) {
      console.log(`\n✅ Handoff created: ${handoffPath}\n`);
      
      // Update LATEST.md
      this.updateLatest(handoffPath);
      
      // Commit handoff
      await this.commitHandoff(handoffPath);
      
      return { created: true, path: handoffPath, stats: this.stats };
    }
    
    return { created: false, stats: this.stats };
  }

  loadSession() {
    if (fs.existsSync(SESSION_FILE)) {
      try {
        const session = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
        this.sessionStart = session.startTime ? new Date(session.startTime) : null;
      } catch (e) {
        // Silent fail
      }
    }
    
    // If no session file, use last commit time as proxy
    if (!this.sessionStart) {
      try {
        const lastCommitTime = execSync('git log -1 --format=%ct', { encoding: 'utf-8' }).trim();
        this.sessionStart = new Date(parseInt(lastCommitTime) * 1000);
      } catch (e) {
        this.sessionStart = new Date();
      }
    }
  }

  checkGitStatus() {
    try {
      // Get files changed since session start or last commit
      const output = execSync('git status --porcelain', { encoding: 'utf-8' });
      const lines = output.split('\n').filter(line => line.trim());
      
      this.stats.filesChanged = lines.length;
      this.stats.changedFilesList = lines.map(line => line.substring(3).trim());
    } catch (e) {
      this.stats.filesChanged = 0;
      this.stats.changedFilesList = [];
    }
  }

  checkDuration() {
    const now = new Date();
    this.stats.duration = Math.floor((now - this.sessionStart) / 1000 / 60); // minutes
  }

  checkTasks() {
    if (!fs.existsSync(TASKS_FILE)) {
      return;
    }
    
    try {
      const content = fs.readFileSync(TASKS_FILE, 'utf-8');
      const lines = content.split('\n');
      
      let inTodoSection = false;
      
      for (const line of lines) {
        // Check for in-progress tasks
        if (line.toLowerCase().includes('status: in-progress') || 
            line.toLowerCase().includes('status: in_progress')) {
          this.stats.inProgressTasks++;
        }
        
        // Count open TODOs (checkboxes)
        if (line.includes('- [ ]') || line.includes('* [ ]')) {
          this.stats.openTodos++;
        }
      }
    } catch (e) {
      // Silent fail
    }
  }

  evaluateCriteria(force) {
    const criteria = {
      filesChanged: this.stats.filesChanged >= 5,
      duration: this.stats.duration >= 30,
      openTodos: this.stats.openTodos > 0,
      inProgress: this.stats.inProgressTasks > 0
    };
    
    this.stats.criteria = criteria;
    this.stats.shouldCreateHandoff = force || 
                                     criteria.filesChanged || 
                                     criteria.duration || 
                                     criteria.openTodos ||
                                     criteria.inProgress;
  }

  printReport() {
    console.log('\n📊 Session Statistics:\n');
    console.log(`  Files Changed:    ${this.stats.filesChanged} ${this.stats.criteria?.filesChanged ? '⚠️' : '✅'}`);
    console.log(`  Duration:         ${this.stats.duration} min ${this.stats.criteria?.duration ? '⚠️' : '✅'}`);
    console.log(`  Open TODOs:       ${this.stats.openTodos} ${this.stats.criteria?.openTodos ? '⚠️' : '✅'}`);
    console.log(`  In Progress:      ${this.stats.inProgressTasks} ${this.stats.criteria?.inProgress ? '⚠️' : '✅'}`);
    
    if (this.stats.filesChanged > 0 && this.stats.filesChanged <= 10) {
      console.log('\n  Changed Files:');
      for (const file of this.stats.changedFilesList.slice(0, 10)) {
        console.log(`    - ${file}`);
      }
    }
    
    console.log('\n' + '-'.repeat(50));
  }

  async createHandoff() {
    if (!fs.existsSync(TEMPLATE_FILE)) {
      console.error('❌ Template not found:', TEMPLATE_FILE);
      return null;
    }
    
    try {
      // Load template
      let template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');
      
      // Get project info
      const projectName = this.getProjectName();
      const branch = this.getCurrentBranch();
      const timestamp = new Date();
      const dateStr = timestamp.toISOString().split('T')[0];
      const timeStr = timestamp.toTimeString().split(' ')[0].substring(0, 5);
      
      // Generate filename
      const shortDesc = this.generateShortDescription();
      const filename = `${dateStr}_handoff_${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}_${shortDesc}.md`;
      
      // Determine handoff directory
      const handoffDir = path.join(HANDOFFS_DIR, 'projects', projectName.toLowerCase().replace(/[^a-z0-9]/g, '-'));
      if (!fs.existsSync(handoffDir)) {
        fs.mkdirSync(handoffDir, { recursive: true });
      }
      
      const handoffPath = path.join(handoffDir, filename);
      
      // Fill template
      template = template.replace(/<Kurztitel>/g, shortDesc.replace(/-/g, ' '));
      template = template.replace(/<YYYY-MM-DD HH:MM>/g, `${dateStr} ${timeStr}`);
      template = template.replace(/KI-Dev-Agent/g, projectName);
      template = template.replace(/<Agent-Name\/Session-ID>/g, 'AI Agent');
      template = template.replace(/<feature-branch-name>/g, branch);
      template = template.replace(/#<Issue-Nummer>/g, this.getCurrentTaskRef());
      template = template.replace(/<in-progress \| abgeschlossen \| übergaben>/g, this.stats.inProgressTasks > 0 ? 'in-progress' : 'abgeschlossen');
      
      // Fill file changes table
      const fileTable = this.generateFileTable();
      template = template.replace(/\| `path\/to\/file\.md` \| created\/modified \| Kurze Beschreibung \|/g, fileTable);
      
      // Fill TODOs section
      const todosSection = this.generateTodosSection();
      template = template.replace(/### Priorität: Hoch\n- \[ \] \*\*TODO-Titel\*\* \(Task #X\)/g, todosSection);
      
      // Fill copy-paste block
      template = template.replace(/<YYYY-MM-DD>/g, dateStr);
      template = template.replace(/<Link zum Handoff-Dokument>/g, `./${filename}`);
      template = template.replace(/<branch-name>/g, branch);
      
      // Write handoff
      fs.writeFileSync(handoffPath, template);
      
      return handoffPath;
    } catch (error) {
      console.error('❌ Failed to create handoff:', error.message);
      return null;
    }
  }

  getProjectName() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      return packageJson.name || 'unknown-project';
    } catch (e) {
      return path.basename(process.cwd());
    }
  }

  getCurrentBranch() {
    try {
      return execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    } catch (e) {
      return 'main';
    }
  }

  getCurrentTaskRef() {
    // Try to extract task reference from branch name or recent commits
    try {
      const branch = this.getCurrentBranch();
      const match = branch.match(/t-(\d+)/);
      if (match) {
        return `#${match[1]}`;
      }
      
      const lastCommit = execSync('git log -1 --format=%s', { encoding: 'utf-8' }).trim();
      const commitMatch = lastCommit.match(/#(\d+)/);
      if (commitMatch) {
        return `#${commitMatch[1]}`;
      }
    } catch (e) {
      // Silent fail
    }
    
    return 'N/A';
  }

  generateShortDescription() {
    // Generate description from changed files or last commit
    if (this.stats.changedFilesList.length > 0) {
      const firstFile = path.basename(this.stats.changedFilesList[0]);
      const name = firstFile.replace(/\.[^/.]+$/, '').toLowerCase();
      return name.substring(0, 30).replace(/[^a-z0-9]/g, '-');
    }
    
    try {
      const lastCommit = execSync('git log -1 --format=%s', { encoding: 'utf-8' }).trim();
      return lastCommit.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
    } catch (e) {
      return 'session-update';
    }
  }

  generateFileTable() {
    if (this.stats.changedFilesList.length === 0) {
      return '| None | - | No files changed |';
    }
    
    return this.stats.changedFilesList.slice(0, 15).map(file => {
      const status = file.includes('??') ? 'created' : 'modified';
      const cleanFile = file.replace(/^\s*\S+\s+/, '');
      return `| \`${cleanFile}\` | ${status} | Updated during session |`;
    }).join('\n');
  }

  generateTodosSection() {
    if (this.stats.openTodos === 0) {
      return '### Priorität: Hoch\n- [x] Alle Tasks abgeschlossen';
    }
    
    // Try to extract actual TODOs from tasks.md
    try {
      const content = fs.readFileSync(TASKS_FILE, 'utf-8');
      const todos = [];
      const lines = content.split('\n');
      
      for (const line of lines) {
        if (line.includes('- [ ]') || line.includes('* [ ]')) {
          const todo = line.replace(/[*-]\s*\[\s*\]\s*/, '').trim();
          if (todo && !todos.includes(todo)) {
            todos.push(todo);
          }
        }
      }
      
      if (todos.length > 0) {
        return '### Priorität: Hoch\n' + todos.slice(0, 5).map(t => `- [ ] ${t}`).join('\n');
      }
    } catch (e) {
      // Silent fail
    }
    
    return `### Priorität: Hoch\n- [ ] ${this.stats.openTodos} open TODOs from tasks.md`;
  }

  updateLatest(handoffPath) {
    try {
      const projectName = this.getProjectName().toLowerCase().replace(/[^a-z0-9]/g, '-');
      const projectDir = path.join(HANDOFFS_DIR, 'projects', projectName);
      const latestPath = path.join(projectDir, 'LATEST.md');
      
      const handoffFilename = path.basename(handoffPath);
      const timestamp = new Date().toISOString().split('T')[0];
      
      const content = `# Latest Handoff

**Project:** ${this.getProjectName()}
**Link:** [${handoffFilename}](./${handoffFilename})
**Updated:** ${timestamp}

---

## Letzte Session

- **Datum:** ${timestamp}
- **Titel:** ${this.generateShortDescription().replace(/-/g, ' ')}
- **Inhalt:** ${this.stats.filesChanged} files changed, ${this.stats.openTodos} open TODOs

## Quick Links

- [Handoff-System README](./README.md)
- [Template](./template.md)
- [Alle Handoffs](./)

---

*Letzte Aktualisierung: ${timestamp}*
`;
      
      fs.writeFileSync(latestPath, content);
    } catch (e) {
      console.warn('⚠️ Could not update LATEST.md:', e.message);
    }
  }

  async commitHandoff(handoffPath) {
    try {
      const relativePath = path.relative(process.cwd(), handoffPath);
      const latestPath = path.join(path.dirname(handoffPath), 'LATEST.md');
      const relativeLatest = path.relative(process.cwd(), latestPath);
      
      execSync(`git add "${relativePath}" "${relativeLatest}"`, { stdio: 'pipe' });
      
      const hasChanges = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
      if (hasChanges) {
        execSync('git commit -m "docs: add handoff for session"', { stdio: 'pipe' });
        console.log('✅ Handoff committed');
      }
    } catch (e) {
      console.warn('⚠️ Could not commit handoff:', e.message);
    }
  }
}

// CLI handling
const args = process.argv.slice(2);
const automator = new HandoffAutomator();

async function main() {
  const options = {
    force: args.includes('--force'),
    dryRun: args.includes('--dry') || args.includes('--dry-run')
  };
  
  if (args.includes('--help')) {
    console.log(`
📝 Handoff Automator

Automatically checks session criteria and generates handoff documents.

Usage:
  npm run agent:handoff              Check criteria and create if needed
  npm run agent:handoff --force      Create handoff regardless of criteria
  npm run agent:handoff --dry        Check only, don't create

Criteria (OR logic):
  - Files changed >= 5
  - Session duration >= 30 minutes
  - Open TODOs in tasks.md
  - In-progress tasks in tasks.md

The handoff is automatically committed to git.
    `);
    process.exit(0);
  }
  
  const result = await automator.run(options);
  process.exit(result.created ? 0 : 0);
}

main().catch(error => {
  console.error('\n❌ Handoff automator failed:', error.message);
  process.exit(1);
});
