# Security & Secure Coding

## Overview
Security & Secure Coding skill provides tools for vulnerability scanning, secure authentication, encryption, and OWASP best practices.

## Tools
- `scan_vulnerabilities` - Scan for security issues
- `add_input_validation` - Add input validation
- `secure_auth` - Generate secure auth code
- `encrypt_data` - Generate encryption utilities
- `get_security_headers` - Get recommended security headers

## OWASP Top 10
1. Injection
2. Broken Authentication
3. Sensitive Data Exposure
4. XML External Entities
5. Broken Access Control
6. Security Misconfiguration
7. XSS
8. Insecure Deserialization
9. Using Components with Known Vulnerabilities
10. Insufficient Logging

## Security Headers
```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

## Input Validation
- Always validate on server side
- Use allowlists not denylists
- Sanitize HTML/script injection
- Type coerce inputs explicitly
