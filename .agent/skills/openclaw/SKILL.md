# OpenClaw Skill für OpenCode

Dieser Skill enthält umfassendes Expertenwissen über OpenClaw - ein self-hosted Gateway, das Chat-Apps mit KI-Agenten verbindet.

## Was ist OpenClaw?

OpenClaw ist ein **self-hosted Gateway** das Chat-Apps mit KI-Agenten (standardmäßig Pi) verbindet. Es läuft auf deiner eigenen Hardware und gibt dir volle Kontrolle über deine Daten.

**Unterstützte Channels:**
- WhatsApp, Telegram, Discord, iMessage (BlueBubbles), Slack, Signal, Microsoft Teams, Google Chat, IRC, Matrix, Mattermost, LINE, Feishu, Nostr, Synology Chat, Nextcloud Talk, Twitch

**Installation:**
```bash
# macOS/Linux
curl -fsSL https://openclaw.ai/install.sh | bash

# Windows (PowerShell)
iwr -useb https://openclaw.ai/install.ps1 | iex

# Node.js
npm install -g openclaw@latest
```

**Voraussetzungen**: Node 22+

---

## Pi Agent (Integrierter Coding Agent)

OpenClaw nutzt standardmäßig den **Pi Agent** als eingebetteten KI-Agenten. Pi ist ein leistungsfähiger Coding Agent mit Tool-Integration.

### Pi vs. externer Agent

| Aspekt | Pi (eingebettet) | Externer Agent |
|--------|-------------------|----------------|
| Aufruf | `createAgentSession()` via SDK | `pi` command / RPC |
| Tools | OpenClaw Tool Suite | Default coding tools |
| System Prompt | Dynamisch per Channel | AGENTS.md + Prompts |
| Session Storage | `~/.openclaw/agents/<agentId>/sessions/` | `~/.pi/agent/sessions/` |
| Auth | Multi-profile mit Rotation | Single credential |

### Pi Integration Features

- **Tool Signature Alignment**: Adaptiert zwischen pi-agent-core und OpenClaw Signaturen
- **Provider-specific Handling**:
  - Anthropic: Refusal magic string scrubbing, Turn validation
  - Google/Gemini: Turn ordering fixes, Tool schema sanitization
  - OpenAI: `apply_patch` tool für Codex models
- **Error Handling**: Context overflow, Compaction failure, Auth errors, Rate limits, Failover
- **Thinking Levels**: `off`, `minimal`, `low`, `medium`, `high`, `xhigh` (GPT-5.2 + Codex)
- **Sandbox Integration**: Tools und Paths werden im Container eingeschränkt

### Thinking Levels

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-sonnet-4-5",
        thinking: "medium"
      }
    }
  }
}
```

**Unterstützte Levels**: `off`, `minimal`, `low`, `medium`, `high`, `xhigh`

---

## ACP (Agent Connector Protocol)

ACP verbindet IDEs (Zed, Cursor, etc.) mit dem OpenClaw Gateway über WebSocket/stdio.

### ACP starten

```bash
# Lokales Gateway
openclaw acp

# Remote Gateway
openclaw acp --url wss://gateway-host:18789 --token <token>

# Token aus Datei
openclaw acp --url wss://gateway-host:18789 --token-file ~/.openclaw/gateway.token

# An existierende Session anhängen
openclaw acp --session agent:main:main
openclaw acp --session-label "support inbox"

# Session zurücksetzen
openclaw acp --session agent:main:main --reset-session
```

### Zed Editor Setup

```json
{
  "agent_servers": {
    "OpenClaw ACP": {
      "type": "custom",
      "command": "openclaw",
      "args": ["acp"],
      "env": {}
    }
  }
}
```

### Session Mapping

- Standard: `acp:<uuid>` (isolierte Session)
- `--session <key>`: Spezifische Gateway Session
- `--session-label <label>`: Existierende Session nach Label
- `--reset-session`: Frische Session mit gleicher Key

### ACP Client (Debug)

```bash
openclaw acp client
openclaw acp client --server-args --url wss://gateway-host:18789 --token-file ~/.openclaw/gateway.token
```

---

## Memory System

OpenClaw Memory ist **Plain Markdown** im Agent Workspace. Dateien sind die Quelle der Wahrheit.

### Memory Files

- `memory/YYYY-MM-DD.md` - Tägliches Log (append-only), heute + yesterday werden gelesen
- `MEMORY.md` - Kuratierter Langzeit-Speicher (nur in main, private Session)

### Memory Tools

- `memory_search` - Semantische Suche über indizierte Snippets
- `memory_get` - Gezieltes Lesen einer Markdown Datei

### Vector Memory Search

```json5
{
  agents: {
    defaults: {
      memorySearch: {
        enabled: true,
        provider: "openai", // openai, gemini, voyage, mistral, ollama, local
        model: "text-embedding-3-small",
        fallback: "openai"
      }
    }
  }
}
```

**Auto-Selection** (wenn kein provider gesetzt):
1. `local` wenn `memorySearch.local.modelPath` existiert
2. `openai` wenn OpenAI Key verfügbar
3. `gemini` wenn Gemini Key verfügbar
4. `voyage` wenn Voyage Key verfügbar
5. `mistral` wenn Mistral Key verfügbar
6. Sonst deaktiviert

### Hybrid Search (BM25 + Vector)

Kombiniert semantische und Keyword-Suche:

```json5
{
  agents: {
    defaults: {
      memorySearch: {
        query: {
          hybrid: {
            enabled: true,
            vectorWeight: 0.7,
            textWeight: 0.3,
            mmr: { enabled: true, lambda: 0.7 },  // Diversity
            temporalDecay: { enabled: true, halfLifeDays: 30 }  // Recency
          }
        }
      }
    }
  }
}
```

### QMD Backend (Experimental)

QMD kombiniert BM25 + Vectors + Reranking:

```json5
{
  memory: {
    backend: "qmd",
    qmd: {
      command: "qmd",
      searchMode: "search",
      update: { interval: "5m", debounceMs: 15000 },
      limits: { maxResults: 6, timeoutMs: 4000 }
    }
  }
}
```

**Install**: `bun install -g https://github.com/tobi/qmd`

### Memory Flush (Pre-Compaction)

Automatischer Memory-Flush vor Context-Compaction:

```json5
{
  agents: {
    defaults: {
      compaction: {
        memoryFlush: {
          enabled: true,
          softThresholdTokens: 4000,
          systemPrompt: "Session nearing compaction. Store durable memories now.",
          prompt: "Write lasting notes to memory/YYYY-MM-DD.md; reply with NO_REPLY."
        }
      }
    }
  }
}
```

### CLI Commands

```bash
openclaw memory status
openclaw memory index
openclaw memory search "query"
```

---

## Pairing (Sicherheit)

### DM Pairing

Wenn DM Policy `pairing` ist, erhalten unbekannte Sender einen Code:

```bash
openclaw pairing list telegram
openclaw pairing approve telegram <CODE>
```

**Pairing Codes:**
- 8 Zeichen, uppercase, keine ambiguen Zeichen (`0O1I`)
- **1 Stunde gültig**
- Max 3 pending Requests pro Channel

**Unterstützte Channels**: telegram, whatsapp, signal, imessage, discord, slack, feishu

### Node Pairing (Devices)

```bash
openclaw devices list
openclaw devices approve <requestId>
openclaw devices reject <requestId>

# Node Status
openclaw nodes status
openclaw nodes describe --node <id>
```

### DM Policy Optionen

- `"pairing"` (default): Unbekannte Sender erhalten Pairing-Code
- `"allowlist"`: Nur Sender in `allowFrom`
- `"open"`: Alle DMs erlaubt (mit `allowFrom: ["*"]`)
- `"disabled"`: DMs deaktiviert

---

## Sandboxing

OpenClaw kann Tools in **Docker Containern** ausführen für bessere Isolation.

### Sandbox Modus

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main",  // off | non-main | all
        scope: "session",   // session | agent | shared
        workspaceAccess: "none"  // none | ro | rw
      }
    }
  }
}
```

**mode:**
- `off`: Kein Sandboxing
- `non-main`: Nur Non-Main Sessions (Standard)
- `all`: Alle Sessions

**scope:**
- `session`: Ein Container pro Session
- `agent`: Ein Container pro Agent
- `shared`: Ein Container für alle

**workspaceAccess:**
- `none` (default): Sandbox Workspace unter `~/.openclaw/sandboxes`
- `ro`: Agent Workspace readonly bei `/agent`
- `rw`: Agent Workspace read/write bei `/workspace`

### Docker Image bauen

```bash
# Basis Image
scripts/sandbox-setup.sh

# Mit Common Tools (curl, jq, nodejs, python3, git)
scripts/sandbox-common-setup.sh

# Sandbox Browser
scripts/sandbox-browser-setup.sh
```

### Custom Bind Mounts

```json5
{
  agents: {
    defaults: {
      sandbox: {
        docker: {
          binds: ["/home/user/source:/source:ro", "/var/data:/data:ro"]
        }
      }
    }
  }
}
```

**Sicherheit**: Bind mounts umgehen Sandbox-Filesystem. Sensible Mounts sollten `:ro` sein.

### Setup Command

```json5
{
  agents: {
    defaults: {
      sandbox: {
        docker: {
          setupCommand: "apt-get update && apt-get install -y nodejs",
          network: "none",  // Default: kein Netzwerk
          user: "0:0"  // Root für Package installs
        }
      }
    }
  }
}
```

---

## Elevated Mode

Elevated Mode führt Commands auf dem **Host** statt im Sandbox aus.

### Direktiven

- `/elevated on` - Host execution, behält Exec Approvals
- `/elevated full` - Host execution, überspringt Exec Approvals
- `/elevated ask` - Same as `on`
- `/elevated off` - Deaktiviert

### Verfügbarkeit

```json5
{
  tools: {
    elevated: {
      enabled: true,
      allowFrom: ["whatsapp:+15555550123", "telegram:user:123"]
    }
  }
}
```

**Per-Agent Override**:
```json5
{
  agents: {
    list: [{
      id: "main",
      tools: {
        elevated: { enabled: true, allowFrom: ["telegram:user:456"] }
      }
    }]
  }
}
```

### Was es kontrolliert

- Nur verfügbar wenn Agent **sandboxed** ist
- Erzwingt `exec` auf Gateway Host
- `full` setzt auch `security=full`
- Tool Policy gilt weiterhin - wenn `exec` denied, kann elevated nicht verwendet werden

---

## Lobster (Workflow Automation)

Lobster ist ein **typed workflow runtime** für deterministische Pipelines mit Approval Gates.

### Warum Lobster?

- **Ein Call statt viele**: OpenClaw ruft einmal Lobster auf, bekommt strukturiertes Ergebnis
- **Approvals eingebaut**: Side Effects pausieren bis explizit approved
- **Resumable**: Pausierte Workflows geben Token zum Fortsetzen

### Workflow Example

```bash
inbox list --json | inbox categorize --json | inbox apply --json
```

```json
{
  "action": "run",
  "pipeline": "exec --json --shell 'inbox list --json' | exec --stdin json --shell 'inbox categorize --json' | exec --stdin json --shell 'inbox apply --json' | approve --preview-from-stdin --limit 5 --prompt 'Apply changes?'"
}
```

### Resume after Approval

```json
{
  "action": "resume",
  "token": "<resumeToken>",
  "approve": true
}
```

### LLM Task Plugin

Für strukturierte LLM Steps:

```json5
{
  plugins: {
    entries: { "llm-task": { enabled: true } }
  },
  agents: {
    list: [{ id: "main", tools: { allow: ["llm-task"] } }]
  }
}
```

### Install

```bash
# Auf Gateway Host
# Siehe: https://github.com/openclaw/lobster
```

### Enable

```json5
{
  tools: { alsoAllow: ["lobster"] }
}
```

---

## Nodes (Companion Devices)

Nodes sind Begleitgeräte (iOS/Android/macOS/headless) die sich per WebSocket mit dem Gateway verbinden.

### Node Host starten

```bash
# Foreground
openclaw node run --host <gateway-host> --port 18789 --display-name "Build Node"

# Als Service
openclaw node install --host <gateway-host> --port 18789 --display-name "Build Node"
```

### Pairing

```bash
openclaw devices list
openclaw devices approve <requestId>
```

### Node Commands

**Canvas**:
```bash
openclaw nodes canvas snapshot --node <id> --format png
openclaw nodes canvas present --node <id> --target https://example.com
openclaw nodes canvas eval --node <id> --js "document.title"
openclaw nodes canvas a2ui push --node <id> --text "Hello"
```

**Kamera**:
```bash
openclaw nodes camera snap --node <id>
openclaw nodes camera clip --node <id> --duration 10s
```

**Screen Recording**:
```bash
openclaw nodes screen record --node <id> --duration 10s --fps 10
```

**Location**:
```bash
openclaw nodes location get --node <id> --accuracy precise
```

**Notifications**:
```bash
openclaw nodes notify --node <id> --title "Titel" --body "Nachricht"
```

**System Run**:
```bash
openclaw nodes run --node <id> -- echo "Hello"
```

### Exec auf Node

```bash
# Global
openclaw config set tools.exec.host node
openclaw config set tools.exec.node "<id-or-name>"

# Per Session
/exec host=node security=allowlist node=<id-or-name>
```

---

## Webhooks & Hooks

### Webhook aktivieren

```json5
{
  hooks: {
    enabled: true,
    token: "shared-secret",
    path: "/hooks"
  }
}
```

### Endpoints

**POST /hooks/wake**:
```bash
curl -X POST http://127.0.0.1:18789/hooks/wake \
  -H 'Authorization: Bearer SECRET' \
  -d '{"text":"New email","mode":"now"}'
```

**POST /hooks/agent**:
```bash
curl -X POST http://127.0.0.1:18789/hooks/agent \
  -H 'x-openclaw-token: SECRET' \
  -d '{"message":"Summarize inbox","name":"Email","model":"openai/gpt-5.2-mini"}'
```

### Gmail Webhook

```bash
openclaw webhooks gmail setup --account user@gmail.com
openclaw webhooks gmail run
```

---

## Gateway Protocol

Das Gateway spricht **WebSocket** auf Port 18789 (default):

```
ws://127.0.0.1:18789/
wss://remote-host:18789/
```

### Auth

- **Token**: `Authorization: Bearer <token>`
- **Password**: `Authorization: Basic <base64>`

### RPC Methods

- `config.get` / `config.apply` / `config.patch`
- `sessions.list` / `sessions.send` / `sessions.spawn`
- `gateway.restart` / `gateway.update.run`
- `nodes.invoke` / `nodes.run`
- `cron.*`

---

## Tools (Vollständig)

### File System
- `read` / `write` / `edit` - Dateioperationen
- `apply_patch` - Multi-File Patches

### Execution
- `exec` - Shell Commands
- `process` - Background Process Management

### Web
- `web_search` - Perplexity, Brave, Gemini, Grok, Kimi
- `web_fetch` - URL Content (HTML → markdown)

### Browser
- `browser` - OpenClaw-managed Browser
  - `status`, `start`, `stop`, `tabs`
  - `snapshot` (aria/ai)
  - `screenshot`
  - `act` (click, type, press, hover, drag, select, fill)
  - `navigate`, `evaluate`, `console`

### Canvas & Nodes
- `canvas` - Node Canvas
- `nodes` - Device Commands

### Messaging
- `message` - Cross-channel messaging

### Sessions
- `sessions_list` / `sessions_history` / `sessions_send` / `sessions_spawn`
- `session_status`

### Media
- `image` - Bildanalyse
- `pdf` - PDF Analyse

### Automation
- `cron` - Cron Jobs
- `gateway` - Gateway control

### Tool Profiles

```json5
{
  tools: {
    profile: "coding", // minimal, coding, messaging, full
    deny: ["browser"],
    allow: ["group:fs", "message"]
  }
}
```

**Tool Groups:**
- `group:runtime` - exec, bash, process
- `group:fs` - read, write, edit, apply_patch
- `group:sessions` - sessions_list, sessions_history, sessions_send, sessions_spawn, session_status
- `group:memory` - memory_search, memory_get
- `group:web` - web_search, web_fetch
- `group:ui` - browser, canvas
- `group:messaging` - message
- `group:nodes` - nodes

---

## CLI Commands (Vollständig)

### Setup & Onboarding

```bash
openclaw onboard --install-daemon
openclaw onboard --auth-choice opencode-zen --opencode-zen-api-key "$KEY"
openclaw setup --workspace ~/.openclaw/workspace --wizard
openclaw configure
```

### Gateway

```bash
openclaw gateway --port 18789
openclaw gateway install
openclaw gateway status
openclaw gateway restart
openclaw logs --follow
openclaw logs --limit 200
```

### Channels

```bash
openclaw channels list
openclaw channels add --channel telegram --token $TOKEN
openclaw channels status --probe
openclaw channels login --channel whatsapp
openclaw channels logs --channel whatsapp
```

### Models

```bash
openclaw models list
openclaw models status --probe
openclaw models set anthropic/claude-sonnet-4-5
openclaw models set-image anthropic/claude-sonnet-4-5
openclaw models fallbacks add openai/gpt-5.2
openclaw models auth add --provider openai
openclaw models auth setup-token --provider anthropic
```

### Sessions & Messages

```bash
openclaw sessions
openclaw sessions --active 30
openclaw message send --target +15555550123 --message "Hello"
openclaw agent --message "Help me" --deliver
```

### Tools & Skills

```bash
openclaw skills list
openclaw skills info <name>
openclaw plugins list
openclaw plugins install <path>
```

### Browser

```bash
openclaw browser status
openclaw browser start
openclaw browser screenshot
openclaw browser navigate https://example.com
```

### Cron

```bash
openclaw cron list
openclaw cron add --name "daily" --every "24h" --system-event "Report"
openclaw cron run <job-id>
```

### Nodes

```bash
openclaw nodes list
openclaw nodes status
openclaw nodes camera snap --node <id>
openclaw nodes notify --node <id> --title "Titel"
```

### Config

```bash
openclaw config get agents.defaults.workspace
openclaw config set agents.defaults.heartbeat.every "30m"
openclaw config file
openclaw config validate
```

### Health & Diagnostics

```bash
openclaw health
openclaw doctor
openclaw doctor --fix
openclaw doctor --deep
openclaw status --deep
```

### Security

```bash
openclaw security audit
openclaw security audit --deep
openclaw security audit --fix
openclaw pairing list telegram
openclaw pairing approve telegram <CODE>
openclaw devices list
openclaw devices approve <requestId>
```

### ACP

```bash
openclaw acp
openclaw acp --url wss://host:18789 --token <token>
openclaw acp --session agent:main:main
openclaw acp client
```

---

## Konfiguration (Vollständig)

### Config Pfad

`~/.openclaw/openclaw.json` (JSON5)

### Model Provider (OpenCode Zen)

```json5
{
  env: { OPENCODE_API_KEY: "sk-..." },
  agents: { defaults: { model: { primary: "opencode/claude-opus-4-6" } } }
}
```

### Multi-Channel

```json5
{
  channels: {
    whatsapp: { allowFrom: ["+15555550123"] },
    telegram: { botToken: "123:abc", dmPolicy: "pairing" },
    discord: { botToken: "xyz", dmPolicy: "allowlist", allowFrom: ["user:123"] }
  }
}
```

### Sessions

```json5
{
  session: {
    dmScope: "per-channel-peer",
    threadBindings: { enabled: true, idleHours: 24 },
    reset: { mode: "daily", atHour: 4, idleMinutes: 120 }
  }
}
```

### Heartbeat

```json5
{
  agents: {
    defaults: {
      heartbeat: { every: "30m", target: "last" }
    }
  }
}
```

### Multi-Agent

```json5
{
  agents: {
    list: [
      { id: "main", default: true, workspace: "~/.openclaw/workspace" },
      { id: "work", workspace: "~/.openclaw/workspace-work" }
    ]
  },
  bindings: [
    { agentId: "work", match: { channel: "whatsapp", accountId: "biz" } }
  ]
}
```

### Cron

```json5
{
  cron: {
    enabled: true,
    maxConcurrentRuns: 2,
    sessionRetention: "24h"
  }
}
```

### Webhooks

```json5
{
  hooks: {
    enabled: true,
    token: "${OPENCLAW_HOOKS_TOKEN}",
    defaultSessionKey: "hook:ingress",
    allowRequestSessionKey: false,
    allowedSessionKeyPrefixes: ["hook:"]
  }
}
```

### Config Hot Reload

```json5
{
  gateway: {
    reload: { mode: "hybrid", debounceMs: 300 }
  }
}
```

**Modi:**
- `hybrid` (default): Safe changes sofort, kritische automatisch
- `hot`: Safe changes, Warning für Restart
- `restart`: Bei jeder Änderung
- `off`: Manueller Restart

---

## Environment Variablen

```bash
# Gateway
OPENCLAW_HOME=~/.openclaw
OPENCLAW_STATE_DIR=/path/to/state
OPENCLAW_CONFIG_PATH=/path/to/config.json

# Gateway Auth
OPENCLAW_GATEWAY_TOKEN=token
OPENCLAW_GATEWAY_PASSWORD=password

# Model Provider
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OPENCODE_API_KEY=sk-...

# Remote Gateway
OPENCLAW_REMOTE_URL=wss://host:18789
OPENCLAW_REMOTE_TOKEN=token
```

---

## Control UI & Dashboard

```bash
openclaw dashboard
openclaw tui
```

- Local: http://127.0.0.1:18789/
- Features: Chat, Config, Sessions, Nodes, Memory Search

---

## Troubleshooting

```bash
# Health Check
openclaw health

# Diagnostics
openclaw doctor
openclaw doctor --fix
openclaw doctor --deep

# Logs
openclaw logs --follow
openclaw channels logs --channel whatsapp

# Deep Status
openclaw status --deep
openclaw status --usage

# Model Check
openclaw models status --probe
```

---

## Quick Reference

| Aufgabe | Befehl |
|---------|--------|
| Installation | `npm install -g openclaw@latest` |
| Onboarding | `openclaw onboard --install-daemon` |
| Gateway starten | `openclaw gateway --port 18789` |
| Dashboard | `openclaw dashboard` |
| Status | `openclaw status --deep` |
| Config setzen | `openclaw config set <path> <value>` |
| Channel hinzufügen | `openclaw channels add --channel telegram` |
| Nachricht senden | `openclaw message send --target <id> --message <text>` |
| Logs | `openclaw logs --follow` |
| Doctor | `openclaw doctor --fix` |
| Model setzen | `openclaw models set anthropic/claude-sonnet-4-5` |
| ACP starten | `openclaw acp --session agent:main:main` |
| Node Status | `openclaw nodes status` |
| Security Audit | `openclaw security audit` |
| Memory suchen | `openclaw memory search "query"` |
| Browser Screenshot | `openclaw browser screenshot` |
| Pairing approve | `openclaw pairing approve telegram <CODE>` |

---

## Externe Ressourcen

- Dokumentation: https://docs.openclaw.ai/
- Installation: https://openclaw.ai/install.sh
- ACP Spec: https://agentclientprotocol.com/
