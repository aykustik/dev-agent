#!/usr/bin/env node

/**
 * Handoff Generator - Generates Handoff Documents
 */

const fs = require('fs');
const path = require('path');

const HANDOFFS_DIR = '.agent/handoffs';
const TEMPLATE_FILE = `${HANDOFFS_DIR}/template.md`;
const PROJECTS_DIR = `${HANDOFFS_DIR}/projects`;
const LATEST_LINK = `${PROJECTS_DIR}/LATEST.md`;

class HandoffGenerator {
  constructor() {
    this.template = '';
    this.loaded = false;
  }

  load() {
    if (this.loaded) return;
    
    if (!fs.existsSync(TEMPLATE_FILE)) {
      console.error('❌ Template not found:', TEMPLATE_FILE);
      process.exit(1);
    }

    this.template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');
    this.loaded = true;
  }

  generate(sessionData = {}) {
    this.load();

    const defaults = {
      title: 'Session Handoff',
      project: 'KI-Dev-Agent',
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      author: 'Agent',
      branch: 'main',
      taskRef: '',
      status: 'in-progress',
      goals: [],
      changes: [],
      decisions: [],
      openQuestions: [],
      todos: [],
      bugs: [],
      techDebt: [],
      risks: []
    };

    const data = { ...defaults, ...sessionData };
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `${dateStr}_handoff_${data.branch.replace(/\//g, '-')}.md`;
    const filepath = path.join(PROJECTS_DIR, filename);

    if (!fs.existsSync(PROJECTS_DIR)) {
      fs.mkdirSync(PROJECTS_DIR, { recursive: true });
    }

    let content = this.template
      .replace('<Kurztitel>', data.title)
      .replace('<YYYY-MM-DD HH:MM>', data.date)
      .replace('<Agent-Name/Session-ID>', data.author)
      .replace('<feature-branch-name>', data.branch)
      .replace('<Issue-Nummer>', data.taskRef)
      .replace('<in-progress | abgeschlossen | übergaben>', data.status);

    let goalsHtml = data.goals.map(g => `- [ ] ${g}`).join('\n');
    content = content.replace('- [ ] Ziel 1\n- [ ] Ziel 2', goalsHtml || '- [ ] (none)');

    let changesHtml = data.changes.map(c => {
      return `| \`${c.file || 'path/to/file'}\` | ${c.type || 'modified'} | ${c.desc || 'description'} |`;
    }).join('\n');
    content = content.replace('| `path/to/file.md` | created/modified | Kurze Beschreibung |', changesHtml || '| *(none)* | | |');

    let decisionsHtml = data.decisions.map(d => 
      `- **Entscheidung:** ${d.decision}\n  - **Begründung:** ${d.reason}\n  - **Alternative verworfen:** ${d.alternative || 'none'}`
    ).join('\n\n');
    content = content.replace('*Beschreibung der getroffenen Entscheidungen*', decisionsHtml || '*(none)*');

    let questionsHtml = data.openQuestions.map(q => `- [ ] ${q}`).join('\n');
    content = content.replace('- [ ] Frage 1 (offen)\n- [ ] Frage 2 (offen)', questionsHtml || '- [ ] (none)');

    let todosHtml = '';
    const highTodos = data.todos.filter(t => t.priority === 'high');
    const mediumTodos = data.todos.filter(t => t.priority === 'medium');
    const lowTodos = data.todos.filter(t => t.priority === 'low');

    if (highTodos.length) {
      todosHtml += '### Priorität: Hoch\n';
      todosHtml += highTodos.map(t => `- [ ] **${t.title}** (Task #${t.task || '?'})\n  - Datei: \`${t.file || 'path/to/file'}\`\n  - Grund: ${t.reason || 'pending'}`).join('\n\n');
    }
    if (mediumTodos.length) {
      todosHtml += '\n### Priorität: Mittel\n';
      todosHtml += mediumTodos.map(t => `- [ ] **${t.title}**`).join('\n');
    }
    if (lowTodos.length) {
      todosHtml += '\n### Priorität: Niedrig\n';
      todosHtml += lowTodos.map(t => `- [ ] **${t.title}**`).join('\n');
    }
    content = content.replace(/### Priorität: Hoch[\s\S]*?### Priorität: Niedrig\n- \.\.\./, todosHtml || '### Priorität: Hoch\n- [ ] (none)\n\n### Priorität: Mittel\n- [ ] (none)\n\n### Priorität: Niedrig\n- [ ] (none)');

    let bugsHtml = data.bugs.map(b => `- ${b}`).join('\n');
    content = content.replace('- [ ] Kurze Beschreibung (Datei/Zeile)', bugsHtml || '- [ ] (none)');

    let debtHtml = data.techDebt.map(t => `- ${t}`).join('\n');
    content = content.replace('- Beschreibung', debtHtml || '- (none)');

    let risksHtml = data.risks.map(r => `- ${r}`).join('\n');
    content = content.replace('- [ ] Risiko 1 - Mitigation', risksHtml || '- [ ] (none)');

    content = content.replace('<YYYY-MM-DD HH:MM>', data.date);

    fs.writeFileSync(filepath, content);

    this.updateLatestLink(data.project, filename);

    console.log(`✅ Generated handoff: ${filepath}`);
    return filepath;
  }

  updateLatestLink(project, filename) {
    const linkContent = `# Latest Handoff

**Project:** ${project}
**Link:** [${filename}](./${filename})
**Updated:** ${new Date().toISOString().slice(0, 16).replace('T', ' ')}

---
[📂 All Handoffs](./)
`;

    fs.writeFileSync(LATEST_LINK, linkContent);
    console.log(`✅ Updated LATEST.md`);
  }

  readLatestHandoff(project = 'KI-Dev-Agent') {
    if (!fs.existsSync(LATEST_LINK)) {
      return null;
    }

    const content = fs.readFileSync(LATEST_LINK, 'utf-8');
    const match = content.match(/\[(.+_handoff_.+)\]\(\.\/(.+)\)/);
    
    if (!match) return null;

    const filename = match[2];
    const filepath = path.join(PROJECTS_DIR, filename);

    if (!fs.existsSync(filepath)) return null;

    return {
      filename,
      content: fs.readFileSync(filepath, 'utf-8')
    };
  }

  extractTodos(handoffContent) {
    const todos = [];
    
    const highSection = handoffContent.match(/### Priorität: Hoch\n([\s\S]*?)(?=###|$)/);
    if (highSection && highSection[1]) {
      const items = highSection[1].match(/- \[ \] \*\*(.+?)\*\*/g) || [];
      for (const item of items) {
        const title = item.replace('- [ ] **', '').replace('**', '');
        todos.push({ title, priority: 'high' });
      }
    }

    return todos;
  }

  listHandoffs() {
    if (!fs.existsSync(PROJECTS_DIR)) {
      console.log('📁 No handoffs found');
      return;
    }

    const files = fs.readdirSync(PROJECTS_DIR)
      .filter(f => f.endsWith('.md') && f !== 'LATEST.md')
      .sort()
      .reverse();

    console.log(`\n📂 Handoffs (${files.length}):\n`);
    for (const file of files) {
      const filepath = path.join(PROJECTS_DIR, file);
      const stats = fs.statSync(filepath);
      const date = stats.mtime.toISOString().slice(0, 10);
      console.log(`  ${date} - ${file}`);
    }
  }
}

const generator = new HandoffGenerator();

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'generate':
    case 'gen': {
      const sessionData = {
        title: args[1] || 'Session Handoff',
        branch: args[2] || 'main',
        taskRef: args[3] || '',
        goals: [],
        changes: [],
        todos: []
      };
      generator.generate(sessionData);
      break;
    }
    case 'latest': {
      const latest = generator.readLatestHandoff();
      if (!latest) {
        console.log('❌ No latest handoff found');
        break;
      }
      console.log(`\n📄 Latest: ${latest.filename}\n`);
      console.log(latest.content.slice(0, 500) + '...');
      break;
    }
    case 'list': {
      generator.listHandoffs();
      break;
    }
    case 'extract-todos': {
      const latest = generator.readLatestHandoff();
      if (!latest) {
        console.log('❌ No latest handoff found');
        break;
      }
      const todos = generator.extractTodos(latest.content);
      console.log('\n📋 Open TODOs:\n');
      for (const todo of todos) {
        console.log(`  [${todo.priority}] ${todo.title}`);
      }
      break;
    }
    default:
      console.log(`
🔧 Handoff Generator CLI

Commands:
  handoff-gen.js generate <title> <branch> <issue>  Generate new handoff
  handoff-gen.js latest                        Show latest handoff
  handoff-gen.js list                          List all handoffs
  handoff-gen.js extract-todos                Extract TODOs from latest

Examples:
  handoff-gen.js gen "Feature X" feature-x 17
  handoff-gen.js latest
  handoff-gen.js list
      `);
  }
}

main().catch(console.error);
