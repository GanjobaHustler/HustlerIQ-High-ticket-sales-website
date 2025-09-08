# Security Policy

## Reporting Security Vulnerabilities

We take security seriously. If you discover a security vulnerability, please report it to us privately.

### How to Report

1. **Email**: security@hustleriq.com
2. **Expected Response Time**: Within 24 hours for acknowledgment, 72 hours for initial assessment
3. **PGP Key**: Available at `/.well-known/security.txt`

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Proof-of-concept code (if applicable)
- Your contact information

## Security Measures

### DevSecOps Pipeline

Our security pipeline includes:

#### 1. Static Application Security Testing (SAST)
- **CodeQL**: Semantic code analysis for vulnerabilities
- **Semgrep**: Pattern-based security scanning
- **Security Events**: SARIF integration with GitHub Security tab

#### 2. Software Composition Analysis (SCA)
- **OSV Scanner**: Open source vulnerability detection
- **SBOM Generation**: Software Bill of Materials tracking
- **Dependency Monitoring**: Automated vulnerability alerts

#### 3. Secret Detection
- **GitLeaks**: Historical commit scanning (fail-closed)
- **TruffleHog**: Secret pattern detection (audit-only)
- **Branch Protection**: Prevents accidental secret commits

#### 4. Dynamic Security Testing
- **OWASP ZAP**: Baseline security scanning
- **DAST Integration**: Automated penetration testing
- **Security Headers**: Validation and enforcement

#### 5. Payment Security
- **PCI DSS Compliance**: No direct PAN collection
- **Webhook Security**: HMAC signature verification
- **Replay Protection**: 5-minute window enforcement
- **Idempotency**: Duplicate charge prevention

### Security Requirements

#### Branch Protection
All production branches require:
- ✅ 10 Required Status Checks (canonical job names):
  1. `CodeQL Analysis (SAST)` (sast-codeql)
  2. `Semgrep Analysis (SAST)` (sast-semgrep)  
  3. `OSV Scanner (SCA)` (sca-osv)
  4. `GitLeaks` (gitleaks)
  5. `TruffleHog` (trufflehog-audit)
  6. `SBOM Generation` (sbom)
  7. `ActionLint` (actionlint)
  8. `Payment Security Checks` (payments-safety)
  9. `ZAP Baseline Scan` (dast-zap)
  10. `Project Test` (project-test)
- 🔒 Administrator enforcement
- 🚫 Force push disabled
- 📝 Up-to-date branch required

#### Security Scanning Schedule
- **Real-time**: Push/PR triggered scans
- **Weekly**: Full DAST scanning
- **Monthly**: Comprehensive security review
- **Quarterly**: Threat model updates

### Incident Response

#### Response Team
- **Security Lead**: Primary contact
- **Development Lead**: Technical assessment
- **DevOps Lead**: Infrastructure response
- **Legal/Compliance**: Regulatory requirements

#### Response Timeline
1. **0-1 hour**: Initial triage and containment
2. **1-4 hours**: Root cause analysis
3. **4-24 hours**: Fix development and testing
4. **24-72 hours**: Deployment and verification
5. **1 week**: Post-incident review

### Security Controls

#### Authentication & Authorization
- Multi-factor authentication required
- Role-based access control (RBAC)
- Principle of least privilege
- Regular access reviews

#### Data Protection
- Encryption at rest and in transit
- Data classification framework
- Privacy by design principles
- GDPR/CCPA compliance

#### Infrastructure Security
- Network segmentation
- Security monitoring and alerting
- Regular security assessments
- Patch management procedures

### Compliance

We maintain compliance with:
- **PCI DSS**: Payment card security
- **SOC 2 Type II**: Security controls
- **GDPR**: Data protection
- **CCPA**: California privacy rights
- **ISO 27001**: Information security management

### Security Training

All team members receive:
- Security awareness training
- Secure coding practices
- Incident response procedures
- Regular security updates

### Contact Information

- **Security Team**: security@hustleriq.com
- **Bug Bounty Program**: bounty@hustleriq.com
- **Emergency Contact**: +1-555-SECURITY

### Security.txt

Security contact information is available at:
- `/.well-known/security.txt`
- `/security.txt`

---

**Last Updated**: $(date +%Y-%m-%d)
**Version**: 1.0
