# Security Baseline Documentation

## Repository Security Capabilities

| Feature | Status | Details |
|---------|--------|---------|
| Secret Scanning | ✅ Enabled | Active monitoring for secrets |
| Push Protection | ✅ Enabled | Blocks secret commits |
| Dependabot Security Updates | ✅ Enabled | Automated vulnerability fixes |
| Private Vulnerability Reporting | ❌ Not Available | Public repository limitation |
| Secret Scanning Non-Provider Patterns | ❌ Disabled | Advanced pattern detection |
| Secret Scanning Validity Checks | ❌ Disabled | Real-time validation |
| Code Scanning Default Setup | ❌ Not Configured | Using custom CodeQL workflow |

## Branch Protection Configuration

### Main Branch Protection
```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "codeql",
      "semgrep", 
      "osv",
      "gitleaks",
      "trufflehog-audit",
      "sbom",
      "actionlint",
      "payments-safety",
      "dast-zap",
      "project-test"
    ]
  },
  "enforce_admins": {
    "enabled": true
  },
  "required_pull_request_reviews": {
    "required_approving_review_count": 2,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "require_last_push_approval": true
  },
  "restrictions": null
}
```

## Required Security Checks (10 Canonical)

| Check Name | Context | Type | Behavior | Status |
|------------|---------|------|----------|--------|
| CodeQL Analysis | `codeql` | SAST | Fail-closed | ✅ |
| Semgrep Analysis | `semgrep` | SAST | Fail-closed | ✅ |
| OSV Scanner | `osv` | SCA | Fail-closed | 🔧 |
| GitLeaks | `gitleaks` | Secrets | Fail-closed | 🔧 |
| TruffleHog Audit | `trufflehog-audit` | Secrets | Audit-only | ✅ |
| SBOM Generation | `sbom` | Supply Chain | Pass-through | ✅ |
| ActionLint | `actionlint` | Infrastructure | Fail-closed | 🔧 |
| Payment Security | `payments-safety` | Domain | Fail-closed | ✅ |
| DAST ZAP | `dast-zap` | DAST | Conditional | ✅ |
| Project Test | `project-test` | Quality | Fail-closed | 🔧 |

**Legend**: ✅ Green | 🔧 Needs Fix | ❌ Failing

---

*Last Updated: $(date +%Y-%m-%d)*
*Repository: HustlerIQ-High-ticket-sales-website*
