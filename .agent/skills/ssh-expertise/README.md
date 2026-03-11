# SSH Expertise

## Overview
The SSH Expertise skill provides tools for secure remote connections, key management, server automation, and tunneling.

## Tools
- `generate_key_pair` - Generate SSH key pairs (RSA, ED25519)
- `create_config` - Create SSH config entries
- `create_tunnel` - Generate SSH tunnel commands
- `secure_server_checklist` - Server hardening checklist

## Key Generation
```bash
# ED25519 (recommended)
ssh-keygen -t ed25519 -C "comment"

# RSA (legacy)
ssh-keygen -t rsa -b 4096 -C "comment"
```

## SSH Config
```ssh
Host myserver
    HostName 192.168.1.100
    User admin
    Port 22
    IdentityFile ~/.ssh/id_ed25519
    ForwardAgent yes
```

## Tunneling
```bash
# Local port forward
ssh -L 8080:localhost:80 user@remote

# Remote port forward
ssh -R 8080:localhost:80 user@remote

# SOCKS proxy
ssh -D 1080 user@remote
```

## Security Best Practices
1. Use ED25519 keys (or RSA 4096)
2. Disable password authentication
3. Use key-based auth only
4. Configure Fail2Ban
5. Keep SSH version updated
6. Use non-standard port
7. Limit user access
