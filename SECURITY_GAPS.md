# Security Capabilities Probe Results

| Feature | Available? | Enabled? | Scope | Action Taken | Remediation |
|---------|------------|----------|-------|--------------|-------------|
| Secret Scanning + Push Protection | ✅ Yes | ✅ Enabled | Repo | Already active | N/A |
| Private Vulnerability Reporting | ❌ No | ❌ N/A | Repo | None | Requires GitHub Pro/Team plan |
| Merge Queue | ❌ No | ❌ N/A | User Account | None | Requires organization with GitHub Enterprise |
| Code Scanning Defaults | ✅ Yes | ❌ Not set | Repo | Will enable | N/A |
| Required Reviewers for Environments | ✅ Yes | ❌ Not configured | Repo | Will configure | N/A |
| Enforce Signed Commits/Tags | ✅ Yes | ❌ Not configured | Repo | Will configure | N/A |
| Require Code Owner Review | ✅ Yes | ❌ Not configured | Repo | Will configure | N/A |
| Require Branches Up-to-Date | ✅ Yes | ❌ Not configured | Repo | Will configure | N/A |
| Require Approval of Most Recent Push | ✅ Yes | ❌ Not configured | Repo | Will configure | N/A |
| Restrict Who Can Dismiss Reviews | ✅ Yes | ❌ Not configured | Repo | Will configure | N/A |

## Plan/Permission Gaps

### Private Vulnerability Reporting
- **Status**: Not available on free tier
- **API Response**: `"private_vulnerability_reporting_enabled": null`
- **Required Plan**: GitHub Pro or Team
- **Workaround**: Using public security policy and contact info

### Merge Queue
- **Status**: Not available for user accounts
- **Required**: Organization with GitHub Enterprise
- **Workaround**: Implementing strict branch protection with required checks

### Organization-Level Features
- **Status**: User account (not organization)
- **Impact**: Cannot use team-based restrictions, organization security policies
- **Workaround**: Using user-based restrictions where possible

## Next Steps
1. Enable all available security features at repository level
2. Consider upgrading to GitHub Pro for enhanced security features
3. Consider creating organization for team-based security controls
