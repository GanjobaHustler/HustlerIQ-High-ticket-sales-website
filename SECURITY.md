# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. **DO NOT** create a public GitHub issue

### 2. Report privately via:
- **Email**: security@hustleriq.com
- **Subject**: [SECURITY] Brief description of the issue

### 3. Include in your report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 4. Response Timeline:
- **Initial response**: Within 24 hours
- **Vulnerability assessment**: Within 72 hours
- **Fix timeline**: Communicated within assessment

## Security Measures

This repository implements comprehensive security controls:

### Authentication & Authorization
- JWT-based authentication with secure secrets
- Role-based access control (RBAC)
- Multi-factor authentication (MFA) for admin accounts

### Payment Security (PCI DSS Compliant)
- **NO direct PAN collection** - Uses tokenization
- HMAC signature verification for webhooks
- Idempotency keys for all payment operations
- Replay attack prevention (5-minute window)
- TLS 1.2+ encryption for all payment communications

### Code Security
- All GitHub Actions pinned to specific SHAs
- Automated secret scanning with push protection
- Static Application Security Testing (SAST) via CodeQL and Semgrep
- Software Composition Analysis (SCA) via OSV Scanner
- Dynamic Application Security Testing (DAST) via ZAP

### Infrastructure Security
- Container image scanning (if applicable)
- Infrastructure as Code (IaC) security scanning
- Software Bill of Materials (SBOM) generation
- Supply chain security with provenance attestation

### Branch Protection
- Required pull request reviews (2 approvals)
- Required status checks before merge
- Signed commits enforcement
- Linear history enforcement
- Force push restrictions

### Monitoring & Alerting
- Dependabot security updates
- Vulnerability alerts
- OpenSSF Scorecard monitoring
- Weekly security scans

## Security Contacts

- **Security Team**: security@hustleriq.com
- **Primary Contact**: [Your Name] - security-lead@hustleriq.com

## Vulnerability Disclosure Policy

We follow a responsible disclosure model:

1. **Private disclosure** to our security team
2. **Coordinated fix** development and testing
3. **Public disclosure** after fix is deployed (typically 90 days)

## Bug Bounty

We currently do not offer a formal bug bounty program, but we appreciate security researchers who help improve our security posture.

## Security.txt

For automated security tools, see: `/.well-known/security.txt`
