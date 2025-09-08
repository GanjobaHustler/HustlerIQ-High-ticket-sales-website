# Pull Request Security Checklist

## Description
<!-- Provide a brief description of the changes -->

## Security Review Checklist

### General Security
- [ ] **No hardcoded secrets** (API keys, passwords, tokens)
- [ ] **No sensitive data** in logs or error messages
- [ ] **Input validation** implemented for all user inputs
- [ ] **Output encoding** applied to prevent XSS
- [ ] **Authentication/authorization** checks in place for new endpoints

### Payment Security (if applicable)
- [ ] **No PAN collection** - uses tokenization only
- [ ] **HMAC signature verification** for webhooks
- [ ] **Idempotency keys** used for all payment operations
- [ ] **Replay attack prevention** (timestamp validation)
- [ ] **TLS 1.2+** enforced for payment communications

### Dependencies & Supply Chain
- [ ] **Dependencies reviewed** for known vulnerabilities
- [ ] **Dependency pinning** applied where appropriate
- [ ] **SBOM updated** if dependencies changed
- [ ] **License compatibility** verified for new dependencies

### Infrastructure Security
- [ ] **Least privilege** principle applied
- [ ] **Network segmentation** maintained
- [ ] **Secure defaults** configured
- [ ] **Monitoring/logging** implemented for security events

### Code Quality
- [ ] **Code reviewed** by at least one other developer
- [ ] **Tests written** and passing
- [ ] **Linting rules** satisfied
- [ ] **Static analysis** warnings addressed

### Compliance
- [ ] **GDPR compliance** maintained (if applicable)
- [ ] **PCI DSS requirements** met (if payment-related)
- [ ] **Security policy** updated if needed
- [ ] **Documentation** updated for security-relevant changes

## Testing
- [ ] **Unit tests** added/updated
- [ ] **Integration tests** passing
- [ ] **Security tests** passing (SAST, SCA, etc.)
- [ ] **Manual security testing** performed

## Deployment
- [ ] **Deployment checklist** reviewed
- [ ] **Rollback plan** prepared
- [ ] **Security monitoring** configured for new features

## Additional Notes
<!-- Any additional security considerations or notes -->

---

**By submitting this PR, I confirm that:**
- I have reviewed the security implications of my changes
- I have followed secure coding practices
- I have not introduced any known security vulnerabilities
- I understand that this code will be subject to security scanning
