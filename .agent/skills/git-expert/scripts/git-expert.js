#!/usr/bin/env node

/**
 * Git Expert Skill - CLI Tool
 * Provides Git operations for automated development workflows
 */

const { execSync, spawn } = require('child_process');
const path = require('path');

class GitExpert {
  constructor(options = {}) {
    this.cwd = options.cwd || process.cwd();
  }

  async execute(command) {
    try {
      const result = execSync(command, {
        cwd: this.cwd,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      return { success: true, data: result.trim() };
    } catch (error) {
      return { 
        success: false, 
        error: { 
          code: 'EXEC_ERROR', 
          message: error.message,
          stderr: error.stderr 
        } 
      };
    }
  }

  async get_status(verbose = false) {
    try {
      const result = execSync('git status --porcelain' + (verbose ? ' -sb' : ''), {
        cwd: this.cwd,
        encoding: 'utf-8'
      });

      const lines = result.trim().split('\n').filter(l => l);
      const status = {
        current: null,
        tracking: null,
        staged: [],
        modified: [],
        not_added: [],
        untracked: []
      };

      if (verbose) {
        const branchInfo = execSync('git branch -v', { cwd: this.cwd, encoding: 'utf-8' });
        const current = branchInfo.split('\n').find(l => l.startsWith('*'));
        if (current) {
          status.current = current.replace('*', '').trim().split(' ')[0];
        }
      }

      for (const line of lines) {
        const indexStatus = line[0];
        const workTreeStatus = line[1];
        const file = line.substring(3);

        if (indexStatus === '?') {
          status.untracked.push(file);
        } else {
          if (indexStatus !== ' ') status.staged.push(file);
          if (workTreeStatus !== ' ') status.modified.push(file);
          status.not_added.push(file);
        }
      }

      return { success: true, data: status };
    } catch (error) {
      return { success: false, error: { code: 'STATUS_ERROR', message: error.message } };
    }
  }

  async create_branch(branchName, startPoint = null) {
    try {
      const args = ['checkout', '-b', branchName];
      if (startPoint) args.push(startPoint);
      
      execSync('git ' + args.join(' '), { cwd: this.cwd, encoding: 'utf-8' });
      return { success: true, data: { branch: branchName, startPoint } };
    } catch (error) {
      return { success: false, error: { code: 'BRANCH_CREATE_ERROR', message: error.message } };
    }
  }

  async commit_changes(message, type = 'feat', files = null) {
    try {
      if (files) {
        execSync('git add ' + files.join(' '), { cwd: this.cwd, encoding: 'utf-8' });
      } else {
        execSync('git add -A', { cwd: this.cwd, encoding: 'utf-8' });
      }

      const fullMessage = type ? `${type}: ${message}` : message;
      const result = execSync('git commit -m "' + fullMessage + '"', { 
        cwd: this.cwd, 
        encoding: 'utf-8' 
      });

      const hash = execSync('git rev-parse HEAD', { cwd: this.cwd, encoding: 'utf-8' }).trim();
      return { success: true, data: { message: fullMessage, hash: hash.substring(0, 8) } };
    } catch (error) {
      return { success: false, error: { code: 'COMMIT_ERROR', message: error.message } };
    }
  }

  async get_branches(remote = false) {
    try {
      const args = remote ? ['branch', '-a'] : ['branch'];
      const result = execSync('git ' + args.join(' '), { cwd: this.cwd, encoding: 'utf-8' });
      
      const branches = result.trim().split('\n')
        .map(b => b.replace('*', '').trim())
        .filter(b => b);

      return { success: true, data: { branches, remote } };
    } catch (error) {
      return { success: false, error: { code: 'BRANCH_LIST_ERROR', message: error.message } };
    }
  }

  async delete_branch(branchName, isRemote = false, force = false) {
    try {
      const args = ['branch'];
      if (force) args.push('-D');
      else args.push('-d');
      
      if (isRemote) {
        execSync('git push origin --delete ' + branchName, { cwd: this.cwd, encoding: 'utf-8' });
      } else {
        args.push(branchName);
        execSync('git ' + args.join(' '), { cwd: this.cwd, encoding: 'utf-8' });
      }

      return { success: true, data: { branch: branchName, remote: isRemote, force } };
    } catch (error) {
      return { success: false, error: { code: 'BRANCH_DELETE_ERROR', message: error.message } };
    }
  }

  async stash_changes(message = null, includeUntracked = true) {
    try {
      const args = ['stash', 'push'];
      if (includeUntracked) args.push('-u');
      if (message) args.push('-m', message);

      execSync('git ' + args.join(' '), { cwd: this.cwd, encoding: 'utf-8' });
      return { success: true, data: { message, includeUntracked } };
    } catch (error) {
      return { success: false, error: { code: 'STASH_ERROR', message: error.message } };
    }
  }

  async apply_stash(stashIndex = 0) {
    try {
      execSync('git stash pop stash@{' + stashIndex + '}', { 
        cwd: this.cwd, 
        encoding: 'utf-8' 
      });
      return { success: true, data: { stashIndex } };
    } catch (error) {
      return { success: false, error: { code: 'STASH_POP_ERROR', message: error.message } };
    }
  }

  async get_log(maxCount = 10, format = 'short') {
    try {
      const formatMap = {
        short: '%h %s',
        medium: '%h %an %ad %s',
        full: '%H%n%an%n%ae%n%ad%n%s%n%b'
      };

      const formatStr = formatMap[format] || formatMap.short;
      const result = execSync(
        'git log --format="' + formatStr + '" -n ' + maxCount,
        { cwd: this.cwd, encoding: 'utf-8' }
      );

      const commits = result.trim().split('\n').filter(c => c).map(line => {
        const parts = line.split(' ');
        return { hash: parts[0], message: parts.slice(1).join(' ') };
      });

      return { success: true, data: { commits, count: commits.length } };
    } catch (error) {
      return { success: false, error: { code: 'LOG_ERROR', message: error.message } };
    }
  }

  async create_pull_request(options) {
    const { title, body = '', head, base = 'main', draft = false } = options;

    try {
      const args = ['pr', 'create', '--title', title, '--body', body, '--base', base, '--head', head];
      if (draft) args.push('--draft');

      const result = execSync('gh ' + args.join(' '), { cwd: this.cwd, encoding: 'utf-8' });
      
      const urlMatch = result.match(/https:\/\/[^\s]+/);
      const prMatch = result.match(/#(\d+)/);
      
      return { 
        success: true, 
        data: { 
          title, 
          body, 
          head, 
          base, 
          draft,
          url: urlMatch ? urlMatch[0] : null,
          pr_number: prMatch ? parseInt(prMatch[1]) : null
        } 
      };
    } catch (error) {
      return { success: false, error: { code: 'PR_CREATE_ERROR', message: error.message } };
    }
  }
}

// CLI handling
const args = process.argv.slice(2);
const git = new GitExpert();

async function run() {
  const command = args[0];

  switch (command) {
    case 'status': {
      const verbose = args.includes('--verbose') || args.includes('-v');
      const result = await git.get_status(verbose);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'branches': {
      const remote = args.includes('--remote') || args.includes('-r');
      const result = await git.get_branches(remote);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'log': {
      const result = await git.get_log(10, 'short');
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'branch': {
      const branchName = args[1];
      if (!branchName) {
        console.log('Usage: git-expert.js branch <branch-name> [start-point]');
        process.exit(1);
      }
      const startPoint = args[2];
      const result = await git.create_branch(branchName, startPoint);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'commit': {
      const message = args.slice(1).join(' ');
      if (!message) {
        console.log('Usage: git-expert.js commit <message>');
        process.exit(1);
      }
      const result = await git.commit_changes(message);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    default:
      console.log(`
🔧 Git Expert CLI

Usage:
  git-expert.js status [--verbose]       Get repository status
  git-expert.js branches [--remote]     List branches
  git-expert.js log                     Get commit history
  git-expert.js branch <name> [start]  Create new branch
  git-expert.js commit <message>        Commit changes

Examples:
  git-expert.js status -v
  git-expert.js branches --remote
  git-expert.js branch feature/t-17-github-projects main
  git-expert.js commit "Add new feature"
      `);
  }
}

run().catch(console.error);
