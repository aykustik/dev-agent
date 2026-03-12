# SSH Expertise Examples

## SSH Key Management

### Generate SSH Key
```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

### Add to SSH Agent
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

---

## Remote Connections

### SSH Config
```bash
# ~/.ssh/config
Host production
  HostName 192.168.1.100
  User ubuntu
  IdentityFile ~/.ssh/production_key
```

### Connect
```bash
ssh production
```

---

## Tunneling

### Local Port Forward
```bash
ssh -L 8080:localhost:3000 user@server
```

---

## Using with Skill Loader

```bash
node .agent/core/scripts/skill-loader.js find ssh
```
