#!/usr/bin/env node

/**
 * Task Runner - Executes tasks from .agent/tasks.md
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TASKS_FILE = '.agent/tasks.md';
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

class TaskRunner {
  constructor() {
    this.tasks = [];
    this.loaded = false;
  }

  load() {
    if (this.loaded) return;
    
    if (!fs.existsSync(TASKS_FILE)) {
      console.warn('⚠️ Tasks file not found:', TASKS_FILE);
      return;
    }

    const content = fs.readFileSync(TASKS_FILE, 'utf-8');
    this.tasks = this.parseTasks(content);
    this.loaded = true;
    console.log(`✅ Loaded ${this.tasks.length} tasks`);
  }

  parseTasks(content) {
    const tasks = [];
    const taskBlocks = content.match(/<!-- TASKS-START -->[\s\S]*?<!-- TASKS-END -->/g) || [];

    for (const block of taskBlocks) {
      const task = {
        issue: '',
        branch: '',
        status: 'todo',
        priority: 'medium',
        notes: ''
      };

      const issueMatch = block.match(/- GitHub Issue:\s*(.+)/);
      if (issueMatch) task.issue = issueMatch[1].trim();

      const branchMatch = block.match(/- Branch:\s*(.+)/);
      if (branchMatch) task.branch = branchMatch[1].trim();

      const statusMatch = block.match(/- Status:\s*(.+)/);
      if (statusMatch) task.status = statusMatch[1].trim();

      const priorityMatch = block.match(/- Priority:\s*(.+)/);
      if (priorityMatch) task.priority = priorityMatch[1].trim();

      const notesMatch = block.match(/- Notes:\s*(.+)/);
      if (notesMatch) task.notes = notesMatch[1].trim();

      if (task.issue) {
        tasks.push(task);
      }
    }

    return tasks;
  }

  getOpenTasks() {
    return this.tasks.filter(t => t.status !== 'done');
  }

  getNextTask() {
    const openTasks = this.getOpenTasks();
    
    return openTasks.sort((a, b) => {
      const priDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (priDiff !== 0) return priDiff;
      
      const aNum = parseInt(a.branch.replace(/\D/g, '')) || 0;
      const bNum = parseInt(b.branch.replace(/\D/g, '')) || 0;
      return aNum - bNum;
    })[0];
  }

  getTaskByBranch(branch) {
    return this.tasks.find(t => t.branch === branch);
  }

  updateTaskStatus(branch, newStatus) {
    const task = this.getTaskByBranch(branch);
    if (!task) {
      console.error(`❌ Task not found: ${branch}`);
      return false;
    }

    const content = fs.readFileSync(TASKS_FILE, 'utf-8');
    const updated = content.replace(
      new RegExp(`(${branch}[\\s\\S]*?- Status:)\\s*\\w+`),
      `$1 ${newStatus}`
    );

    fs.writeFileSync(TASKS_FILE, updated);
    task.status = newStatus;
    
    console.log(`✅ Updated task ${branch} to ${newStatus}`);
    return true;
  }

  createBranch(branch, baseBranch = 'main') {
    try {
      execSync(`git fetch origin ${baseBranch}`, { stdio: 'pipe' });
      execSync(`git checkout -b ${branch} origin/${baseBranch}`, { stdio: 'pipe' });
      console.log(`✅ Created and checked out branch: ${branch}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to create branch: ${error.message}`);
      return false;
    }
  }

  switchToBranch(branch) {
    try {
      execSync(`git checkout ${branch}`, { stdio: 'pipe' });
      console.log(`✅ Switched to branch: ${branch}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to switch branch: ${error.message}`);
      return false;
    }
  }

  async runTask(task, options = {}) {
    const { createBranch: doCreateBranch = true } = options;

    console.log(`\n🚀 Running task: ${task.branch}`);
    console.log(`   Issue: ${task.issue}`);
    console.log(`   Priority: ${task.priority}`);
    console.log(`   Notes: ${task.notes}\n`);

    if (doCreateBranch) {
      this.updateTaskStatus(task.branch, 'in-progress');
    }

    return task;
  }

  listTasks(filter = 'all') {
    let filtered = this.tasks;
    
    if (filter === 'open') {
      filtered = this.tasks.filter(t => t.status !== 'done');
    } else if (filter === 'done') {
      filtered = this.tasks.filter(t => t.status === 'done');
    }

    console.log(`\n📋 Tasks (${filter}):\n`);
    for (const task of filtered) {
      const statusIcon = task.status === 'done' ? '✅' : task.status === 'in-progress' ? '🔄' : '⏳';
      console.log(`  ${statusIcon} [${task.priority}] ${task.branch}`);
      console.log(`     ${task.notes}`);
      console.log(`     Issue: ${task.issue}\n`);
    }
  }
}

const runner = new TaskRunner();

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  runner.load();

  switch (command) {
    case 'list': {
      const filter = args[1] || 'all';
      runner.listTasks(filter);
      break;
    }
    case 'next': {
      const task = runner.getNextTask();
      if (!task) {
        console.log('✅ All tasks completed!');
        break;
      }
      console.log(`\n🎯 Next task:\n`);
      console.log(`  Branch: ${task.branch}`);
      console.log(`  Issue: ${task.issue}`);
      console.log(`  Priority: ${task.priority}`);
      console.log(`  Notes: ${task.notes}`);
      break;
    }
    case 'start': {
      const branch = args[1];
      if (!branch) {
        console.log('Usage: task-runner.js start <branch>');
        process.exit(1);
      }
      const task = runner.getTaskByBranch(branch);
      if (!task) {
        console.log(`❌ Task not found: ${branch}`);
        process.exit(1);
      }
      runner.createBranch(branch);
      runner.updateTaskStatus(branch, 'in-progress');
      break;
    }
    case 'done': {
      const branch = args[1];
      if (!branch) {
        console.log('Usage: task-runner.js done <branch>');
        process.exit(1);
      }
      runner.updateTaskStatus(branch, 'done');
      break;
    }
    case 'switch': {
      const branch = args[1];
      if (!branch) {
        console.log('Usage: task-runner.js switch <branch>');
        process.exit(1);
      }
      runner.switchToBranch(branch);
      break;
    }
    default:
      console.log(`
🔧 Task Runner CLI

Commands:
  task-runner.js list [all|open|done]   List tasks
  task-runner.js next                    Show next task
  task-runner.js start <branch>         Start task (create branch)
  task-runner.js done <branch>          Mark task as done
  task-runner.js switch <branch>        Switch to branch

Examples:
  task-runner.js list open
  task-runner.js next
  task-runner.js start ai-task-18
  task-runner.js done ai-task-17
      `);
  }
}

main().catch(console.error);
