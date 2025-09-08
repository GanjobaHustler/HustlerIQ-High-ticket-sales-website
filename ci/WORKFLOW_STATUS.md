# Workflow Status Analysis
*Generated: September 8, 2025*

## Workflow Inventory Summary

### ✅ **REQUIRED WORKFLOWS (REQ)**
These are the 10 canonical required checks enforced by branch protection:

1. **Security Baseline Validation** (codeql, semgrep, osv, gitleaks, sbom) - ID: 187501346 - ACTIVE
2. **TruffleHog Secret Audit** (trufflehog-audit) - ID: 187530849 - ACTIVE  
3. **Action Lint** (actionlint) - ID: 187530850 - ACTIVE
4. **Payments Safety** (payments-safety) - ID: 187501343 - ACTIVE
5. **DAST with ZAP** (dast-zap) - ID: 187501342 - ACTIVE
6. **Project Test Suite** (project-test) - ID: 187501344 - ACTIVE

### ⚠️ **NON-REQUIRED WORKFLOWS (NONREQ)**
These workflows are not part of the 10 canonical required checks:

7. **OpenSSF Scorecard** - ID: 187501345 - ACTIVE (Keep scheduled-only)
8. **Security.txt Validation** - ID: 187501347 - ACTIVE (Consider required)

## Recent Run Analysis
*Based on last 20 runs across all workflows*
Action Lint | failure | 2 | 2025-09-08T19:06:01Z
Security.txt Validation | success | 15 | 2025-09-08T19:06:01Z
Security Baseline Validation | failure | 15 | 2025-09-08T19:06:01Z
Payments Safety | success | 15 | 2025-09-08T19:06:01Z
Project Test Suite |  | 15 | 2025-09-08T19:06:01Z
TruffleHog Secret Audit | failure | 2 | 2025-09-08T19:06:01Z
Action Lint | failure | 1 | 2025-09-08T19:02:45Z
Security.txt Validation | success | 14 | 2025-09-08T19:02:45Z
TruffleHog Secret Audit | failure | 1 | 2025-09-08T19:02:45Z
Payments Safety | success | 14 | 2025-09-08T19:02:45Z
