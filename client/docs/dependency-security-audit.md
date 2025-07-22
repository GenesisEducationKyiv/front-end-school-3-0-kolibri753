# [Security] Dependency Security Audit Report (Frontend)

Prepared by: Vira Vakhovska | Date: 13.06.2025

## 1. Introduction

This document provides an audit of frontend dependencies used in the **HummingTrack**, aimed at ensuring the security of all third-party packages, compliance with best practices, and identification of potential security risks.

## 2. Audit Methodology

- used `npm audit` to detect known vulnerabilities;
- reviewed packages manually for maintenance status and trustworthiness;
- verified adherence to Armen’s security checklist guidelines provided during lecture.

## 3. Vulnerability Checks

I produced three machine-readable reports under `docs/audit/` and link to them below. All commands should be run from the client's folder.

```bash
npm audit --json > docs/audit/npm-vulnerabilities-report.json
npm ls    --json > docs/audit/npm-dependency-tree.json
npm outdated --json > docs/audit/npm-outdated-report.json
```

- **npm-vulnerabilities-report.json**: reports **0** known advisories against the lock file;

- **npm-dependency-tree.json**: complete SBOM: **343** total packages (187 prod, 89 dev, 68 optional);

- **npm-outdated-report.json**: lists each package’s `current`, `wanted` and `latest` versions.

## 4. Dependency Audit Results

| Package Name             | Purpose and Security Considerations                                   |
| ------------------------ | --------------------------------------------------------------------- |
| @hookform/resolvers      | Integration with Zod for robust, secure form validation.              |
| @mobily/ts-belt          | Utility library actively maintained, reliable with minimal risks.     |
| @tailwindcss/vite        | Frequently updated integration with Tailwind CSS and Vite.            |
| @tanstack/react-table    | Advanced, secure table library, regularly maintained.                 |
| axios                    | Widely used HTTP client with active community and updates.            |
| clsx                     | Minimal utility library with negligible security risks.               |
| eslint-plugin-neverthrow | Provides static code analysis, actively maintained.                   |
| lucide-react             | Trusted, well-maintained icon library.                                |
| neverthrow               | Secure error-handling pattern library, regularly updated.             |
| react                    | Actively maintained core framework, standard security practices.      |
| react-dom                | Stable React package, actively maintained and secure.                 |
| react-hook-form          | Popular form library with secure validation capabilities.             |
| react-router-dom         | Essential routing library, maintained with a strong security record.  |
| react-toastify           | Reliable notification library, actively maintained.                   |
| tailwindcss              | Popular CSS framework, regularly monitored for vulnerabilities.       |
| wavesurfer.js            | Audio visualization tool, regularly patched and secure.               |
| zod                      | Strongly recommended schema validation library for enhanced security. |

**Dev Dependencies:**

| Package Name                | Purpose and Security Considerations                                 |
| --------------------------- | ------------------------------------------------------------------- |
| daisyui                     | Tailwind-based UI components, actively updated and secure.          |
| eslint                      | Standard JavaScript linter, essential for code quality.             |
| eslint-plugin-react-hooks   | Ensures secure and optimal React hook usage.                        |
| eslint-plugin-react-refresh | Supports fast-refresh in React development, minimal security risks. |
| typescript                  | Core language for type-safety, secure and regularly updated.        |
| vite                        | Efficient build tool, actively maintained with security in focus.   |
| vite-plugin-svgr            | Safe and efficient SVG handling plugin.                             |

### Summary

All dependencies are actively maintained with strong community backing and regular updates. No significant security concerns identified based on the manual review and audit.

## 5. Zero-Day Vulnerability Assessment

Zero-day vulnerabilities, undisclosed, unpatched flaws, are mitigated through the following measures:

- **reputable dependencies**: only actively maintained, community-trusted packages are included;
- **manual audit cycles**: `npm audit` is executed on every major merge to catch any new issues;
- **prompt remediation**: whenever a vulnerability is identified, I update the affected dependency and regenerate audit reports.

**Current status:**
No zero-day vulnerabilities have been detected in the project’s dependencies. Ongoing manual audits and advisory monitoring ensure swift response to any future disclosures.

## 6. Compliance with Armen's Security Checklist

| Checklist Item                                                       | Compliance Status          | Notes and Clarifications                                                                                                                                                                                                  |
| -------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DO NOT trust user input                                              | Compliant                  | Inputs validated using Zod.                                                                                                                                                                                               |
| DO NOT use untested packages/libraries                               | Compliant                  | Only trusted, actively maintained packages used.                                                                                                                                                                          |
| Remind backend team about form data                                  | Compliant                  | Regular communication established with backend team (I AM the backend team).                                                                                                                                              |
| Be careful with escaping frameworks                                  | Compliant                  | Avoiding dangerouslySetInnerHTML, no known direct DOM manipulations.                                                                                                                                                      |
| Only “closed scripts”                                                | Compliant                  | Scripts are statically managed, no dynamic injections.                                                                                                                                                                    |
| Use shielding tools (DOMPurify etc)                                  | Not needed for now         | React escapes HTML by default and my codebase contains no dangerouslySetInnerHTML or Markdown/HTML renderers.                                                                                                             |
| CSP headers are mandatory                                            | Out of scope (server-side) | The browser enforces CSP headers that are delivered by the HTTP server, not by the React bundle itself.                                                                                                                   |
| Object prototype freezing (`Object.freeze` or `Object.create(null)`) | Not needed for now         | Prototype freezing guards against libraries that extend Object.prototype at runtime. My codebase consumes JSON only (via axios) and does not expose a public JavaScript API, so the risk is negligible.                   |
| Prototype pollution prevention (`__proto__`, etc.)                   | Compliant                  | npm audit reports no “Prototype Pollution” advisories. The dependency tree shows no historical offenders.                                                                                                                 |
| Dependabot (or Snyk)                                                 | Partial                    | Currently, Dependabot is activated by default within the Genesis repository. However, due to permission limitations on the current repository configuration (Genesis), the GitHub Security tab isn't directly accessible. |
| npm audit fix                                                        | Compliant                  | Regularly executed; 0 vulnerabilities found.                                                                                                                                                                              |
| Update libraries                                                     | Compliant                  | Regular dependency updates implemented.                                                                                                                                                                                   |
| Lock file in git                                                     | Compliant                  | package-lock.json tracked in Git.                                                                                                                                                                                         |
| npm audit / pnpm audit / yarn audit                                  | Compliant                  | Regular npm audits conducted.                                                                                                                                                                                             |
